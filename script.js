"use strict";

let N = 0;
let lim_N = 14;
let totalScore = 0;

let SENT_list = [];
let NBR_list = [];
let SYN_list = [];
let FUNC_list = [];
let LEX_list = [];
let SEM_list = [];

let scorelist = [];
let sentence;
let inputSentence;
let inputSentenceList = [];
let score;
let scoreDetails;
let startbtn;
let nextbtn;
let reloadbtn;
let quitbtn;
let aud;

window.onload = () => {

    sentence = document.getElementById("sentence");
    inputSentence = document.getElementById("input-sentence");
    score = document.getElementById("score");
    scoreDetails = document.getElementById("score-details");
    startbtn = document.getElementById("start-btn");
    nextbtn = document.getElementById("next-btn");
    reloadbtn = document.getElementById("reload-btn");
    quitbtn = document.getElementById("quit");
    aud = new Audio('src/audio/'+(N+1)+'.m4a');

    // populate scorelist with the same number of zeros as the number of sentences we have
    for (let i = 0; i < sentences.length; i++) {
        scorelist.push(0);
    }

    // Display the first sentence on the screen and bind audio
    sentence.innerHTML = sentences[N];
    sentence.onclick = () => {
        // play only if audio is not currently playing
        if (aud.paused) {

            // Disable start button for 9 seconds, preventing user from initiating speech recognition
            startbtn.disabled = true;
            startbtn.style.backgroundColor = "#525252";

            setTimeout(function(){
                startbtn.disabled = false;
                startbtn.style.backgroundColor = "#ff4a4a";
            },9000);

            // function directly handles audio update according to sentence N value
            aud = new Audio('src/audio/'+(N+1)+'.m4a');
            aud.play();
        }
    };

    // bind next-btn to increment count, update sentence displayed, hide nextbtn
    nextbtn.onclick = () => {

        // disabled to prevent spam clicks
        nextbtn.disabled = true;
        scoreDetails.style.opacity = "0";

        // if N is smaller than limit N
        if (N < lim_N) {
            
            N += 1;

            // display new sentence and clear input sentence
            sentence.innerHTML = sentences[N];
            inputSentence.innerHTML = "";
        }
        else {
            // show results panel
            showResultPanel();
        }

        // reenable button after fade out no display
        nextbtn.style.opacity = "0";
        setTimeout(() => {
            nextbtn.style.display = "none";
            nextbtn.disabled = false;
        }, 1000);
    }

    reloadbtn.onclick = () => {
        window.location.reload();
        return false;
    }

    quitbtn.onclick = () => {
        showResultPanel();
    }

    function showResultPanel() {

        document.getElementById("main-content").style.display = "none";
        document.getElementById("result-panel").style.display = "block";
        document.getElementById("results-total-score").innerHTML = "Total Score: " + totalScore;
        document.getElementById("results-total-score-details").innerHTML = "Total SENT = " + SENT_list.reduce((a, b) => a + b, 0) + "<br>Total NBR = " + NBR_list.reduce((a, b) => a + b, 0) + "<br>Total SYN = " + SYN_list.reduce((a, b) => a + b, 0) + "<br>Total FUNC = " + FUNC_list.reduce((a, b) => a + b, 0) + "<br>Total LEX = " + LEX_list.reduce((a, b) => a + b, 0) + "<br>Total SEM = " + SEM_list.reduce((a, b) => a + b, 0);
        document.getElementById("result-details").value += "Obtained speech and evaluation results:\n\n";

        inputSentenceList.forEach((item, index) => {
            document.getElementById("result-details").value += (index+1) + ". " + item + "\n";
            document.getElementById("result-details").value += "SENT = " + SENT_list[index] + "\n";
            document.getElementById("result-details").value += "NBR  = " + NBR_list[index] + "\n";
            document.getElementById("result-details").value += "SYN  = " + SYN_list[index] + "\n";
            document.getElementById("result-details").value += "FUNC = " + FUNC_list[index] + "\n";
            document.getElementById("result-details").value += "LEX  = " + LEX_list[index] + "\n";
            document.getElementById("result-details").value += "SEM  = " + SEM_list[index] + "\n\n";
        });
    }

    try {
        window.SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
        const recognition = new window.SpeechRecognition();
        recognition.lang = "ms-MY";

        recognition.onresult = (event) => {

            let SENT = 0;
            let NBR = 0;
            let SYN = 0;
            let FUNC = 0;
            let LEX = 0;
            let SEM = 0;

            // Obtain transcript results and end voice recognition
            const speechToText = event.results[0][0].transcript;
            recognition.stop(); 

            // print recognition results to screen
            let result = speechToText.toLowerCase();
            let target = sentences[N].toLowerCase();
            inputSentenceList.push(result);
            inputSentence.innerHTML = result;
            
            // tokenize results
            let tokens = result.split(" ");
            let tokens_tar = target.split(" ");

            // SENT
            if (result == target) SENT = 1;

            // NBR
            if (tokens.length == tokens_tar.length) NBR = 1;

            // FUNC
            checker[N]["KGN"].split(" ").forEach((item, index) => {
                if (tokens.includes(item)) FUNC += 1;
            });
            if (tokens.includes(checker[N]["R"])) FUNC += 1;
            if (tokens.includes(checker[N]["KH"])) FUNC += 1;
            if (tokens.includes(checker[N]["D"])) FUNC += 1;

            // LEX
            let KK_list = [];
            checker[N]["KK"].split(" ").forEach((item, index) => {
                KK_list.push(item);
                let re = new RegExp(item, "g");
                if (re.test(result)) {
                    LEX += 2;
                    re.lastIndex = 0;
                    let match = re.exec(result);
                    if (!tokens_tar.includes(match[0])) LEX -= 1;
                }
            });

            // SEM, SYN
            checker[N]["P"].split(" ").forEach((item, index) => {
                item = item.replace(/_/g, " ");
                item = item.replace('<KK>', KK_list[index]);
                let re = new RegExp(item, "g");
                if (re.test(result)) {
                    SEM += 1; SYN = 1;
                }
            });
            SEM = Math.floor(SEM / checker[N]["P"].split(" ").length);

            SENT_list.push(SENT);
            NBR_list.push(NBR);
            SYN_list.push(SYN);
            FUNC_list.push(FUNC);
            LEX_list.push(LEX);
            SEM_list.push(SEM);

            scoreDetails.innerHTML = "SENT = " + SENT + "<br>NBR = " + NBR + "<br>SYN = " + SYN + "<br>FUNC = " + FUNC + "<br>LEX = " + LEX + "<br>SEM = " + SEM;
            scoreDetails.style.opacity = "1";

            let tempScore = SENT + NBR + SYN + FUNC + LEX + SEM;
            totalScore += tempScore;
            score.innerHTML = "Score : " + totalScore;
            scorelist.push(tempScore);
        }
    
        // onend, spawn nextbtn
        recognition.onend = function () {
            nextbtn.style.display = "block";
            setTimeout(() => {
                nextbtn.style.opacity = "1";
            }, 1000);
        };

        startbtn.onclick = () => {
            recognition.start();
        }
    }
    catch(e) {
        console.log(e);
    }
}