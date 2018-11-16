
window.onload = init;
function init () {
    let save= null;
    let userData=null;
    let placement=null;
    const dps = []; // dataPoints
    const chart = new CanvasJS.Chart("chartContainer", {
        title: {
            text: "Aktienkurse"
        },
        axisY: {
            includeZero: false
        },
        data: [{
            type: "line",
            dataPoints: dps
        }]
    });

    let xVal = 0;
    let yVal = 100;
    const updateInterval = 1000;
    const dataLength = 20; // number of dataPoints visible at any point

    const updateChart = function (count) {

        count = count || 1;

        for (let j = 0; j < count; j++) {
            yVal = yVal + Math.round(5 + Math.random() * (-5 - 5));
            dps.push({
                x: xVal,
                y: yVal
            });
            xVal++;
        }

        if (dps.length > dataLength) {
            dps.shift();
        }

        chart.render();
        let url = "http://localhost:3000";


        //für die Rangliste
        let http3 = new XMLHttpRequest();
        http3.open("GET", url+"/data/besitzAlle", true);
        http3.onreadystatechange = function()
        {

            if (http3.readyState === 4 && http3.status === 200) {

                placement = JSON.parse(http3.responseText);


            }
        };
        if(placement!= null){
            placement.sort();
            let leftDiv= document.getElementById("leftDiv");
            leftDiv.innerText="Rangliste";

            for(let i = 0; i<placement.length;i++){
                let div=  document.createElement("div");
                leftDiv.appendChild(div);

                div.innerText=placement[i].name +"    "+ placement[i].summe;



            }

        }
        http3.send(null);



        let http2 = new XMLHttpRequest();
        let name= document.getElementById("Benutzer");
        let kontostand=document.getElementById("Kontostand");
        //für benutzernamen und kontostand
        http2.open("GET", url+"/data/userData", true);
        http2.onreadystatechange = function()
        {
            if(http2.readyState === 4 && http2.status === 200) {

                userData=JSON.parse(http2.responseText);



            }
        };
        if(userData!=null){


                // alert("Name: "+ userData.name);
                // alert("Kontostand: "+ userData.kontostand);
               name.innerText= "Name: "+ userData.name;
               kontostand.innerText="Kontostand: "+ userData.kontostand;


        }
        http2.send(null);



        //für depot
        let http = new XMLHttpRequest();
        http.open("GET", url+"/data/depot", true);
        http.onreadystatechange = function()
        {
            if(http.readyState === 4 && http.status === 200) {

                save=JSON.parse(http.responseText);



            }
        };

        if(save!=null){
            let data= save.positionen;
            for(let i=0;i<data.length; i++){
                // alert("Name: "+data[i].aktie.name);
                // alert("Preis: "+ data[i].aktie.preis);
            }

        }
        http.send(null);
    };


    updateChart(dataLength);


    setInterval(function(){updateChart()}, updateInterval);

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