window.onload = init;
const updateInterval = 1000;
const url = "http://localhost:3000";
let save = null;
let userData = null;
let placement = null;
let shares = null;



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
            dataPoints: [
               //  { y: 300878, label: "Venezuela" },
                // { y: 266455,  label: "Saudi" },
                // { y: 169709,  label: "Canada" },
                // { y: 158400,  label: "Iran" },
                // { y: 142503,  label: "Iraq" },
                // { y: 101500, label: "Kuwait" },
                // { y: 97800,  label: "UAE" },
                // { y: 80000,  label: "Russia" }
            ]
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




        //für die Rangliste
        let http3 = new XMLHttpRequest();
        http3.open("GET", url + "/data/besitzAlle", true);
        http3.onreadystatechange = function () {

            if (http3.readyState === 4 && http3.status === 200) {

                placement = JSON.parse(http3.responseText);


            }
        };
        if (placement != null) {
            placement.sort();
            let leftDiv = document.getElementById("leftDiv");
            leftDiv.innerText = "Rangliste";

            for (let i = 0; i < placement.length; i++) {
                let div = document.createElement("div");
                leftDiv.appendChild(div);

                div.innerText = placement[i].name + "    " + placement[i].summe;


            }

        }
        http3.send(null);


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
            kontostand.innerText = "Kontostand: " + userData.kontostand;


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


        if ((save != null) && (chart.options.data[0].dataPoints.length===0)) {
            let data = save.positionen;
            for (let i = 0; i < data.length; i++) {
                 // alert("Name: "+data[i].aktie.name);
                 //alert("Preis: "+ data[i].aktie.preis);
                    chart.options.data[0].dataPoints.push({y: data[i].aktie.preis, label: data[i].aktie.name});
                //alert("Name: "+data[i].aktie.name);
                //alert("Preis: "+ data[i].aktie.preis);

                chart.options.data[0].dataPoints.push({y: data[i].aktie.preis, label: data[i].aktie.name});

                 //alert("Name: "+data[i].aktie.name);
                 //alert("Preis: "+ data[i].aktie.preis);
                    chart.options.data[0].dataPoints.push({y: data[i].aktie.preis, label: data[i].aktie.name});
                //chart.render();
                //
                // alert(data[i].aktie.preis+"  "+ data[i].aktie.name);

            }

            chart.render();

        }else if((save != null) && (chart.options.data[0].dataPoints.length>0)){
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
        buyShares();
    }, updateInterval);

    setInterval(getShareName,3000)



}


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
// let depot = null;
function buyShares() {

    // let dummy = { "aktie": "Microsoft", "anzahl": "15" };
    // postJSONdata(url + "/data/umsaetze/add", dummy);



    // let http4 = new XMLHttpRequest();
    // http4.open("GET", url + "/data/depot", true);
    // http4.onload = function () {
    //     if (http4.readyState === 4 && http4.status === 200) {
    //
    //         depot = JSON.parse(http4.responseText);
    //
    //
    //     }
    // };
    // if (depot != null) {
    //
    //
    // depot.positionen[0].aktie.anzahl = 7;
    //
    //
    //
    // }
    // http4.send(null);
    //
    // let http = new XMLHttpRequest();
    // http.open("POST", url + "/data/depot", true);
    // http.onload = function () {
    //     if (http.readyState === 4 && http.status === 200) {
    //
    //
    //
    //     }
    // };
    // http.send(JSON.stringify(depot));


}

function postJSONdata(url, data, successCallback, failureCallback) {
    const request = new XMLHttpRequest();
    request.open("POST", url, true);
    request.setRequestHeader("Content-type", "application/json");
    /* request.onloadend würde auch bei Netzwerkfehlern aufgerufen. */
    request.onload = function () {
        if ( 201 != request.status ) {
            failureCallback(request.response, request.status);
            return;
        }
        successCallback(request.response, request.status);
    };
    const dataStringified = JSON.stringify(data);
    request.send(dataStringified);
}

// function getJSON(anhang){
//     let url = "http://localhost:3000";
//     let data=null;
//     let http = new XMLHttpRequest();
//     //für benutzernamen und kontostand
//     http.open("GET", url+anhang, true);
//     http.onreadystatechange = function()
//     {
//         if(http.readyState === 4 && http.status === 200) {
//
//             data=JSON.parse(http.responseText);
//             http.send(null);
//             return data;
//
//
//         }
//     };
//     http.send(null);
// }