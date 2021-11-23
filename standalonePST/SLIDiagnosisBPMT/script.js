"use strict";

let calibBtn;
let calibPoints;
let sentence = [];
let correctAns = [];
let displaySentence;
let playBtn;
let binPic;
let q_count;
let q_limit = 11;
let timeoutPhase = [0,0,0,0];
let answers = [];
let ansTime = [];
let colors = [
    "#ff8c8c",
    "#ff5e5e",
    "#ff3636",
    "#ff0000",
    "#ffff00",
];
let calibCount = [5,0,0,0,0,0,0,0,0];
let startTime, endTime;
let predPoints = [];
let currPred = {};
let webCamPresent = -1;
let showText = 500;
let showAudio = 5000;
let showBinPic = 7000;
let selection = [];
let order = [...Array(40).keys()];

function sentenceHandler() {

    let q_set_key = [Object.keys(q_set1),Object.keys(q_set2),Object.keys(q_set3),Object.keys(q_set4)];
    let q_set_val = [Object.values(q_set1),Object.values(q_set2),Object.values(q_set3),Object.values(q_set4)];
    (() => { for (let i = 0; i < 40; i++) selection.push(Math.floor(i/10)); })();
    
    if (document.getElementById("randset").checked) {
        for (let i = 0; i < 40; i++) {
            let a = Math.floor(Math.random()*100)%40;
            let b = Math.floor(Math.random()*100)%40;
            [selection[a],selection[b]] = [selection[b],selection[a]];
        }
    }
    if (false) {
    //if (document.getElementById("randorder").checked) {
        for (let i = 0; i < 40; i++) {
            let a = Math.floor(Math.random()*100)%40;
            let b = Math.floor(Math.random()*100)%40;
            [order[a],order[b]] = [order[b],order[a]];
        }
    }
    for (let i = 0; i < 40; i++) {
        sentence.push(q_set_key[selection[i]][i]);
        correctAns.push(q_set_val[selection[i]][i]);
    }
    document.getElementById("modal").parentNode.removeChild(document.getElementById("modal"));
    document.getElementById("options").parentNode.removeChild(document.getElementById("options"));
}

function sliderUpdate(x,n) {
    x = parseInt(x);
    switch (n) {
        case 0: showText = x;
                document.getElementById("textms").innerHTML = x;
                break;
        case 1: showAudio = x;
                document.getElementById("audioms").innerHTML = x;
                break;
        case 2: showBinPic = x;
                document.getElementById("imagems").innerHTML = x;
                break;
        case 3: q_limit = x+1;
                document.getElementById("question-count").innerHTML = x;
                break;
    }
}

function playDiag() {

    playBtn.innerHTML = "◼";
    playBtn.onclick = function() { resetDiag(true) };

    if (q_count == 1) {
        if (webCamPresent) { webgazer.pause(); }
    }

    if (q_count == q_limit) {

        resetDiag(true);
        fillResultPanel();
        computeResults(100);
        document.getElementById("container").style.display = "none";
        document.getElementById("container").style.opacity = 0;
        document.getElementById("result-container").style.display = "block";
        if (webCamPresent) { webgazer.end(); }
    }
    else {
        timeoutPhase[0] = setTimeout(() => {

            displaySentence.innerHTML = sentence[order[q_count-1]];
            binPic[0].style.display = "none";
            binPic[1].style.display = "none";
            binPic[0].style.backgroundImage = "url(src/PIC/q" + (order[q_count-1]+1) + "a.png)";
            binPic[1].style.backgroundImage = "url(src/PIC/q" + (order[q_count-1]+1) + "b.png)";
            displaySentence.style.opacity = 1;

        },showText);

        timeoutPhase[1] = setTimeout(() => { new Audio("src/SESI"+(selection[(order[q_count-1])]+1)+"_AUDIO/"+(order[q_count-1]+1)+".m4a").play(); }, showText+showAudio);

        timeoutPhase[2] = setTimeout(() => {

            displaySentence.style.opacity = 0;
            binPic[0].style.display = "block";
            binPic[1].style.display = "block";

        }, showText+showAudio+showBinPic);

        timeoutPhase[2] = setTimeout(() => {

            currPred = {};
            if (webCamPresent) { webgazer.resume(); }
            
            binPic[0].style.opacity = 1;
            binPic[1].style.opacity = 1;
            binPic[0].onclick = function() { selectPic("A", binPic[0]); }
            binPic[1].onclick = function() { selectPic("B", binPic[1]); }
            startTime = new Date();

        }, showText+showAudio+showBinPic+500);
    }
}

