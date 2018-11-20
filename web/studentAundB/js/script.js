window.onload = init;
const updateInterval = 1000;
const url = "http://localhost:3000";
let save = null;
let userData = null;
let placement = null;


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


        getUpdateRangliste();


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
            kontostand.innerText = "Kontostand: " + extround(userData.kontostand,2)+"€";


        }
        http2.send(null);


        //für depot
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
        getMessage();
        getUmsaetze();
    }, updateInterval);

    setInterval(getShareName, 5000);

    document.getElementById("kaufen").onclick = function () {
        buyShares()
    };
    document.getElementById("verkaufen").onclick = function () {
        sellShares();
    };


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
            select.options[i] = new Option(shares[i].name, i);
        }
    }

    http4.send(null);
}

function buyShares() {

    let aktienNummer = document.getElementById("aktien").value;
    let aktie = null;
    let anzahl = document.getElementById("anzahl").value;
    if(anzahl <= 0){
        alert("Bitte eine positive Zahl eingeben");
        document.getElementById("anzahl").value = "0";
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

function buyForReal(aktie, anzahl) {
    document.getElementById("anzahl").value = "0";
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
            div.innerText = placement[i].name + "    " + extround(placement[i].summe,2) + "€";
        }
    }
    http3.send(null);
}

function sellShares() {
    let aktienNummer = document.getElementById("aktien").value;
    let aktie = null;
    let anzahl = document.getElementById("anzahl").value;
    if(anzahl <= 0){
        alert("Bitte eine positive Zahl eingeben");
        document.getElementById("anzahl").value = "0";
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
function extround(zahl,n_stelle) {
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
                    let substr = messages[i - 1].text.substring(5, messages[i - 1].text.lastIndexOf(":"));
                    nachricht += substr;
                    let substr2 = messages[i - 1].text.substring(messages[i - 1].text.lastIndexOf(":") + 1, messages[i - 1].text.lastIndexOf(" "));
                    nachricht += substr2;
                    if (substr2 !== " 1") {
                        nachricht += " Aktien";
                    } else {
                        nachricht += " Aktie";
                    }
                    nachricht += " von";
                    let substr3 = messages[i - 1].text.substring(messages[i - 1].text.lastIndexOf(" "));
                    nachricht += substr3;
                } else {
                    nachricht += " verkaufte";
                    let substr = messages[i - 1].text.substring(8, messages[i - 1].text.lastIndexOf(":"));
                    nachricht += substr;
                    let substr2 = messages[i - 1].text.substring(messages[i - 1].text.lastIndexOf(":") + 1, messages[i - 1].text.lastIndexOf(" "));
                    nachricht += substr2;
                    if (substr2 !== " 1") {
                        nachricht += " Aktien";
                    } else {
                        nachricht += " Aktie";
                    }
                    nachricht += " von";
                    let substr3 = messages[i - 1].text.substring(messages[i - 1].text.lastIndexOf(" "));
                    nachricht += substr3;
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