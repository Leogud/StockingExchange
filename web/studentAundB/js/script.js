
window.onload = init;
function init () {

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
    };


    updateChart(dataLength);
    let url = "http://localhost:3000";
    let params = "";
    let http = new XMLHttpRequest();

    http.open("GET", url+"/data/alleAktien"+params, true);
    http.onreadystatechange = function()
    {
        if(http.readyState == 4 && http.status == 200) {
            alert(http.responseText);
        }
    }
    http.send(null);
    setInterval(function(){updateChart()}, updateInterval);

};