function selectPic(pic, binSel) {

    if (binSel.style.border != "") {

        webgazer.pause();
        predPoints.push(currPred);

        binPic[0].onclick = "";
        binPic[1].onclick = "";

        answers.push(pic);
        endTime = new Date();
        ansTime.push(endTime.getTime() - startTime.getTime());

        resetDiag(false); q_count++;
        setTimeout(function() {playDiag()}, 2000);
    }
    else {
        binPic[0].style.border = "";
        binPic[1].style.border = "";
        binSel.style.border = "5px rgb(45, 154, 255) solid";
    }
}

function resetDiag(qc_reset) {

    if (qc_reset) {
        q_count = 1;
        playBtn.innerHTML = "▶";
        playBtn.onclick = playDiag;
    }

    for (let i = 0; i < 4; i++)
        clearTimeout(timeoutPhase[i]);

    binPic[0].style.opacity = 0;
    binPic[1].style.opacity = 0;
    binPic[0].style.border = "";
    binPic[1].style.border = "";
    displaySentence.style.opacity = 0;
}

function fillResultPanel() {

    let n = 0;
    let c = 0;
    let resPanel = document.getElementById("result-panel");

    Array.prototype.forEach.call(answers, e => {
        let node = document.createElement("div");

        let spannode = document.createElement("span");
        spannode.append(document.createTextNode("█"));
        spannode.style.width = "20px";
        if (e == correctAns[n]) {
            spannode.style.color = "#42f563";
            c++;
        }
        else {
            spannode.style.color = "#f54242";
        }
        let textnode = document.createTextNode("Q" + (n+1) + ": " + e + " | t: " + ansTime[n]);
        node.classList.add("result-panel-card");
        node.id = n;
        if (webCamPresent) {
            node.onclick = function() {
                let retries = 0;
                while (true) {
                    try {
                        drawHeatMap(order[parseInt(node.id)]+1, node.id); break;
                    }
                    catch (err) {
                        retries += 1;
                        console.log("drawHeatMap() error");
                        if (retries > 10) break;
                    }
                }
            };
        }
        ++n;
        node.append(spannode);
        node.append(textnode);
        resPanel.append(node);
    });

    let config1 = {
        type: 'doughnut',
        data: {
            labels: ["Correct","Wrong"],
            datasets: [{
                data: [c,answers.length-c],
                backgroundColor: ['rgb(54, 162, 235)','rgb(255, 99, 132)'],
                borderColor: ['rgb(54, 162, 235)','rgb(255, 99, 132)'],
            }]
        },
        options: {
            responsive: true,
            title: { display: false },
            legend: { display: false, },
            tooltips: { mode: 'index', intersect: false, },
            hover: { mode: 'nearest', intersect: true }
        }
    };

    let config2 = {
        type: 'line',
        data: {
            labels: [...Array(ansTime.length).keys()],
            datasets: [{
                label: 'Answer time',
                backgroundColor: 'rgb(54, 162, 235)',
                borderColor: 'rgb(54, 162, 235)',
                data: ansTime,
                fill: false,
            }]
        },
        options: {
            responsive: true,
            title: { display: false },
            legend: { display: false, },
            tooltips: { mode: 'index', intersect: false, },
            hover: { mode: 'nearest', intersect: true },
            scales: {
                xAxes: [{ display: false }],
                yAxes: [{
                    display: true,
                    scaleLabel: { display: false },
                    ticks: { fontColor: "black" }
                }]
            }
        }
    };

    let ctx1 = document.getElementById('canvas-pie').getContext('2d');
    let ctx2 = document.getElementById('canvas-chart').getContext('2d');
    let myPie = new Chart(ctx1, config1);
    let myLine = new Chart(ctx2, config2);

    toJSONHeatMapString();
}

