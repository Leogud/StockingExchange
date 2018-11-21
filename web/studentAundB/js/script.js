window.onload = init;
const updateInterval = 1000;
const url = "http://localhost:3000";
let save = null;
let userData = null;
let placement = null;


function init() {
    var chart = new CanvasJS.Chart("chartContainer", {
        theme:"light2",
        animationEnabled: true,
        title:{
            text: "Game of Thrones Viewers of the First Airing on HBO"
        },
        axisY :{
            includeZero: false,
            title: "Number of Viewers",
            suffix: "mn"
        },
        toolTip: {
            shared: "true"
        },
        legend:{
            cursor:"pointer",
            itemclick : toggleDataSeries
        },
        data: [{
            type: "spline",
            visible: false,
            showInLegend: true,
            yValueFormatString: "##.00mn",
            name: "Season 1",
            dataPoints: [
                { label: "Ep. 1", y: 2.22 },
                { label: "Ep. 2", y: 2.20 },
                { label: "Ep. 3", y: 2.44 },
                { label: "Ep. 4", y: 2.45 },
                { label: "Ep. 5", y: 2.58 },
                { label: "Ep. 6", y: 2.44 },
                { label: "Ep. 7", y: 2.40 },
                { label: "Ep. 8", y: 2.72 },
                { label: "Ep. 9", y: 2.66 },
                { label: "Ep. 10", y: 3.04 }
            ]
        },
            {
                type: "spline",
                showInLegend: true,
                visible: false,
                yValueFormatString: "##.00mn",
                name: "Season 2",
                dataPoints: [
                    { label: "Ep. 1", y: 3.86 },
                    { label: "Ep. 2", y: 3.76 },
                    { label: "Ep. 3", y: 3.77 },
                    { label: "Ep. 4", y: 3.65 },
                    { label: "Ep. 5", y: 3.90 },
                    { label: "Ep. 6", y: 3.88 },
                    { label: "Ep. 7", y: 3.69 },
                    { label: "Ep. 8", y: 3.86 },
                    { label: "Ep. 9", y: 3.38 },
                    { label: "Ep. 10", y: 4.20 }
                ]
            },
            {
                type: "spline",
                visible: false,
                showInLegend: true,
                yValueFormatString: "##.00mn",
                name: "Season 3",
                dataPoints: [
                    { label: "Ep. 1", y: 4.37 },
                    { label: "Ep. 2", y: 4.27 },
                    { label: "Ep. 3", y: 4.72 },
                    { label: "Ep. 4", y: 4.87 },
                    { label: "Ep. 5", y: 5.35 },
                    { label: "Ep. 6", y: 5.50 },
                    { label: "Ep. 7", y: 4.84 },
                    { label: "Ep. 8", y: 4.13 },
                    { label: "Ep. 9", y: 5.22 },
                    { label: "Ep. 10", y: 5.39 }
                ]
            },
            {
                type: "spline",
                showInLegend: true,
                yValueFormatString: "##.00mn",
                name: "Season 4",
                dataPoints: [
                    { label: "Ep. 1", y: 6.64 },
                    { label: "Ep. 2", y: 6.31 },
                    { label: "Ep. 3", y: 6.59 },
                    { label: "Ep. 4", y: 6.95 },
                    { label: "Ep. 5", y: 7.16 },
                    { label: "Ep. 6", y: 6.40 },
                    { label: "Ep. 7", y: 7.20 },
                    { label: "Ep. 8", y: 7.17 },
                    { label: "Ep. 9", y: 6.95 },
                    { label: "Ep. 10", y: 7.09 }
                ]
            },
            {
                type: "spline",
                showInLegend: true,
                yValueFormatString: "##.00mn",
                name: "Season 5",
                dataPoints: [
                    { label: "Ep. 1", y: 8 },
                    { label: "Ep. 2", y: 6.81 },
                    { label: "Ep. 3", y: 6.71 },
                    { label: "Ep. 4", y: 6.82 },
                    { label: "Ep. 5", y: 6.56 },
                    { label: "Ep. 6", y: 6.24 },
                    { label: "Ep. 7", y: 5.40 },
                    { label: "Ep. 8", y: 7.01 },
                    { label: "Ep. 9", y: 7.14 },
                    { label: "Ep. 10", y: 8.11 }
                ]
            },
            {
                type: "spline",
                showInLegend: true,
                yValueFormatString: "##.00mn",
                name: "Season 6",
                dataPoints: [
                    { label: "Ep. 1", y: 7.94 },
                    { label: "Ep. 2", y: 7.29 },
                    { label: "Ep. 3", y: 7.28 },
                    { label: "Ep. 4", y: 7.82 },
                    { label: "Ep. 5", y: 7.89 },
                    { label: "Ep. 6", y: 6.71 },
                    { label: "Ep. 7", y: 7.80 },
                    { label: "Ep. 8", y: 7.60 },
                    { label: "Ep. 9", y: 7.66 },
                    { label: "Ep. 10", y: 8.89 }
                ]
            },
            {
                type: "spline",
                showInLegend: true,
                yValueFormatString: "##.00mn",
                name: "Season 7",
                dataPoints: [
                    { label: "Ep. 1", y: 10.11 },
                    { label: "Ep. 2", y: 9.27 },
                    { label: "Ep. 3", y: 9.25 },
                    { label: "Ep. 4", y: 10.17 },
                    { label: "Ep. 5", y: 10.72 },
                    { label: "Ep. 6", y: 10.24 },
                    { label: "Ep. 7", y: 12.07 }
                ]
            }]
    });
    chart.render();

    function toggleDataSeries(e) {
        if (typeof(e.dataSeries.visible) === "undefined" || e.dataSeries.visible ){
            e.dataSeries.visible = false;
        } else {
            e.dataSeries.visible = true;
        }
        chart.render();
    }


    // updateChart(dataLength);



    setInterval(function () {
        updateChart(chart);
        getMessage();
        getUmsaetze();
        getUpdateRangliste();
        updateKontostand();
    }, updateInterval);
    setInterval(getShareName, 5000);

    document.getElementById("kaufen").onclick = buyShares();

    document.getElementById("verkaufen").onclick = sellShares();


}
function updateChart(chart) {

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
function updateKontostand(){
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
}
//erstmal so
let shares = null;

function getShareName() {

    //für Aktienname in dropdownmenue
    let http4 = new XMLHttpRequest();
    http4.open("GET", url + "/data/alleAktien", true);
    http4.onreadystatechange = function () {
        if (http4.readyState === 4 && http4.status === 200) {

            shares = JSON.parse(http4.responseText);


        }
    };
    if (shares != null) {


        const select = document.getElementById('aktien');

        for (let i = 0; i < shares.length; i++) {
            select.options[i] = new Option(shares[i].name, i.toString());
        }
    }

    http4.send(null);
}

function buyShares() {
    return function () {
        let aktienNummer = document.getElementById("aktien").value;
        let aktie = null;
        let anzahl = document.getElementById("anzahl").value;
        if (anzahl <= 0 || isNaN(anzahl)) {
            document.getElementById("anzahl").value = "0";
            alert("Bitte eine positive Zahl eingeben");
            return;
        }

        let http4 = new XMLHttpRequest();
        http4.open("GET", url + "/data/alleAktien", true);
        http4.onreadystatechange = function () {
            if (http4.readyState === 4 && http4.status === 200) {

                let shares = JSON.parse(http4.responseText);
                aktie = shares[aktienNummer];
                buyForReal(aktie, anzahl);


            }
        };
        http4.send(null);

    }
}

function buyForReal(aktie, anzahl) {
    document.getElementById("anzahl").value = "";
    let xhr = new XMLHttpRequest();
    xhr.open("POST", "/data/umsaetze/add", true);
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.send('{"aktie":' + JSON.stringify(aktie) + ',"anzahl":' + anzahl + '}');

}


function getUpdateRangliste() {
//für die Rangliste
    let http3 = new XMLHttpRequest();
    http3.open("GET", url + "/data/besitzAlle", true);
    http3.onreadystatechange = function () {
        if (http3.readyState === 4 && http3.status === 200) {
            placement = JSON.parse(http3.responseText);
        }
    };
    if (placement != null) {

        // for (let i = 0; i < placement.length; i++) {
        //     for (let j = 0; j < placement.length; j++) {
        //       if(  placement[i].summe-placement[j].summe<0){
        //
        //           placement[i]=placement[j];
        //
        //       }
        //
        //     }
        // }

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
    http3.send(null);
}

function sellShares() {
    return function () {
        let aktienNummer = document.getElementById("aktien").value;
        let aktie = null;
        let anzahl = document.getElementById("anzahl").value;
        if (anzahl <= 0 || isNaN(anzahl)) {
            document.getElementById("anzahl").value = "0";
            alert("Bitte eine positive Zahl eingeben");
            return;
        }

        let http4 = new XMLHttpRequest();
        http4.open("GET", url + "/data/alleAktien", true);
        http4.onreadystatechange = function () {
            if (http4.readyState === 4 && http4.status === 200) {

                shares = JSON.parse(http4.responseText);
                aktie = shares[aktienNummer];
                buyForReal(aktie, anzahl * -1);


            }
        };
        http4.send(null);
    }
}

//erstmal so
let umsaetze = null;

function getUmsaetze() {

    let http5 = new XMLHttpRequest();
    let umsatz = document.getElementById("umsaetze");
    http5.open("GET", url + "/data/umsaetze", true);
    http5.onreadystatechange = function () {
        if (http5.readyState === 4 && http5.status === 200) {
            umsaetze = JSON.parse(http5.responseText);


        }
    };
    if (umsaetze !== null) {
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
    http5.send(null);
}

// let anzahlNachrichten = 0;
function extround(zahl, n_stelle) {
    zahl = (Math.round(zahl * n_stelle) / n_stelle);
    return zahl;
}

function getMessage() {
    let nachrichten = document.getElementById("nachrichten");

    nachrichten.innerText = "Nachrichten";
    let request = new XMLHttpRequest();
    request.open("GET", "/data/nachrichten", true);
    request.onreadystatechange = function () {
        if (request.readyState === 4 && request.status === 200) {

            let messages = JSON.parse(request.responseText);

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
        }


        // }
    };

    request.send(null);

}