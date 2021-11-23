let overlays = ["C1","R1","U1","D1","GR","C2","R2","U2","D2","RH"];
let existing_usernames = [];
let accounts = [{"id":"1","username":"admin","password":"$2y$10$roLRhIODtP/NPmWYOYOFMOh1uYmOPiDcyMvzEYr86fnnITDGxmRt6","usertype":"admin"},{"id":"2","username":"testuser","password":"$2y$10$6weG4vT/ve5nUV6WfJ1iu.4YzoFCyNqY2vZuOglQIER4ElrHtRcFu","usertype":"user"}];
let diagnosis = [{"id":"1","username":"testuser","score":"96","OTP":"0.5","meantime":"3000","date":"2020-05-30"},{"id":"2","username":"admin","score":"100","OTP":"0.00184","meantime":"2693","date":"2020-05-31"},{"id":"3","username":"admin","score":"100","OTP":"0.00184","meantime":"6568","date":"2020-06-01"},{"id":"4","username":"dummy1","score":"60","OTP":"0","meantime":"656","date":"2020-06-01"}];
let treatment = [{"id":"1","username":"testuser","precise":"0.75","accuracy":"0.8","date":"2020-05-30"},{"id":"2","username":"admin","precise":"0.91","accuracy":"0.93","date":"2020-05-31"},{"id":"3","username":"dummy1","precise":"0.61","accuracy":"0.79","date":"2020-06-01"}];

let myRadarChart;

window.onload = function() {
    let config = { type: 'radar', data: {datasets: [{data: [0, 0, 0, 0]}]}};
    let ctx = document.getElementById("GR-chart-canvas").getContext('2d');
    myRadarChart = new Chart(ctx, config);
}

function displayOverlaySelection(sel, val) {
    if (val == '') return;
    for (let i = 0; i < overlays.length; i++)
        document.getElementById(overlays[i]).style.display = "none";
    document.getElementById(sel).style.display = "flex";

    switch (sel) {
        case 'R1': R1_updateData(); break;
        case 'R2': R2_updateData(); break;
        case 'GR': GR_run(val); break;
        case 'RH': RH_run(val); break;
    }
}

