const timerPar = document.getElementById("timer");
const statusLbl = document.getElementById("status");
const minutesLbl = document.getElementById("minutes");
const secondsLbl = document.getElementById("seconds");

const startBtn = document.getElementById("start");
const stopBtn = document.getElementById("stop");
const resetBtn = document.getElementById("reset");
const testBellBtn = document.getElementById("bell_call");
const testCountBellBtn = document.getElementById("bell_call2");

const min1Text = document.getElementById("min1");
const bell1Sel = document.getElementById("bell1");
const min2Text = document.getElementById("min2");
const bell2Sel = document.getElementById("bell2");
const min3Text = document.getElementById("min3");
const bell3Sel = document.getElementById("bell3");
const texts = [min1Text, min2Text, min3Text];
const bells = [bell1Sel, bell2Sel, bell3Sel];
let minutes = [0, 8, 10];
let timer;
let miniTimer;
let now = 0;

let checkCountDown = null;

function minusPadding(isMinus, num) {
    return (isMinus ? "-" : "") + num.toString();
}

function zeroPadding(num) {
    return ("00" + num).slice(-2);
}

function setTimer() {
    for (let i in texts) {
        if (texts[i].value) {
            if (texts[i].value.match(/^\d+$/g)) {
                minutes[i] = parseInt(texts[i].value);
            }
            texts[i].value = minutes[i]
        } else {
            minutes[i] = 0;
        }
    }
    now = minutes[2] * 60;
    timerPar.style.color = "white";
    minutesLbl.innerText = minutes[2];
    secondsLbl.innerText = zeroPadding(0);
}

function coundDown() {
    now -= 1;
    timerPar.style.color = (now < 0) ? "#E64A19" : "white";
    minutesLbl.innerText = minusPadding(now < 0, Math.abs(parseInt(now / 60, 10)));
    secondsLbl.innerText = zeroPadding(Math.abs(now) % 60);

    for (let i = 2; i >= 0; i--) {
        if ((now == (minutes[2] - minutes[i]) * 60) && (bells[i].value != 0)) {
            let bellSound = new Audio();
            bellSound.src = "./sounds/bell" + bells[i].value + ".mp3";
            console.log(bellSound.src);
            bellSound.play();
            break;
        }
    }
}

const call_bell = () => {
    let bell = new Audio();
    bell.src = "sounds/bell1.mp3";
    bell.play();
    console.log("ring!");
}

const call_bell2 = () => {
    testCountBellBtn.innerHTML = "3";
    const bell = new Audio();
    bell.src = "sounds/bell1.mp3";
    bell.volume = 0;
    bell.play();
    miniTimer = setInterval( myCountDown, 1000 );
}

const myCountDown = () => {
    if (!checkCountDown) checkCountDown = 3; 
    checkCountDown--;

    testCountBellBtn.innerHTML = (checkCountDown == 0) ? "3カウント" : checkCountDown;
    if (checkCountDown == 0){
        const bell = new Audio();
        bell.src = "sounds/bell1.mp3";
        bell.play();
        console.log("ring!!");
        clearInterval(miniTimer);
    }
}

window.onload = function() {
    minutesLbl.innerHTML = minutes[2];
    secondsLbl.innerText = zeroPadding(0);
    stopBtn.disabled = true;
    resetBtn.disabled = true;
    min2Text.value = minutes[1];
    min3Text.value = minutes[2];
    now = minutes[2] * 60;

    startBtn.addEventListener("click", function() {
        statusLbl.innerText = "残り";
        this.disabled = true;
        stopBtn.disabled = false;
        resetBtn.disabled = true;
        for(let i in texts) {
            texts[i].disabled = true
            bells[i].disabled = true
        }
        timer = setInterval(coundDown, 1000);
    }, false);

    stopBtn.addEventListener("click", function() {
        statusLbl.innerText = "停止中";
        this.disabled = true;
        startBtn.disabled = false;
        resetBtn.disabled = false;
        for(let i in texts) {
            texts[i].disabled = false
            bells[i].disabled = false
        }
        clearInterval(timer);
    }, false);

    resetBtn.addEventListener("click", function() {
        statusLbl.innerText = "残り";
        resetBtn.disabled = true;
        now = minutes[2] * 60;
        timerPar.style.color = "white";
        minutesLbl.innerText = minutes[2];
        secondsLbl.innerText = zeroPadding(0);
    }, false);


    for (let text of texts) {
        text.addEventListener("input", setTimer, false);
    }
}

testBellBtn.addEventListener("click", call_bell, false);

testCountBellBtn.addEventListener("click", call_bell2, false);
