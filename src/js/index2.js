/**
 * Created by ASUS on 2018/8/2.
 */
var wrapper = document.getElementsByClassName('wrapper')[0];
wrapper.style.height = window.innerHeight + 'px';
var start = document.getElementsByClassName('start')[0];
var startGame = document.getElementsByClassName('startGame')[0];
var content = document.getElementsByClassName('content')[0];
var mapLi = document.getElementsByTagName('li');
var score = document.getElementsByTagName('span')[0];
var startPause = document.getElementsByClassName('start-pause')[0];

var loser = document.getElementById('loser');
var loserScore = document.getElementById('loserScore');
var close = document.getElementById('close');

var timer;
var mapW = 20;
var mapH = 20;
var snakeArr = [];
var foodPosition; //食物位置
var scores = 0;
var state;  //上下左右的状态
var startFlag = false;


start.onclick = function () {
    startGame.style.display = 'none';
    startFlag = true;
    init();
}

function init() {
    if(startFlag){
        map(mapW, mapH);
        snake();
        food();
        bind();
        move('right');
    }

}
function bind() {
    document.onkeydown = function (e) {
        var event = e || window.event;
        switch (event.keyCode){
            case 38:
                if (state == 'dowm'){
                    break;
                }else {
                    clearInterval(timer);
                    move('up');
                    break;
                }
            case 40:
                if(state == 'up'){
                    break
                }else {
                    clearInterval(timer);
                    move('dowm');
                    break;
                }
            case 37:
                if(state == 'right'){
                    break
                }else {
                    clearInterval(timer);
                    move('left')
                    break;
                }
            case 39:
                if(state == 'left'){
                    break;
                }else {
                    clearInterval(timer)
                    move('right')
                    break
                }
        }
    }

        close.onclick = function () {

            loser.style.display = 'none';
            score.innerText = 0;
            mapW = 20;
            mapH = 20;
            snakeArr = [];
            foodPosition; //食物位置
            scores = 0;
            state = null;
            init()
        }

        startPause.onclick = function () {
            if(start){
                clearInterval(timer)
                start = false;
                startPause.style.backgroundImage = 'url("src/image/start.png")';
            }else {
                start = true;
                startPause.style.backgroundImage = "url('src/image/pause.png')";
                move(state);
            }
        }
}
function map(x, y) {
    var html = '';
    for(var i = 1; i <= x; i ++){
        for (var j = 1; j <= y ; j ++){
            html += '<li></li>';
        }
    }
    content.innerHTML = html;

}

//初始化蛇
function snake() {
    var headI = 1;
    var headJ = 2;
    // arrli[headI][headJ] = 'snakeHead';
    // arrli[headI][headJ - 1] = 'snakeBody';
    mapLi[headI * headJ -1].className = 'snakeHeadR';
    mapLi[headI * headJ -2].className = 'snakeBody';
    // var snakeH = {
    //     i:headI,
    //     j:headJ
    // }
    snakeArr.push({'name':'snakeHead',x:headI, y:headJ });
    snakeArr.push({'name':'snakeBody',x:headI, y:headJ - 1});
}

function move(direction) {
    var len = snakeArr.length;

    timer = setInterval(function () {
        var endBody = (snakeArr[len - 1].x -1) *  mapW + snakeArr[len - 1].y - 1;

            if(direction == 'right' ){
                if(snakeArr[0].y < 20 && mapLi[(snakeArr[0].x - 1)*mapW  + snakeArr[0].y].className.indexOf('snakeBody') == -1){
                        mapLi[endBody].className = '';
                        xyChange(len);
                        snakeArr[0].y ++;
                        mapLi[(snakeArr[0].x - 1)*mapW  + snakeArr[0].y - 1].className = 'snakeHeadR';
                }else {
                    gameOver();
                }
            }else if(direction == 'left'){
                if(snakeArr[0].y > 1 && mapLi[(snakeArr[0].x - 1)*mapW  + snakeArr[0].y -2].className.indexOf('snakeBody') == -1){
                    mapLi[endBody].className = '';
                    xyChange(len);
                    snakeArr[0].y --
                    mapLi[(snakeArr[0].x - 1)*mapW  + snakeArr[0].y - 1].className = 'snakeHeadL'
                }else {
                    gameOver();
                }

            }else if (direction == 'up'){
                if(snakeArr[0].x > 1 && mapLi[(snakeArr[0].x - 2)*mapW  + snakeArr[0].y -1].className.indexOf('snakeBody') == -1){
                    mapLi[endBody].className = '';
                    xyChange(len);
                    snakeArr[0].x --;
                    mapLi[(snakeArr[0].x - 1)*mapW  + snakeArr[0].y - 1].className = 'snakeHeadU'
                }else {
                    gameOver();
                }

            }else if (direction == 'dowm'){
                if(snakeArr[0].x < 20 && mapLi[(snakeArr[0].x)*mapW  + snakeArr[0].y -1].className.indexOf('snakeBody') == -1){
                    mapLi[endBody].className = '';
                    xyChange(len);
                    snakeArr[0].x ++;
                    mapLi[(snakeArr[0].x - 1)*mapW  + snakeArr[0].y - 1].className = 'snakeHeadD';
                }else {
                    gameOver();
                }
            }
            if (((snakeArr[0].x - 1)*mapW  + snakeArr[0].y - 1) == foodPosition){
                eat(direction);
            }
            state = direction;

    },200)
}


function gameOver() {
    loser.style.display = 'block';
    loserScore.innerText = scores;
     clearInterval(timer);

}

//蛇的现在某一节的位置 等于上一节上次的位置
function xyChange(len) {
    for(var i = len - 1; i > 0; i --){
        snakeArr[i].x = snakeArr[i - 1].x;
        snakeArr[i].y = snakeArr[i - 1].y;
        mapLi[(snakeArr[i].x - 1) * mapW + snakeArr[i].y - 1].className = 'snakeBody'
    }
}

function food() {
    foodPosition = Math.floor(Math.random()*400);
    if(mapLi[foodPosition].className.indexOf('snake') != -1){
        food();
    }else {
        mapLi[foodPosition].className = 'food';
    }
}

function eat(state) {
    clearInterval(timer)
    var i = snakeArr[snakeArr.length - 1].x;
    var j = snakeArr[snakeArr.length - 1].y;
    snakeArr.push({'name':'snakeBody',x:i,y:j});
    scores ++;
    score.innerText = scores;
    food();
    move(state);
}