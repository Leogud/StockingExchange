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
let save = null;
let userData = null;


function init() {
    let chart = new CanvasJS.Chart("chartContainer", {
        animationEnabled: true,
        theme: "light2", // "light1", "light2", "dark1", "dark2"
        title: {
            text: "Alle Aktien"
        },
        axisY: {
            title: "Wert"
        },
        data: [{
            type: "column",
            showInLegend: true,
            legendMarkerColor: "grey",
            legendText: "aktualisiert jede Sekunde",
            dataPoints: []
        }]
    });
    chart.render();


    // const dps = []; // dataPoints
    // const chart = new CanvasJS.Chart("chartContainer", {
    //     title: {
    //         text: "Aktienkurse"
    //     },
    //     axisY: {
    //         includeZero: false
    //     },
    //     data: [{
    //         type: "line",
    //         dataPoints: dps
    //     }]
    // });
    function updateChart() {

        // count = count || 1;
        //
        // for (let j = 0; j < count; j++) {
        //     yVal = yVal + Math.round(5 + Math.random() * (-5 - 5));
        //     dps.push({
        //         x: xVal,
        //         y: yVal
        //     });
        //     xVal++;
        // }
        //
        // if (dps.length > dataLength) {
        //     dps.shift();
        // }


        let http2 = new XMLHttpRequest();
        let name = document.getElementById("Benutzer");
        let kontostand = document.getElementById("Kontostand");
        //für benutzernamen und kontostand
        http2.open("GET", url + "/data/userData", true);
        http2.onreadystatechange = function () {
            if (http2.readyState === 4 && http2.status === 200) {

                userData = JSON.parse(http2.responseText);


            }
        };
        if (userData != null) {


            // alert("Name: "+ userData.name);
            // alert("Kontostand: "+ userData.kontostand);
            name.innerText = "Name: " + userData.name;
            kontostand.innerText = "Kontostand: " + extround(userData.kontostand, 2) + "€";


        }
        http2.send(null);


        //für depot und chart
        let http = new XMLHttpRequest();
        http.open("GET", url + "/data/depot", true);
        http.onreadystatechange = function () {
            if (http.readyState === 4 && http.status === 200) {

                save = JSON.parse(http.responseText);


            }
        };


        if ((save != null) && (chart.options.data[0].dataPoints.length === 0)) {
            let data = save.positionen;
            for (let i = 0; i < data.length; i++) {

                chart.options.data[0].dataPoints.push({y: data[i].aktie.preis, label: data[i].aktie.name});


                // chart.options.data[0].dataPoints.push({y: data[i].aktie.preis, label: data[i].aktie.name});


                //   chart.options.data[0].dataPoints.push({y: data[i].aktie.preis, label: data[i].aktie.name});
                //chart.render();
                //
                // alert(data[i].aktie.preis+"  "+ data[i].aktie.name);

            }

            chart.render();

        } else if ((save != null) && (chart.options.data[0].dataPoints.length > 0)) {
            let data = save.positionen;
            for (let i = 0; i < data.length; i++) {
                chart.options.data[0].dataPoints[i].y = data[i].aktie.preis;
            }
            chart.render();
        }

        http.send(null);


    }


    // updateChart(dataLength);


    setInterval(function () {
        updateChart();
        getData(messagesAddr, getMessage);
        getData(revenueAddr, getUmsaetze);
        getData(rankingAddr, getUpdateRangliste);

    }, updateInterval);

    setInterval(function () {
        getData(sharesAddr, getShareName);
    }, 5000);

    document.getElementById("kaufen").onclick = function () {
        getData(sharesAddr, buyShares);
    };

    document.getElementById("verkaufen").onclick = function () {
        getData(sharesAddr, sellShares);
    };


}


function getShareName(shares) {

    //für Aktienname in dropdownmenue
    const select = document.getElementById('aktien');

    for (let i = 0; i < shares.length; i++) {
        select.options[i] = new Option(shares[i].name, i.toString());
    }

}

function buyShares(shares) {
    let aktienNummer = document.getElementById("aktien").value;
    let anzahl = document.getElementById("anzahl").value;
    if (anzahl <= 0 || isNaN(anzahl)) {
        document.getElementById("anzahl").value = "0";
        alert("Bitte eine positive Zahl eingeben");
        return;
    }


    buyForReal(shares[aktienNummer], anzahl);


}

function buyForReal(aktie, anzahl) {
    document.getElementById("anzahl").value = "";
    let xhr = new XMLHttpRequest();
    xhr.open("POST", addRevenueAddr, true);
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.send('{"aktie":' + JSON.stringify(aktie) + ',"anzahl":' + anzahl + '}');

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
    if (anzahl <= 0 || isNaN(anzahl)) {
        document.getElementById("anzahl").value = "0";
        alert("Bitte eine positive Zahl eingeben");
        return;
    }


    buyForReal(shares[aktienNummer], anzahl * -1);


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

// let anzahlNachrichten = 0;

function getMessage(messages) {
    let nachrichten = document.getElementById("nachrichten");

    nachrichten.innerText = "Nachrichten";


    // if (anzahlNachrichten !== messages.length) {
    //     anzahlNachrichten = messages.length;
    for (let i = messages.length; i > 0; i--) {
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