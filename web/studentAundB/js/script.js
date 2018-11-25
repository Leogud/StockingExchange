window.onload = init;
const updateInterval = 1000;
const url = "http://localhost:3000";
const userAddr = "/data/userData";
const depotAddr = "/data/depot";
const sharesAddr = "/data/alleAktien";
const addRevenueAddr = "/data/umsaetze/add";
const rankingAddr = "/data/besitzAlle";
const revenueAddr = "/data/umsaetze";
const messagesAddr = "/data/nachrichten";
let xValue = 0;   //Zähler für Diagramm
let timeCounter = 0;  //Neu Zähler für Diagramm

function init() {


    let chart = createChart();
    getChartData(sharesAddr, createNewGraph, chart);
    getChartData(sharesAddr, updateChart, chart);

    setInterval(function () {
        //Intervall=1 s, alle Getter jede Sekunde aufrufen
        getData(messagesAddr, getMessage);
        getData(revenueAddr, getUmsaetze);
        getData(rankingAddr, getUpdateRangliste);
        getData(userAddr, getKontostand);
        getData(depotAddr, createChart);
        getData(sharesAddr, getShareName);
        //Überprüfung Diagramm 15 Punkte hat, wenn ja neues Diagramm
        if (timeCounter < 15) {
            getChartData(sharesAddr, updateChart, chart);
        } else {
            timeCounter = 0;
            chart = createChart();
            getChartData(sharesAddr, createNewGraph, chart);
            getChartData(sharesAddr, updateChart, chart);
        }
    }, updateInterval);

    //wenn der Kaufen-Button angeklickt wird
    document.getElementById("kaufen").onclick = function () {
        getData(depotAddr, buyShares);
    };

    //wenn der Verkaufen-Button angeklickt wird
    document.getElementById("verkaufen").onclick = function () {
        getData(depotAddr, sellShares);
    };


}

function createChart() {
// neues Chart mit Chart.js
    let chart = new Chart(document.getElementById("chart"), {
        type: 'line',
        options: {
            title: {
                display: true,
                text: 'AKTIENKURSE'
            }, animation: {
                duration: 0,
            },
        }
    });

    chart.update();


    return chart;


}

function getChartData(url, successCallBack, chart) {
    //Getter für Chart, weil chart als Übergabe nötig
    let request = new XMLHttpRequest();
    request.open("GET", url, true);
    request.onreadystatechange = function () {
        if (request.readyState === 4 && request.status === 200) {

            successCallBack(JSON.parse(request.responseText), chart);


        }
        if (request.readyState !== 4 && request.status !== 200) {
            alert("Problem with the server")
        }
    };
    request.send(null);
}


function updateChart(save, chart) {
    // xValue-> Zeitzähler für Diagramm, timeCounter-> Abbruch
    //pusht neue Daten vom Getter zum Diagramm
    xValue++;
    timeCounter++;

    chart.data.labels.push(xValue);
    if (save.length !== 0) {
        for (let i = 0; i < save.length; i++) {
            chart.data.datasets[i].data.push(save[i].preis);
        }
    }


    chart.update();

}

function createNewGraph(save, chart) {
//erstellt für jede Aktie einen Graphen im Diagramm
    for (let i = 0; i < save.length; i++) {
        let newGraph = {
            label: save[i].name,
            data: [],
            backgroundColor: getRandomColor(),
            borderWidth: 3,
            fill: false,
            visibility: true,

        };
        chart.data.datasets.push(newGraph);


    }
    chart.update();
}

