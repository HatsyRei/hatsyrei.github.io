"use strict";

let sel = 0;
let contentDiv;
let hitBox;
let hitBoxRect;
let playBtn;
let darkBarCount = 0;
let tol_values = [150,70,10];
let tolerance = 150;
let freq_values = [2,1,0.5];
let barFreq = 1;
let spawnBarInterval, SBI;
let spawnBarDelay, SBD;
let clearBarInterval;
let audio;
let barDelayConstant = 5000;
let points = [0];
let misses = [0];
let claps = 0;

function postUpdate(pres, accu) {
    document.getElementById("prec").value = pres.toString();
    document.getElementById("accu").value = accu.toString();
    document.getElementById("datenow").value = (() => {
        let today = new Date();
        let dd = String(today.getDate()).padStart(2, '0');
        let mm = String(today.getMonth() + 1).padStart(2, '0');
        let yyyy = today.getFullYear();
        return yyyy+'-'+mm+'-'+dd;
    })();
    console.log(document.getElementById("datenow").value);
}

function showResults() {

    document.getElementById("result-container").style.opacity = 1;
    let accuracy, precision;

    if (points[points.length-1]+misses[misses.length-1] != 0) {
        accuracy = points[points.length-1]/(points[points.length-1]+misses[misses.length-1]);
        precision = points[points.length-1]/claps;
    }
    else {
        accuracy = 0; precision = 0;
    }

    let config1 = {
        type: 'line',
        data: {
            labels: [...Array(points.length).keys()],
            datasets: [{
                label: 'Cumulative Hit',
                backgroundColor: 'rgb(54, 162, 235)',
                borderColor: 'rgb(54, 162, 235)',
                data: points,
                fill: false,
            }, {
                label: 'Cumulative Miss',
                fill: false,
                backgroundColor: 'rgb(255, 99, 132)',
                borderColor: 'rgb(255, 99, 132)',
                data: misses,
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

    let config2 = {
        type: 'doughnut',
        data: {
            labels: ["Total Hits","Total Misses"],
            datasets: [{
                labels: ["30","30"],
                data: [points[points.length-1],misses[misses.length-1]],
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

    let config3 = {
        type: 'bar',
        data: {
            labels: ["accuracy", "precision"],
            datasets: [{
                data: [accuracy.toFixed(2),precision.toFixed(2)],
                backgroundColor: ['rgba(149, 66, 245, 0.5)','rgba(255, 206, 711, 0.5)'],
                borderColor: ['rgb(149, 66, 245)','rgb(255, 206, 71)'],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            title: { display: false },
            legend: { display: false, },
            tooltips: { mode: 'index', intersect: false, },
            hover: { mode: 'nearest', intersect: true },
            scales: {
                xAxes: [{
                    barThickness: 40
                }],
                yAxes: [{
                    display: true,
                    ticks: {
                        suggestedMin: 0.0,
                        suggestedMax: 1.0,
                    }
                }]
            }
        }
    };

    let ctx1 = document.getElementById('canvas-cumulative-chart').getContext('2d');
    let ctx2 = document.getElementById('canvas-pie').getContext('2d');
    let ctx3 = document.getElementById('canvas-bar').getContext('2d');
    let myLine = new Chart(ctx1, config1);
    let myPie = new Chart(ctx2, config2);
    let myBar = new Chart(ctx3, config3);

    document.getElementById("claptext").innerHTML = "Claps: " + claps;
    document.getElementById("barspawntext").innerHTML = "Bar Spawned: " + (points[points.length-1]+misses[misses.length-1]);
    document.getElementById("hittext").innerHTML = "Hits: " + points[points.length-1];
    document.getElementById("misstext").innerHTML = "Misses: " + misses[misses.length-1];

    document.getElementById("track-name").innerHTML = beatMap[sel].songName;
    document.getElementById("duration").innerHTML = "Duration: " + Math.floor(audio.currentTime/60) + ":" + Math.floor(audio.currentTime%60);
    document.getElementById("difficulty").innerHTML = "Difficulty: " + document.getElementById("playdifftext").innerHTML;
    console.log(accuracy);
    console.log(precision);
    document.getElementById("overall-rating").innerHTML = ['C','C','B','B','B','A','S'][Math.ceil((accuracy+precision)/2*6)];

    document.getElementById("submit-btn").onclick = function() {
        postUpdate(precision, accuracy);
    }
}

window.onload = () => {

    contentDiv = document.getElementById("content");
    hitBox = document.getElementById("hitbox");
    hitBoxRect = hitBox.getBoundingClientRect();
    playBtn = document.getElementById("playBtn");

    document.getElementById("set-btn").onclick = function() {
        sel = document.getElementById("song-select").value;
        audio = new Audio(beatMap[sel].songPath);
        SBI = beatMap[sel].intervalDelay;
        SBD = beatMap[sel].spawnDelay;

        if (document.getElementById("has-bg-check").checked) {
            document.getElementById("bg-image").style.backgroundImage = "url("+beatMap[sel].bgImage+")";
        }
        else {
            document.getElementById("bg-image").style.backgroundImage = "url(src/blank-background.jpg)";
        }
        
        document.getElementById("bg-image").style.filter = "blur(0px) brightness(50%)";
        document.getElementById("options").style.display = "none";
        document.getElementById("hitbox").style.opacity = 1;
    }

    moveBar();
}

function barFreqUpdate(val) {
    document.getElementById("barfreqtext").innerHTML = (function(x){
        switch (x) {
            case 1: return "x0.5";
            case 2: return "x1";
            case 3: return "x2";
        }
    })(parseInt(val));

    barFreq = freq_values[parseInt(val)-1];
}

function playDiffUpdate(val) {

    document.getElementById("playdifftext").innerHTML = (function(x){
        switch (x) {
            case 1: return "Easy";
            case 2: return "Medium";
            case 3: return "Hard";
        }
    })(parseInt(val));

    tolerance = tol_values[parseInt(val)-1];
}

window.onkeydown = (event) => {

    let darkBars = document.getElementsByClassName("darkbar");
    
    if (event.keyCode == 101) {
        Array.prototype.forEach.call(darkBars, obj => { 
            if (isInHitBox(obj.getBoundingClientRect()) && !obj.classList.contains("fade-out-scale-large")) {
                obj.classList.add("fade-out-scale-large");
            }
        });
        claps++;
    }
}

function play() {

    playBtn.innerHTML = "◼";
    playBtn.onclick = stop;
    audio.play();

    spawnBarDelay = setTimeout(() => {
        spawnBarInterval = setInterval(() => {
            if (audio.currentTime < audio.duration-5)
                spawnBar();
            if (audio.currentTime > audio.duration-1)
                stop();
        }, SBI*barFreq);
        clearBarInterval = setInterval(() => {
            clearBar();
        }, SBI*barFreq);
    }, SBD-barDelayConstant);
}

function stop() {

    clearInterval(spawnBarInterval);
    clearTimeout(spawnBarDelay);
    document.getElementById("result-container").style.display = "flex";

    Array.prototype.forEach.call(document.getElementsByClassName("darkbar"), obj => { 
        obj.classList.add("fade-out-scale-large");
    });
    setTimeout(() => {
        document.getElementById("hitbox").style.opacity = 0;
        playBtn.style.opacity = 0;
        clearInterval(clearBarInterval);
    }, 1000);
    setTimeout(() => { showResults(); }, 1500);

    playBtn.innerHTML = "▶";
    playBtn.onclick = play;
    audio.pause();
}

function spawnBar() {

    let newBar = document.createElement('div');
    newBar.id = darkBarCount;
    newBar.classList.add("darkbar");
    contentDiv.appendChild(newBar);

    darkBarCount++;
}

function moveBar() {

    let darkBars = document.getElementsByClassName("darkbar");

    Array.prototype.forEach.call(darkBars, obj => {

        let posRight = parseFloat(window.getComputedStyle(obj).getPropertyValue("right"));
        let posLeft = parseFloat(window.getComputedStyle(obj).getPropertyValue("left"));
        
        if (posLeft >= -100) {
            obj.style.right = (posRight+5)+"px";
        }
    });

    requestAnimationFrame(moveBar);
}

function clearBar() {

    let darkBars = document.getElementsByClassName("darkbar");
    let isMiss = false;
    let isHit = false;
    
    Array.prototype.forEach.call(darkBars, obj => {
        if (parseInt(window.getComputedStyle(obj).getPropertyValue("left")) < 0) {
            if (!obj.classList.contains("fade-out-scale-large")) { isMiss = true; }
            else isHit = true;
            obj.parentNode.removeChild(obj);
        }
    });
    if (isMiss + isHit != 0) {
        misses.push(misses[misses.length-1]+isMiss);
        points.push(points[points.length-1]+isHit);
    }
}

function isInHitBox(rect) {
    
    return ((rect.right <= hitBoxRect.right+tolerance) && (rect.left >= hitBoxRect.left-tolerance));
}