function drawHeatMap(i, j) {

    binPic[0].style.display = "block";
    binPic[1].style.display = "block";
    binPic[0].style.opacity = 1;
    binPic[1].style.opacity = 1;
    document.getElementById('container').style.display = "flex";
    document.getElementById('container').style.opacity = 1;
    binPic[0].style.backgroundImage = "url(src/PIC/q" + i + "a.png)";
    binPic[1].style.backgroundImage = "url(src/PIC/q" + i + "b.png)";
    //binPic[0].style.backgroundImage = "none";
    //binPic[1].style.backgroundImage = "none";

    let config = {
        container: document.getElementById('container'),
        radius: 10,
        maxOpacity: .5,
        minOpacity: 0,
        blur: .75
    };

    var heatmapInstance = h337.create(config);
    heatmapInstance.setData({data: []});
    heatmapInstance.setDataMax(100)
    heatmapInstance.setDataMin(0)

    let n = 0;

    for (const [k, v] of Object.entries(predPoints[j])) {

        if (n > 300) break;

        let dataPoint = {
            radius: 50,
            x: k,
            y: v,
            value: 70
        }
        heatmapInstance.addData(dataPoint);

        n++;
    }

    html2canvas(document.querySelector("#container")).then(canvas => {
        canvas.id = "picCanvas";
        canvas.toBlob(function(blob) {
            const a = document.createElement("a");
            a.style.display = "none";
            document.body.appendChild(a);
            a.href = window.URL.createObjectURL(blob);
            a.setAttribute("download", i);
            a.click();
            window.URL.revokeObjectURL(a.href);
            document.body.removeChild(a);
        })
    });

    let HMCanvas = document.getElementsByClassName("heatmap-canvas");
    HMCanvas[0].parentNode.removeChild(HMCanvas[0]);

    binPic[0].style.display = "none";
    binPic[1].style.display = "none";
    binPic[0].style.opacity = 0;
    binPic[1].style.opacity = 0;
    document.getElementById('container').style.display = "none";
    document.getElementById('container').style.opacity = 0;
}

function computeResults(score) {
    
    let s = 2.3;
    let u = 96;
    let N = 10;
    let t = ((score-u)/(s*Math.sqrt((N+1)/N)));
    let es = (score-u)/2.3;
    let l = Math.sqrt(((N+N)/(N*N)) + ((es*es)/(2*(N+N))));

    document.getElementById("final-otp").innerHTML += jStat.ttest(t, 10, 1).toFixed(5).toString();
}

window.onload = () => {

    q_count = 1;
    displaySentence = document.getElementById("sentence");
    playBtn = document.getElementById("play-btn");
    binPic = document.getElementsByClassName("bin-img");
    calibPoints = document.getElementsByClassName("calibration-points");

    navigator.getMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);
    navigator.getMedia({video: true}, function() {webCamPresent=true;}, function() {webCamPresent=false;});

    document.getElementById("calibrate-btn").onclick = () => {
        if (webCamPresent) {
            webgazer.begin();
            webgazer.showPredictionPoints(true);
        }
        else {
            calibCount = [5,5,5,5,5,5,5,5,5];
            calibPoints[0].click();
        }
        document.getElementById("modal").style.display = "none";
    }
    document.getElementById("set-btn").onclick = () => {
        document.getElementById("options").style.display = "none";
        sentenceHandler();
        playDiag();
    }

    Array.prototype.forEach.call(calibPoints, element => {
        element.onclick = function() {
            element.style.background = colors[calibCount[parseInt(element.id)]];
            if (++calibCount[parseInt(element.id)] > 4)
                element.onclick = "";

            let check = true;
            for (let i = 0; i < 9; i++) 
                check &= (calibCount[i] > 4);

            if (check) {
                //setTimeout(function() {
                    document.getElementById("calibration-container").style.opacity = 0;
                    webgazer.showPredictionPoints(false);
                    webgazer.showFaceFeedbackBox(false);
                    webgazer.showFaceOverlay(false);
                    webgazer.showVideo(false);
                //}, 1000);
                
                //setTimeout(function() {
                    document.getElementById("calibration-container").style.display = "none";
                    document.getElementById("container").style.display = "flex";
                    //document.getElementById("container").style.opacity = 1;
                    document.getElementById("options").style.display = "flex";

                    if (webCamPresent) {
                        webgazer.setGazeListener(function(data, elapsedTime) {
                            if (data == null) { return; }
                            var x = data.x;
                            var y = data.y;
                            currPred[x] = y;
                        }).begin();
                    }
                //}, 1500);
            }
        }
    });
}

function toJSONHeatMapString() {

    let outputLog = document.getElementById("JSON-download");

    for (let i = 0; i < predPoints.length; i++) {
        let n = 0;
        let obj2 = {};
        for (const [k, v] of Object.entries(predPoints[i])) {
            if (n > 300) break;
            obj2[k] = v;
            n++;
        }
        let JSONOBJ = {pic:order[i],coord:obj2};
        outputLog.innerHTML += JSON.stringify(JSONOBJ) + "\n\n";
    }
}