'use strict'

const CARROT_SIZE = 80;
const GAME_PALY_TIME = 5;
const CARROT_COUNT = 5;

const filed = document.querySelector(".game__field");
const fieldRect = filed.getBoundingClientRect();

const gameBtn = document.querySelector(".game__button");

const timeBoard = document.querySelector(".game__timer");
const scoreBoard = document.querySelector(".game__score");
const palyBtn = document.querySelector(".game__button");


const popupBoard = document.querySelector(".pop-up");
const popupMessages = document.querySelector(".pop-up__message");
const popupReflashBtn = document.querySelector(".pop-up__refresh");

const carrotSound = new Audio("./sound/carrot_pull.mp3");
const alertSound = new Audio("./sound/alert.wav");
const bgSound = new Audio("./sound/bg.mp3");
const bugSound = new Audio("./sound/bug_pull.mp3");
const winSound = new Audio("./sound/game_win.mp3");

let started = false;
let time = undefined;
let gameScore = CARROT_COUNT;
let winner = false;

gameBtn.addEventListener("click", ()=>{
    if(started){
        stopGame();
    }
    else{
        startGame();
    }
});

popupReflashBtn.addEventListener("click", ()=>{
    startGame();
    hidePopUp();
});

filed.addEventListener("click", (event)=>{
    findGameItem(event);
});


function startGame(){
    //버튼 클릭 시 당근, 벌래 생성
    //시간초 생성 및 시간 감소
    //점수판 생성 남아있는 개수 보여주기
    //플레이 버튼이 중지버튼으로 보여주기
    started = true;

    startSound(bgSound);
    init();
    moveTime();  
}

function stopGame(){
    started = false;
    
    displayPopBoard();          //팝업 버튼 보여주기
    hideGameBtn();              //버튼 감추기
    stopTime();                 //시간 멈추기
    stopSound(bgSound);
}

function finishGame(winner){
    clearInterval(time);

    if(winner){
        stopSound(bgSound);
        startSound(winSound);
        showPopUp("Game Winner 🎉");
    }
    else{
        stopSound(bgSound);
        stopSound(winSound);
        showPopUp("Game Lose 🤣");
    }
}

function showTimer(){
    timeBoard.style.visibility="visible";
}

function showScore(){
    scoreBoard.style.visibility="visible";
}

function showPopUp(text){
    popupBoard.classList.remove("pop-up--hide");
    hideGameBtn();
    showPopUpText(text);
}

function showStopBtn(){
    const item = palyBtn.querySelector(".fas");

    item.classList.remove("fa-play");
    item.classList.add("fa-stop");

    gameBtn.style.visibility = "visible";               //게임 버튼 다시 보이기
}

function showPopUpText(text){
    popupMessages.innerText = text;
}

function hideGameBtn(){
    gameBtn.style.visibility = "hidden";    //게임 버튼 감추기
}

function hidePopUp(){
    popupBoard.classList.add("pop-up--hide");
}

function moveTime(){
    let remainingTime = GAME_PALY_TIME;

    displayTimeBoard(remainingTime);

    time = setInterval(() => {
        if(remainingTime <= 0){
            // console.log("시간 초과");
            clearInterval(time);
            stopGame();
            return;
        }
        displayTimeBoard(--remainingTime)
    }, 1000);
}

function stopTime(){
    clearInterval(time);
}

function startSound(sound){
    sound.currentTime = 0;
    sound.play();
}

function stopSound(sound){
    sound.pause();
}

function displayTimeBoard(time){
    //화면에 표기하기
    const minutes = Math.floor(time / 60);
    const secondes = time % 60;
    timeBoard.innerText = `0${minutes}:0${secondes}`;
}

function displayScoreBoard(){
    scoreBoard.innerText = gameScore;
}

function displayPopBoard(){
    showPopUp("Game Repaly ❓");
}


function getImg(className, count, path){
    //당근 또는 벌래 이미지 가져오기
    const initX = 0;
    const initY = 0;
    const bounderX = fieldRect.width-CARROT_SIZE;
    const bounderY = fieldRect.height-CARROT_SIZE;


    for (let i=0 ; i < count ; i++){
        const item = document.createElement("img"); //img 태그 생성

        item.setAttribute("class", className);      //class 이름 생성
        item.setAttribute("src", path);             //src생성
        item.style.position = "absolute";
    
        const x = randomPosition(initX, bounderX);
        const y = randomPosition(initY, bounderY);

        item.style.left = `${x}px`;
        item.style.top = `${y}px`;

        filed.appendChild(item);                    //item 엘리먼트에 캐롯과 버그 추가
    }
}

function randomPosition(min, max){
    return Math.random() * (max - min)  + min;
}

function findGameItem(event){
    const item = event.target;

    if(started===false){
        return;
    }

    if(item.matches(".carrot")){
        gameScore--;
        displayScoreBoard();
        startSound(carrotSound);
        item.remove();
        if(gameScore===0){
            winner = true;
            finishGame(winner);
        }
    }else if(item.matches(".bug")){
        stopGame();
        winner = false;
        startSound(bugSound);
        finishGame(winner);
    }
}


function init(){
    filed.innerHTML = "";       //플레이 버튼 클릭 시 당근 벌레 초기화
    gameScore = CARROT_COUNT;
    getImg("carrot", CARROT_COUNT, "./img/carrot.png");
    getImg("bug", CARROT_COUNT, "./img/bug.png");

    showStopBtn();
    showTimer();
    showScore();
    displayScoreBoard();
}
