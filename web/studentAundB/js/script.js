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
const depot = "/data/depot";
const DataFromUser = "/data/userdata";
let save = null;
let userData = null;


function init() {

    setInterval(function () {

        getData(messagesAddr, getMessage);
        getData(revenueAddr, getUmsaetze);
        getData(rankingAddr, getUpdateRangliste);
        getData(userAddr, getKontostand);
        getData(depotAddr, updateChart);
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

function createChart() {
    let chart = new CanvasJS.Chart("chartContainer", {
        theme: "light2",
        animationEnabled: true,
        title: {
            text: "AKTIEN"
        },
        axisY: {
            includeZero: false,
            title: "Aktien",
            suffix: "€"
        },
        toolTip: {
            shared: "true"
        },
        legend: {
            cursor: "pointer",
            itemclick: toggleDataSeries
        },
        data:[{


        //         {label: "Ep. 1", y: 2.22},
        //         {label: "Ep. 2", y: 2.20},
        //         {label: "Ep. 3", y: 2.44},
        //         {label: "Ep. 4", y: 2.45},
        //         {label: "Ep. 5", y: 2.58},
        //         {label: "Ep. 6", y: 2.44},
        //         {label: "Ep. 7", y: 2.40},
        //         {label: "Ep. 8", y: 2.72},
        //         {label: "Ep. 9", y: 2.66},
        //         {label: "Ep. 10", y: 3.04}
        //     ]
        // },
        //     {
        //         type: "spline",
        //         showInLegend: true,
        //         yValueFormatString: "##.00mn",
        //         name: "Season 7",
        //         dataPoints: [
        //             { label: "Ep. 1", y: 10.11 },
        //             { label: "Ep. 2", y: 9.27 },
        //             { label: "Ep. 3", y: 9.25 },
        //             { label: "Ep. 4", y: 10.17 },
        //             { label: "Ep. 5", y: 10.72 },
        //             { label: "Ep. 6", y: 10.24 },
        //             { label: "Ep. 7", y: 12.07 }
        //         ]}]


    }]});
    chart.render();

    function toggleDataSeries(e) {
        if (typeof(e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
            e.dataSeries.visible = false;
        } else {
            e.dataSeries.visible = true;
        }
        chart.render();
    }

    return chart;
}

function updateChart(save) {

    let array = [];


    // if (save != null)  {
        let data = save.positionen;
            let chart= createChart();
         for (let i = 0; i < data.length; i++) {
             alert(chart);
             alert(data[i].aktie.preis);
             chart.data[0].addTo("data", {
                 type: "line",
                 visible: true,
                 showInLegend:
                     true,

                 name:
                 data[i].aktie.name,
                 dataPoints: [{y: data[i].aktie.preis, x: i}]
             })




         }
        array.push(

                    {
                        type: "spline",
                        visible: true,
                        showInLegend:
                            true,
                        name:
                        data[0].aktie.name,
                        datapoints: [{
                            label: "Ep. 1", y: data[0].aktie.preis
                        },
                            {
                                label: "Ep. 2", y: data[0].aktie.preis
                            }
                        ]
                    }



        );




        // chart.data.push({data:array});
        // chart.data.dataPoints[0].push( {
        //     type: "spline",
        //     visible: true,
        //     showInLegend:
        //         true,
        //     yValueFormatString:
        //         "##.00mn",
        //     name:
        //     data[0].aktie.name,
        //     datapoints: [{
        //         label: "Ep. 1", y: data[0].aktie.preis
        //     },
        //         {
        //             label: "Ep. 2", y: data[0].aktie.preis
        //         }
        //     ]
        // });

        chart.render();

    // } else if ((save != null) && (chart.options.data[0].dataPoints.length > 0)) {
    //     let chart = createChart(array);
    //     let data = save.positionen;
    //     for (let i = 0; i < data.length; i++) {
    //         chart.options.data[0].dataPoints[i].y = data[i].aktie.preis;
    //     }
    //     chart.render();
    // }

}



function realUpdateChart() {

}

function getKontostand(userData) {
    const name = document.getElementById("Benutzer");
    const kontostand = document.getElementById("Kontostand");
    if (userData != null) {


        // alert("Name: "+ userData.name);
        // alert("Kontostand: "+ userData.kontostand);
        name.innerText = "Name: " + userData.name;
        kontostand.innerText = "Kontostand: " + extround(userData.kontostand, 2) + "€";


    }
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