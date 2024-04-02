const timerPar = document.getElementById("timer");
const statusLbl = document.getElementById("status");
const minutesLbl = document.getElementById("minutes");
const secondsLbl = document.getElementById("seconds");

const elapsedMinutesLbl = document.getElementById("elapsed_minutes");
const elapsedSecondsLbl = document.getElementById("elapsed_seconds");

const startBtn = document.getElementById("start");
const stopBtn = document.getElementById("stop");
const resetBtn = document.getElementById("reset");
const bellBtn = document.getElementById("bell");
const wrapBtn = document.getElementById("wrap");

const limitField = document.getElementById("limitField");
const minPass1 = document.getElementById("minutesPass1");
const minRest1 = document.getElementById("minutesRest1");
const minPass2 = document.getElementById("minutesPass2");
const minRest2 = document.getElementById("minutesRest2");
const minPass3 = document.getElementById("minutesPass3");
const minRest3 = document.getElementById("minutesRest3");
const minPassArray = [minPass1, minPass2, minPass3];
const minRestArray = [minRest1, minRest2, minRest3];

let minutes = [0, 0, 0]; // minutes
let timer;
let startTime = 0; // milli seconds 開始した時間
let limitTime = 0; // minutes 発表時間（制限時間）
let passTime = 0; // seconds 経過時間
let passBackup = 0; // seconds 経過時間用のバックアップ
let wrapBackup = 0; // seconds ラップ用のバックアップ
let wrapList = [];
let wrapListDom = document.getElementById("wrapList");

const getValue = (rawValue, defaultValue) => {
  const number = parseInt(rawValue);
  return isNaN(number) ? defaultValue : number;
};

const getQueries = () => {
  const params = new URLSearchParams(window.location.search);
  return {
    limit: getValue(params.get("limit"), 10),
    bell1: getValue(params.get("bell1"), 8),
    bell2: getValue(params.get("bell2"), 10),
    bell3: getValue(params.get("bell3"), 0),
  };
};

const setupValues = () => {
  const queries = getQueries();
  minutes = [queries.bell1, queries.bell2, queries.bell3];
  limitTime = queries.limit;
};

const setQueries = () => {
  const queries = {
    limit: limitTime,
    bell1: minutes[0],
    bell2: minutes[1],
    bell3: minutes[2],
  };
  const params = new URLSearchParams(queries);
  history.replaceState(null, "", `?${params.toString()}`);
};

const minusPadding = (isMinus, num) => {
  return (isMinus ? "-" : "") + num.toString();
};

const zeroPadding = (num) => {
  return ("00" + num).slice(-2);
};

const toHalfNumber = (text) => {
  return text.replace(/[０-９]/g, (s) => {
    return String.fromCharCode(s.charCodeAt(0) - 0xfee0);
  });
};

const setupUI = () => {
  minutesLbl.innerHTML = limitTime;
  secondsLbl.innerText = zeroPadding(0);
  stopBtn.disabled = true;
  resetBtn.disabled = true;
  wrapBtn.disabled = true;
  limitField.value = limitTime;
  if (minutes[0] !== 0) {
    minPass1.value = minutes[0];
    minRest1.value = limitTime - minutes[0];
  }
  if (minutes[1] !== 0) {
    minPass2.value = minutes[1];
    minRest2.value = limitTime - minutes[1];
  }
  if (minutes[2] !== 0) {
    minPass3.value = minutes[2];
    minRest3.value = limitTime - minutes[2];
  }
};

const setupTimer = () => {
  passTime = 0;
  passBackup = 0;
  wrapTime = 0;
  timerPar.style.color = "white";
  minutesLbl.innerText = limitTime;
  secondsLbl.innerText = zeroPadding(0);
  elapsedMinutesLbl.innerText = zeroPadding(0);
  elapsedSecondsLbl.innerText = zeroPadding(0);
};

const callSilentBell = () => {
  const bell = new Audio();
  bell.src = "sounds/bell1.mp3";
  bell.volume = 0.0;
  bell.play();
};

// seconds タイマー開始からの経過時間の取得
// バックアップは一時停止したときの対応用
const getPassTime = () => {
  const currentTime = new Date().getTime(); // milli seconds
  return passBackup + Math.floor((currentTime - startTime) / 1000);
};

const countDown = () => {
  const _passTime = getPassTime();

  if (_passTime != passTime) {
    for (let i = 2; i >= 0; i--) {
      if (minutes[i] > 0 && _passTime == minutes[i] * 60) {
        const bellSound = new Audio();
        bellSound.src = "./sounds/bell" + minPassArray[i].name + ".mp3";
        bellSound.play();
        break;
      }
    }
  }

  passTime = _passTime;
  const restTime = limitTime * 60 - passTime; // seconds 残り時間
  timerPar.style.color = restTime < 0 ? "#E64A19" : "white";
  minutesLbl.innerText = minusPadding(restTime < 0, Math.abs(parseInt(restTime / 60, 10)));
  secondsLbl.innerText = zeroPadding(Math.abs(restTime) % 60);
  elapsedMinutesLbl.innerText = zeroPadding(Math.abs(parseInt(passTime / 60, 10)));
  elapsedSecondsLbl.innerText = zeroPadding(Math.abs(passTime) % 60);
};