function C1_run() {

    let newName = document.getElementById("new-username").value;
    let newPass = document.getElementById("new-pwd").value;
    let newPassRep = document.getElementById("new-pwd-rep").value;
    let newAdmin = document.getElementById("new-admin").checked;
    let outputLog = document.getElementById("C1-panel-output");

    outputLog.innerHTML += "Run initiated.\nChecking input values...\n";

    if (newName == '') {
        outputLog.innerHTML += "[ERR] Username is empty. Aborting...\n";
    }
    else if (/[!@#$%^&*()<> ]/.test(newName)) {
        outputLog.innerHTML += "[ERR] Username has invalid symbol(s). Aborting...\n";
    }
    else if (existing_usernames.includes(newName)) {
        outputLog.innerHTML += "[ERR] Username already exists.\n";
    }
    else if (newPass.length < 7) {
        outputLog.innerHTML += "[ERR] Password too short. Aborting...\n";
    }
    else if (newPass != newPassRep) {
        outputLog.innerHTML += "[ERR] Password retype does not match. Aborting...\n";
    }
    else {
        outputLog.innerHTML += "Input values valid.\n[ACK] New account created.\n";
        accounts.push({
            id: (accounts.length+1).toString(),
            username: newName,
            password: "refresh-to-view-hashed-output",
            usertype: newAdmin ? "admin" : "user"
        });
    }

    outputLog.innerHTML += "\n";
    outputLog.scrollTop = outputLog.scrollHeight;
}

function R1_updateData() {
    
    let outputLog = document.getElementById("R1-panel-output");
    outputLog.innerHTML = "-----------------------\nStringified JSON output\n-----------------------\n\n";
    document.getElementById("R1-panel-output").innerHTML += JSON.stringify(accounts) + "\n\n";
    outputLog.innerHTML += "--------\nCSV Data\n--------\n\n";

    outputLog.innerHTML += (() => {
        let temp = "id,username,password,usertype\n";
        let R1Table = document.getElementById("R1-table");
        R1Table.innerHTML = '<colgroup><col span="1" style="width: 10%;"><col span="1" style="width: 15%;"><col span="1" style="width: 60%;"><col span="1" style="width: 15%;"></colgroup>';
        R1Table.innerHTML += '<tr><th>id</th><th>username</th><th>password</th><th>usertype</th></tr>';

        for (let i = 0; i < accounts.length; i++) {
            temp += accounts[i]['id']+","+accounts[i]['username']+","+accounts[i]['password']+","+accounts[i]['usertype']+"\n";
            R1Table.innerHTML += '<tr><td>'+accounts[i]['id']+'</td><td>'+accounts[i]['username']+'</td><td>'+accounts[i]['password']+'</td><td>'+accounts[i]['usertype']+'</td></tr>';
        }
        return temp;
    })();
}

function U1_run() {

    let targetName = document.getElementById("target-user").value;
    let newName = document.getElementById("updated-usr").value;
    let newPass = document.getElementById("updated-pwd").value;
    let newPassRep = document.getElementById("updated-pwd-rep").value;
    let outputLog = document.getElementById("U1-panel-output");
    let found = false;

    outputLog.innerHTML += "Run initiated.\nChecking input values...\n";

    for (let i = 0; i < accounts.length; i++) {
        if (accounts[i].username == targetName)
            found = i+1;
    }

    if (!found) {
        outputLog.innerHTML += "[ERR] Target user not found. Aborting...\n";
    }
    else if (/[!@#$%^&*()<> ]/.test(newName)) {
        outputLog.innerHTML += "[ERR] Username has invalid symbol(s). Aborting...\n";
    }
    else if (existing_usernames.includes(newName) && (newName != targetName)) {
        outputLog.innerHTML += "[ERR] Username already exists.\n";
    }
    else if (newPass != '' && newPass.length < 7) {
        outputLog.innerHTML += "[ERR] Password too short. Aborting...\n";
    }
    else if (newPass != newPassRep) {
        outputLog.innerHTML += "[ERR] Password retype does not match. Aborting...\n";
    }
    else {
        outputLog.innerHTML += "Input values valid.\n[ACK] Account updated.\n";
        accounts[found-1].username = newName != '' ? newName : targetName;
        accounts[found-1].password = "refresh-to-view-hashed-output";
        existing_usernames = [];
        for (let i = 0; i < accounts.length; i++)
            existing_usernames.push(accounts[i].username);

        if (newName === '')
            document.getElementById("updated-usr").value = targetName;

        document.forms['U1-update-form'].submit();
    }
    outputLog.innerHTML += "\n";
    outputLog.scrollTop = outputLog.scrollHeight;
}

function D1_run() {

    let targetName = document.getElementById("D1-target-user").value;
    let outputLog = document.getElementById("D1-panel-output");

    if (!existing_usernames.includes(targetName)) {
        outputLog.innerHTML += "[ERR] Target user not found. Aborting...\n";
    }
    else {
        accounts.splice(existing_usernames.indexOf(targetName),1);
        existing_usernames = [];
        for (let i = 0; i < accounts.length; i++)
            existing_usernames.push(accounts[i].username);

        outputLog.innerHTML += "Input values valid.\n[ACK] Account deleted.\n";
    }
    document.forms['D1-update-form'].submit();
}

function C2_run() {

    let newScore = document.getElementById("new-score").value;
    let outputLog = document.getElementById("C2-panel-output");

    if (newScore === "" || isNaN(newScore)) {
        outputLog.innerHTML += "[ERR] Input invalid. Aborting...\n";
    }
    else {
        outputLog.innerHTML += "Input values valid.\n[ACK] New controlled data created.\n";
        controlled.push({id: (controlled.length+1).toString, score: newScore});
        document.forms['C2-update-form'].submit();
    }
    outputLog.innerHTML += "\n";
    outputLog.scrollTop = outputLog.scrollHeight;
}

function R2_updateData() {
    let outputLog = document.getElementById("R2-panel-output");
    outputLog.innerHTML = "-----------------------\nStringified JSON output\n-----------------------\n\n";
    outputLog.innerHTML += JSON.stringify(controlled) + "\n\n";
    outputLog.innerHTML += "--------\nCSV Data\n--------\n\n";

    outputLog.innerHTML += (() => {
        let temp = "id,score\n";
        let R2Table = document.getElementById("R2-table");
        R2Table.innerHTML = '<colgroup><col span="1" style="width: 50%;"><col span="1" style="width: 50%;"></colgroup>';
        R2Table.innerHTML += '<tr><th>id</th><th>score</th></tr>';

        for (let i = 0; i < controlled.length; i++) {
            temp += controlled[i]['id']+","+controlled[i]['score']+"\n";
            R2Table.innerHTML += '<tr><td>'+controlled[i]['id']+'</td><td>'+controlled[i]['score']+'</td></tr>';
        }
        return temp;
    })();
}

function U2_run() {
    let targetID = document.getElementById("target-ID").value;
    let newData = document.getElementById("updated-data").value;
    let outputLog = document.getElementById("U2-panel-output");
    let found = false;

    for (let i = 0; i < controlled.length; i++) {
        if (controlled[i]['id'] == targetID) {
            found = i+1;
        }
    }

    if (!found) {
        outputLog.innerHTML += "[ERR] Target data not found. Aborting...\n";
    }
    else if (newData === "" || isNaN(newData)) {
        outputLog.innerHTML += "[ERR] Invalid input score. Aborting...\n";
    }
    else {
        outputLog.innerHTML += "Input values valid.\n[ACK] Controlled data updated.\n";
        controlled[found-1].score = newData;
        document.forms['U2-update-form'].submit();
    }
    outputLog.innerHTML += "\n";
    outputLog.scrollTop = outputLog.scrollHeight;
}

function D2_run() {

    let targetID = document.getElementById("D2-target-ID").value;
    let outputLog = document.getElementById("D2-panel-output");
    let found = false;

    for (let i = 0; i < controlled.length; i++) {
        if (controlled[i]['id'] == targetID) {
            found = i+1;
        }
    }

    if (!found) {
        outputLog.innerHTML += "[ERR] Target controlled data not found. Aborting...\n";
    }
    else {
        controlled.splice(found-1,1);
        outputLog.innerHTML += "Input values valid.\n[ACK] Controlled data deleted.\n";
    }
    document.forms['D2-update-form'].submit();
}

function RH_run(JSON_str) {

    let HMCanvas = document.getElementsByClassName("heatmap-canvas");
    if (HMCanvas.length != 0)
        HMCanvas[0].parentNode.removeChild(HMCanvas[0]);

    let isValidHeatmapJSON = false;
    let obj;

    try {
        obj = JSON.parse(JSON_str);
        isValidHeatmapJSON = obj.hasOwnProperty('pic') && obj.hasOwnProperty('coord');
    } catch (e) {
        isValidHeatmapJSON = false;
    }

    if (!isValidHeatmapJSON) return;

    document.getElementById('binpic1').src = "src/PIC/q" + (parseInt(obj.pic)+1) + "a.png";
    document.getElementById('binpic2').src = "src/PIC/q" + (parseInt(obj.pic)+1) + "b.png";

    let config = {
        container: document.getElementById('RH'),
        radius: 10,
        maxOpacity: .5,
        minOpacity: 0,
        blur: .75
    };

    var heatmapInstance = h337.create(config);
    heatmapInstance.setData({data: []});
    heatmapInstance.setDataMax(100);
    heatmapInstance.setDataMin(0);

    for (const [k, v] of Object.entries(obj.coord)) {

        let myX = parseInt(k);
        if (myX < 250) continue;

        let dataPoint = {
            radius: 50,
            x: (myX - 250)*0.9,
            y: (v-20)*0.9,
            value: 70
        }
        heatmapInstance.addData(dataPoint);
    }
}

function GR_run(targetName) {

    let grTable1 = document.getElementById('GR-table1');
    let grTable2 = document.getElementById('GR-table2');
    
    let selected_diagnosis = [];
    let selected_treatment = [];
    let diag_scores = [];
    let diag_times = [];
    let t_accuracy = [];
    let t_precision = [];
    let S = 0.0, T = 0.0, A = 0.0, P = 0.0;

    for (let i = 0; i < diagnosis.length; i++) {
        if (diagnosis[i].username == targetName) {
            selected_diagnosis.push(diagnosis[i]);
        }
    }
    for (let i = 0; i < treatment.length; i++) {
        if (treatment[i].username == targetName) {
            selected_treatment.push(treatment[i]);
        }
    }

    grTable1.innerHTML = '<colgroup><col span="1" style="width: 25%;"><col span="1" style="width: 25%;"><col span="1" style="width: 25%;"><col span="1" style="width: 25%;"></colgroup>';
    grTable1.innerHTML += '<tr><th>date</th><th>score</th><th>OTP</th><th>meantime</th></tr>';

    grTable2.innerHTML = '<colgroup><col span="1" style="width: 33.33%;"><col span="1" style="width: 33.33%;"><col span="1" style="width: 33.33%;"></colgroup>';
    grTable2.innerHTML += '<tr><th>date</th><th>precision</th><th>accuracy</th></tr>';

    for (let i = 0; i < selected_diagnosis.length; i++) {
        grTable1.innerHTML += '<tr><td>'+selected_diagnosis[i]['date']+'</td><td>'+selected_diagnosis[i]['score']+'</td><td>'+selected_diagnosis[i]['OTP']+'</td><td>'+selected_diagnosis[i]['meantime']+'</td></tr>';
        diag_scores.push(parseFloat(selected_diagnosis[i].score));
        diag_times.push(parseFloat(selected_diagnosis[i].meantime));
        S += parseFloat(selected_diagnosis[i].score);
        T += parseFloat(selected_diagnosis[i].meantime);
    }
    for (let i = 0; i < selected_treatment.length; i++) {
        grTable2.innerHTML += '<tr><td>'+selected_treatment[i]['date']+'</td><td>'+selected_treatment[i]['precise']+'</td><td>'+selected_treatment[i]['accuracy']+'</td></tr>';
        t_precision.push(parseFloat(selected_treatment[i].precise));
        t_accuracy.push(parseFloat(selected_treatment[i].accuracy));
        A += parseFloat(selected_treatment[i].accuracy);
        P += parseFloat(selected_treatment[i].precise);
    }

    if (diag_scores.length > 0) {
        S /= diag_scores.length;
        S = Math.floor(S/10);
        T /= diag_times.length;
        if (T > 10000) T = 0;
        else T = Math.floor((10000 - T)/1000); 
    }

    if (t_accuracy.length > 0) {
        P /= t_precision.length;
        P = Math.floor(P*10);
        A /= t_accuracy.length;
        A = Math.floor(A*10);
    }

    let config = {
        type: 'radar',
        data: {
            labels: ['(D) Score', '(D) Time', '(T) Accuracy', '(T) Precision'],
            datasets: [{
                label: targetName,
                data: [S, T, A, P],
                backgroundColor: "rgba(71, 142, 255, 0.5)",
                borderColor: "rgba(71, 142, 255, 1)"
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            title: { display: false },
            legend: { display: false, },
            hover: { mode: 'nearest', intersect: true },
            scale: {
                ticks: {
                    display: false,
                    suggestedMin: 0,
                    suggestedMax: 10,
                    stepSize: 2
                }
            }
        }
    };

    let ctx = document.getElementById("GR-chart-canvas").getContext('2d');
    myRadarChart.destroy();
    myRadarChart = new Chart(ctx, config);
}