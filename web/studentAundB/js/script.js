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
let xValue = 0;


function init() {


    let chart = createChart();
    getChartData(sharesAddr, createNewGraph, chart);
    getChartData(sharesAddr, updateChart, chart);
    setInterval(function () {

        getData(messagesAddr, getMessage);
        getData(revenueAddr, getUmsaetze);
        getData(rankingAddr, getUpdateRangliste);
        getData(userAddr, getKontostand);
        getData(depotAddr, createChart);
        getData(sharesAddr, getShareName);
        getChartData(sharesAddr, updateChart, chart);
    }, updateInterval);


    document.getElementById("kaufen").onclick = function () {
        getData(depotAddr, buyShares);
    };

    document.getElementById("verkaufen").onclick = function () {
        getData(depotAddr, sellShares);
    };


}

function createChart() {

    let chart = new Chart(document.getElementById("chart"), {
        type: 'line',
        options: {
            title: {
                display: true,
                text: 'AKTIENKURSE'
            },  animation: {
                duration: 0,
            }, labels: { showLabels: 10 }
        }
    });

    chart.update();


    return chart;


}

function getChartData(url, successCallBack, chart) {
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



function updateChart(save, chart){
    xValue++;

    chart.data.labels.push(xValue);
    if (save.length !== 0) {
        for (let i = 0; i < save.length; i++) {
            chart.data.datasets[i].data.push(save[i].preis);
        }
    }
    
chart.update();

}

function createNewGraph(save, chart) {

    for (let i = 0; i < save.length; i++) {
        let newGraph = {
            label: save[i].name,
            data: [],
            backgroundColor: getRandomColor(),
            borderWidth: 3,
            fill: false,
            visibility:true,

        };
        chart.data.datasets.push(newGraph);


    }
    chart.update();
}

function getRandomColor() {
    let letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function getKontostand(userData) {
    const name = document.getElementById("benutzer");
    const kontostand = document.getElementById("kontostand");
    if (userData != null) {


        // alert("Name: "+ userData.name);
        // alert("Kontostand: "+ userData.kontostand);
        name.innerText = userData.name;
        kontostand.innerText = extround(userData.kontostand, 2);


    }
}

let currentShare = 0;

function getShareName(shares) {
    //für Aktienname in dropdownmenue
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
    if (anzahl <= 0 || isNaN(anzahl)) {
        document.getElementById("anzahl").value = "";
        alert("Bitte eine positive Zahl eingeben");
        return;
    }
    let depot = shares.positionen;
    for (let i = 0; i < depot.length; i++) {
        if (depot[i].aktie.name === depot[aktienNummer].aktie.name) {
            if (depot[i].aktie.anzahlVerfuegbar < anzahl) {
                alert("Es sind leider nicht mehr so viele Aktien von " + depot[i].aktie.name + " verfügbar")
            }

        }
    }
    if (anzahl * depot[aktienNummer].aktie.preis > document.getElementById("kontostand").innerHTML && depot[aktienNummer].aktie.anzahlVerfuegbar >= anzahl) {
        alert("Sie haben nicht genug Geld für ihren Kauf");
    }


    depot[aktienNummer].anzahl = anzahl;
    buySell(depot[aktienNummer]);


}

function buySell(aktie) {
    document.getElementById("anzahl").value = "";
    let xhr = new XMLHttpRequest();
    xhr.open("POST", addRevenueAddr, true);
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.send(JSON.stringify(aktie));

}


function getUpdateRangliste(placement) {
//für die Rangliste


    placement.sort(function (a, b) {
        return b.summe - a.summe;
    });
    let rangliste = document.getElementById("rangliste");
    // if (rangliste.childElementCount > 0) {
    //     let rangliste = document.createElement("div");
    //     rangliste.id = "rangliste";
    // }
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
    if (anz === 0) {
        alert("Sie können keine Aktie verkaufen die sie nicht besitzen");
    }
    if (anz !== 0 && anz < anzahl) {
        alert("Verkauf fehlgeschlagen! Sie wollten " + anzahl + " Aktien von " + depot[aktienNummer].aktie.name + " verkaufen, haben aber nur noch " + anz + " Aktien im Besitz");
    }

    depot[aktienNummer].anzahl = anzahl * -1;
    buySell(depot[aktienNummer]);


}


function getUmsaetze(umsaetze) {

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

    let dispensableMsg = 0;
    if (messages.length > 50) {
        dispensableMsg = messages.length - 50;
    }


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


    // }


}


function getData(url, successCallback) {
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