const startTimer = () => {
  statusLbl.innerText = "残り";
  startBtn.disabled = true;
  stopBtn.disabled = false;
  resetBtn.disabled = true;
  wrapBtn.disabled = false;
  limitField.disabled = true;
  for (let i = 0; i < 3; i++) {
    minPassArray[i].disabled = true;
    minRestArray[i].disabled = true;
  }
  callSilentBell();
  startTime = new Date().getTime();
  timer = setInterval(countDown, 100);
};

const stopTimer = () => {
  clearInterval(timer);
  passBackup = passTime;
  statusLbl.innerText = "停止中";
  stopBtn.disabled = true;
  startBtn.disabled = false;
  resetBtn.disabled = false;
  wrapBtn.disabled = true;
  limitField.disabled = false;
  for (let i = 0; i < 3; i++) {
    minPassArray[i].disabled = false;
    minRestArray[i].disabled = false;
  }
};

const resetTimer = () => {
  setupTimer();
  statusLbl.innerText = "残り";
  resetBtn.disabled = true;

  // ラップタイムの初期化，およびラップタイムリストの配列，DOMリストを削除
  wrapTime = 0;
  wrapList = [];
  while (wrapListDom.firstChild) {
    wrapListDom.removeChild(wrapListDom.firstChild);
  }
};

const callBell = () => {
  const bell = new Audio();
  bell.src = "sounds/bell1.mp3";
  bell.play();
};

const addWrap = () => {
  if (startBtn.disabled == false) return;

  const wrapTime = passTime - wrapBackup; // ラップ
  const wrap_minute = zeroPadding(Math.abs(parseInt(wrapTime / 60, 10)));
  const wrap_second = zeroPadding(Math.abs(wrapTime) % 60);
  const _minute = elapsedMinutesLbl.innerText;
  const _second = elapsedSecondsLbl.innerText;
  wrapBackup = passTime;

  const wrap = `${wrap_minute}:${wrap_second}（${_minute}:${_second}）`;
  const li = document.createElement("li");
  const attr = document.createAttribute("class");
  attr.value = "wrap_item";
  li.setAttributeNode(attr);
  li.appendChild(document.createTextNode(wrap));

  wrapListDom.appendChild(li);
  wrapList.push(wrap);
};

// 経過のフィールドが更新されたとき発火
const updatePass = () => {
  for (let i = 0; i < 3; i++) {
    let value = minPassArray[i].value;
    if (value) {
      value = toHalfNumber(value);
      if (value.match(/^-?\d+$/g)) {
        minutes[i] = parseInt(value);
      } else if (value == "-") {
        minutes[i] = 0;
      }
      minPassArray[i].value = minutes[i];
      minRestArray[i].value = limitTime - minutes[i];
    } else {
      minutes[i] = 0;
      minRestArray[i].value = "";
    }
  }
  setQueries();
};

// 残りのフィールドが更新されたとき発火
const updateRest = () => {
  for (let i = 0; i < 3; i++) {
    let value = minRestArray[i].value;
    if (value) {
      value = toHalfNumber(value);
      if (value.match(/^-?\d+$/g)) {
        minutes[i] = limitTime - parseInt(value);
      } else if (value == "-") {
        minutes[i] = limitTime;
      }
      minPassArray[i].value = minutes[i];
      minRestArray[i].value = limitTime - minutes[i];
    } else {
      minutes[i] = 0;
      minPassArray[i].value = "";
    }
  }
  setQueries();
};

// 発表時間のフィールドが更新されたとき発火
const updateLimit = () => {
  let value = limitField.value;
  if (value) {
    value = toHalfNumber(value);
    if (value.match(/^\d+$/g)) {
      limitTime = parseInt(value);
    }
    limitField.value = limitTime;
  } else {
    limitTime = 0;
  }
  updatePass();
  setupTimer();
};

window.addEventListener("load", () => {
  setupValues();
  setupUI();
  startBtn.addEventListener("click", startTimer, false);
  stopBtn.addEventListener("click", stopTimer, false);
  resetBtn.addEventListener("click", resetTimer, false);
  bellBtn.addEventListener("click", callBell, false);
  wrapBtn.addEventListener("click", addWrap, false);
  for (let minPass of minPassArray) {
    minPass.addEventListener("input", updatePass, false);
  }
  for (let minRest of minRestArray) {
    minRest.addEventListener("input", updateRest, false);
  }
  limitField.addEventListener("input", updateLimit, false);
});