function getRandomColor() {
    //random color function für Farben im Diagramm
    let letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function getKontostand(userData) {
    // zeigt aktuellen Kontostand des angemeldeten Users
    const name = document.getElementById("benutzer");
    const kontostand = document.getElementById("kontostand");
    if (userData != null) {


        name.innerText = userData.name;
        kontostand.innerText = extround(userData.kontostand, 2);


    }
}

//damit die als letztes ausgewählte Aktie nicht während der Aktualisierung verschwindet
let currentShare = 0;

function getShareName(shares) {
    //für Aktiennamen im dropdownmenue
    const select = document.getElementById('aktien');
    currentShare = select.value;


    for (let i = 0; i < shares.length; i++) {
        select.options[i] = new Option(shares[i].name, i.toString());
    }
    select.selectedIndex = currentShare;

}

function buyShares(shares) {
    let aktienNummer = document.getElementById("aktien").value;
    let anzahl = document.getElementById("anzahl").value;
    //Fehlermeldung wenn die Eingabe Buchstaben oder eine negative Zahl enthält
    if (anzahl <= 0 || isNaN(anzahl)) {
        document.getElementById("anzahl").value = "";
        alert("Bitte eine positive Zahl eingeben");
        return;
    }
    let depot = shares.positionen;
    //Überprüfung ob es so viele Aktien gibt wie gekauft werden wollen
    for (let i = 0; i < depot.length; i++) {
        if (depot[i].aktie.name === depot[aktienNummer].aktie.name) {
            if (depot[i].aktie.anzahlVerfuegbar < anzahl) {
                alert("Es sind leider nicht mehr so viele Aktien von " + depot[i].aktie.name + " verfügbar")
            }

        }
    }
    //Kontostand mit dem Aktienpreis * Anzahl verglichen um zu schauen ob man sich es leisten kann
    if (anzahl * depot[aktienNummer].aktie.preis > document.getElementById("kontostand").innerHTML && depot[aktienNummer].aktie.anzahlVerfuegbar >= anzahl) {
        alert("Sie haben nicht genug Geld für ihren Kauf");
    }


    depot[aktienNummer].anzahl = anzahl;
    buySell(depot[aktienNummer]);


}


function buySell(aktie) {
    //post Funktion
    document.getElementById("anzahl").value = "";
    let xhr = new XMLHttpRequest();
    xhr.open("POST", addRevenueAddr, true);
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.send(JSON.stringify(aktie));

}


function getUpdateRangliste(placement) {
//für die Rangliste zeigt aktuell möglichen Kontostand der Person, wenn direkt alle Aktien verkauft werden


    placement.sort(function (a, b) {
        return b.summe - a.summe;
    });
    let rangliste = document.getElementById("rangliste");
    rangliste.innerText = "Rangliste";
    for (let i = 0; i < placement.length; i++) {

        let div = document.createElement("div");
        rangliste.appendChild(div);
        div.innerText = placement[i].name + "    " + extround(placement[i].summe, 2) + " €";


    }
}

function sellShares(shares) {
    let aktienNummer = document.getElementById("aktien").value;
    let anzahl = document.getElementById("anzahl").value;
    aktienNummer.selectedIndex = 0;
    //Fehlermeldung wenn die Eingabe Buchstaben oder eine negative Zahl enthält
    if (anzahl <= 0 || isNaN(anzahl)) {
        document.getElementById("anzahl").value = "";
        alert("Bitte eine positive Zahl eingeben");
        return;
    }
    let anz = 0;
    let depot = shares.positionen;
    for (let i = 0; i < depot.length; i++) {
        if (depot[i].aktie.name === depot[aktienNummer].aktie.name) {
            anz = depot[i].anzahl;
        }
    }
    //Überprüfung ob sich die ausgewählte Aktie im Besitz befindet
    if (anz === 0) {
        alert("Sie können keine Aktie verkaufen die sie nicht besitzen");
    }
    //Überprüfung ob man die Anzahl die man verkaufen will im Besitz hat
    if (anz !== 0 && anz < anzahl) {
        alert("Verkauf fehlgeschlagen! Sie wollten " + anzahl + " Aktien von " + depot[aktienNummer].aktie.name + " verkaufen, haben aber nur noch " + anz + " Aktien im Besitz");
    }

    depot[aktienNummer].anzahl = anzahl * -1;
    buySell(depot[aktienNummer]);


}


function getUmsaetze(umsaetze) {
//zeigt neuste Umsätze zuerst
    let umsatz = document.getElementById("umsaetze");


    let kaufen = [];

    umsatz.innerText = "";
    umsatz.innerText = "Umsätze" + "\n";
    for (let i = 0; i < umsaetze.length; i++) {
        if (umsaetze[i].anzahl > 0) {
            kaufen[i] = "Von " + umsaetze[i].aktie.name + " gekauft " + umsaetze[i].anzahl + "\n";
        } else {
            kaufen[i] = "Von " + umsaetze[i].aktie.name + " verkauft " + -umsaetze[i].anzahl + "\n";
        }

    }
    kaufen = kaufen.reverse();
    for (let i = 0; i < kaufen.length; i++) {
        umsatz.innerText += kaufen[i];
    }
}

function extround(zahl, n_stelle) {
    zahl = (Math.round(zahl * n_stelle) / n_stelle);
    return zahl;
}


function getMessage(messages) {
    let nachrichten = document.getElementById("nachrichten");
    nachrichten.innerText = "Nachrichten";

    //Das div auf die 50 neuesten Nachrichten begrenzen
    let dispensableMsg = 0;
    if (messages.length > 50) {
        dispensableMsg = messages.length - 50;
    }

    //Mit dem Object aus der Nachrichtenschnittstelle einen geeigneten Satz formen
    for (let i = messages.length; i > dispensableMsg; i--) {
        let nachricht = "Um ";
        nachricht += messages[i - 1].uhrzeit;
        nachricht += " Uhr";
        if (messages[i - 1].text.charAt(0) === "K") {
            nachricht += " kaufte";
            nachricht += messages[i - 1].text.substring(5, messages[i - 1].text.lastIndexOf(":"));
            let substr2 = messages[i - 1].text.substring(messages[i - 1].text.lastIndexOf(":") + 1, messages[i - 1].text.lastIndexOf(" "));
            nachricht += substr2;
            if (substr2 !== " 1") {
                nachricht += " Aktien";
            } else {
                nachricht += " Aktie";
            }
            nachricht += " von";
            nachricht += messages[i - 1].text.substring(messages[i - 1].text.lastIndexOf(" "));
        } else {
            nachricht += " verkaufte";
            nachricht += messages[i - 1].text.substring(8, messages[i - 1].text.lastIndexOf(":"));
            let substr2 = messages[i - 1].text.substring(messages[i - 1].text.lastIndexOf(":") + 1, messages[i - 1].text.lastIndexOf(" "));
            nachricht += substr2;
            if (substr2 !== " 1") {
                nachricht += " Aktien";
            } else {
                nachricht += " Aktie";
            }
            nachricht += " von";
            nachricht += messages[i - 1].text.substring(messages[i - 1].text.lastIndexOf(" "));
        }
        let div = document.createElement("div");
        nachrichten.appendChild(div);
        div.innerText = nachricht;
    }


}


function getData(url, successCallback) {
    //get Funktion
    let request = new XMLHttpRequest();
    request.open("GET", url, true);
    request.onreadystatechange = function () {
        if (request.readyState === 4 && request.status === 200) {

            successCallback(JSON.parse(request.responseText));


        }
        if (request.readyState !== 4 && request.status !== 200) {
            alert("Problem with the server")
        }
    };
    request.send(null);
}