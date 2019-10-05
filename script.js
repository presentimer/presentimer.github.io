const statusLbl = document.getElementById("status");
const minutesLbl = document.getElementById("minutes");
const secondsLbl = document.getElementById("seconds");

const startBtn = document.getElementById("start");
const stopBtn = document.getElementById("stop");
const resetBtn = document.getElementById("reset");

const min1Text = document.getElementById("min1");
const bell1Sel = document.getElementById("bell1");
const min2Text = document.getElementById("min2");
const bell2Sel = document.getElementById("bell2");
const min3Text = document.getElementById("min3");
const bell3Sel = document.getElementById("bell3");
const texts = [min1Text, min2Text, min3Text];
const bells = [bell1Sel, bell2Sel, bell3Sel];
let minutes = [0, 0, 10];
let timer;
let now = 0;

// function spacePadding(num) {
//     return num.toString().length < 2 ? "&ensp;" + num : num;
// }

function zeroPadding(num) {
    return ('00' + num).slice(-2);
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
    minutesLbl.innerText = minutes[2];
    secondsLbl.innerText = zeroPadding(0);
}

function coundDown() {
    now -= 1;
    minutesLbl.innerText = parseInt(now / 60, 10);
    secondsLbl.innerText = zeroPadding(now % 60);
}

window.onload = function() {
    minutesLbl.innerHTML = minutes[2];
    secondsLbl.innerText = zeroPadding(0);
    stopBtn.disabled = true;
    min3Text.value = minutes[2];
    now = minutes[2] * 60;

    startBtn.addEventListener("click", function() {
        this.disabled = true;
        stopBtn.disabled = false;
        for(let i in texts) {
            texts[i].disabled = true
            bells[i].disabled = true
        }
        timer = setInterval(coundDown, 1000);
    }, false);

    stopBtn.addEventListener("click", function() {
        this.disabled = true;
        startBtn.disabled = false;
        for(let i in texts) {
            texts[i].disabled = true
            bells[i].disabled = true
        }
        clearInterval(timer);
    }, false);

    resetBtn.addEventListener("click", function() {

    }, false);

    for (let text of texts) {
        text.addEventListener("input", setTimer, false);
    }

}
