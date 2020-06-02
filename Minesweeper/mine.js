
const execBtn = document.querySelector("#exec");
const tbody = document.querySelector("#table > tbody");
let victoryFlag = false;//승리하면 클릭 안되게 하기 위한 조건
let stopFlag = false; //지뢰 밟으면 펑일때
let stopClassListRemove = true;
let tdDivClicked = false; //마우스로 누르고 td범위 나가면 테두리 원상복귀 시키기 위한 flag
// let rightClicked = true; //오른쪽 마우스 클릭시 테두리 변화 안주기 위해서
let cliceStart = false; //마우스 클릭후 move 이벤트 실행 시키기위해
const flags = 40;//깃발 개수
//지뢰찾기 theat tr 반응형으로 가로 크기 변하게 하기 위해서
const table = document.querySelector("table")
const theadTr = table.children[0].children[0];
const victory_btn = document.querySelector("#victory_btn");
const game_hidden = document.querySelector(".game_hidden");
const head = document.querySelector(".head");

let HOR, VER, MINE;
let dataset = [];//지뢰찾기 데이터

function resetData(){ //데이터셋, 지뢰화면 리셋
    dataset = [];
    if(tbody.hasChildNodes()){//tbody에 자식노드 있으면 리셋
        tbody.innerHTML = '';
    }
    stopFlag = false;
    stopClassListRemove = true;
    victoryFlag = false;
}

function rightClickedContext(text){ //오른쪽 클릭 된 ! ? 변화 안되게
    // console.log(text)
    if(text.contains("flagImage") || text.contains("questionImage")){
        return true;
    } else {
        return false;
    }
}
function flagCount(HOR, VER){//물음표 갯수 세기
    let count=0;
    for(let i=0; i<HOR; i++){
        for(let j=0; j<VER; j++){
            if(tbody.children[i].children[j].children[0].classList.contains("flagImage")){
                count++;
            }
        }
    }
    return flags - count;
}

let rightClicked = true;//오른쪽 버튼 누리고 마우스 이벤트 구현 안되게 하기위해서
function handleRightClick(e){//마우스 오른쪽 클릭 물음표
    if(victoryFlag){
        return;
    }
    e.preventDefault();
    if(stopFlag){
        return;
    }
    e.target.classList.add("tdDivDefaultBorder");
    
    rightClicked = false;//오른쪽 버튼 누리고 마우스 이벤트 구현 안되게 하기위해서
    if(!e.target.classList.contains("flagImage") && !e.target.classList.contains("questionImage")){
        e.target.classList.add("flagImage");
    } else if(e.target.classList.contains("flagImage")){
        e.target.classList.remove("flagImage");
        e.target.classList.add("questionImage")
    } else if(e.target.classList.contains("questionImage")){
        e.target.classList.remove("questionImage");
    }    

    //깃발 개수 세기 위해서
    const flagText = document.querySelector("#flagText");
    let count = flagCount(HOR, VER);
    flagText.textContent = `${count < 10 ? `00${count}` : count < 100 ? `0${count}`: count}`;
    if(count < 0){
        e.target.textContent = '';
        flagText.textContent = '000';
    }
}

function clickZreo(zero, row, col){//지뢰 수 0 클릭시 주변 오픈
    if(zero === 0){
        for(let i=-1; i<2; i++){
            for(let j=-1; j<2; j++){
                if(row+i >=0 && col+j>=0 && row+i < VER && col+j < HOR){
                    if(!tbody.children[row+i].children[col+j].children[0].classList.contains("flagImage") 
                    && !tbody.children[row+i].children[col+j].children[0].classList.contains("questionImage") 
                    && !tbody.children[row+i].children[col+j].children[0].classList.contains("clicked")){
                        tbody.children[row+i].children[col+j].children[0].textContent = dataset[row+i][col+j] === 0 ? '' : dataset[row+i][col+j];
                        tbody.children[row+i].children[col+j].children[0].classList.add("clicked");
                        tbody.children[row+i].children[col+j].children[0].classList.remove("tdDivDefaultBorder");
                        if(dataset[row+i][col+j] === 0){
                            
                            clickZreo(dataset[row+i][col+j], row+i, col+j);
                        }
                    }
                }
            }
        }
    }
}

function idRowCol(strId){//문자열형태의 id를 원하는 형태, 숫자인 row와 col로 바꿈
    return strId.split(',').map(v => Number(v));
}
const modal = document.querySelector(".modal");
const victory_second = document.querySelector("#victory_second");
function victory(){//승리 조건
    // HOR, VER,
    let clickedCount = 0;
    for(let i=0; i<HOR; i++){
        for(let j=0; j<VER; j++){
            if(tbody.children[i].children[j].children[0] === undefined){
                console.log('dfd')
                const div = document.createElement("div");
                tbody.children[i].children[j].append(div);
            }
            if(tbody.children[i].children[j].children[0].classList.contains("clicked")){
                clickedCount++;
            }
        }
    }
    if((HOR*VER - MINE) === clickedCount){
        stopCounter();
        const timerText = document.querySelector("#timerText");
        victoryFlag = true;//승리하면 클릭 안되게
        console.log(Number(timerText.innerText));
        modal.classList.remove("modal_hidden")
        victory_second.innerText = Number(timerText.innerText);
    }
    return clickedCount
}

function handleLeftClick(e){//mouseup
    if(victoryFlag){
        return;
    }
    if(rightClickedContext(e.target.classList)){//오른쪽 클릭 된 ! ? 변화 안되게
        return;
    }
    if(rightClicked){//오른쪽 버튼 누리고 마우스 이벤트 구현 안되게 하기위해서
        mouseDowning = false;
        
        if(stopFlag){
            stopClassListRemove = false;
            return;
        }
        e.target.classList.add("clicked");
    
        tdDivClicked = true; //마우스로 누르고 td범위 나가면 테두리 원상복귀 시키기 위한 flag
        if(stopClassListRemove){
            e.target.classList.remove("tdDivDefaultBorder");
        }
        let row, col;
        
        let idArr = idRowCol(e.target.parentNode.id);
        if(idArr.length === 1){//가끔 div가 비어 있는 버그 해결책
            idArr = idRowCol(e.target.id)
            row = idArr[0];
            col = idArr[1];
        } else {
            row = idArr[0];
            col = idArr[1];
        }
        if(e.target.textContent === ''){
            if(dataset[row][col] === "X"){
            
                
                e.target.classList.add("bombImage");
                stopCounter();//시간 멈춤
                stopFlag = true; //클릭 안되게 함
            } else {
                e.target.textContent = dataset[row][col] === 0 ? '' : dataset[row][col];
                clickZreo(dataset[row][col], row, col);//지뢰 수 0 클릭시 주변 오픈
            }
        }
    }
    victory_btn.addEventListener("click", victoryBtn);
}

function victoryBtn(e){
    execClick();
    modal.classList.add("modal_hidden")
}

let mouseDowning = false; //마우스 누르고 있는중
function tdDivMouseDown(e){//마우스 누를때 테두리 변화
    if(victoryFlag){
        return;
    }
    if(rightClickedContext(e.target.classList)){//오른쪽 클릭 된 ! ? 변화 안되게
        return;
    }
    rightClicked = true;//오른쪽 버튼 누리고 마우스 이벤트 구현 안되게 하기위해서
    mouseDowning = true;
    if(stopFlag){
        return;
    }
    e.target.classList.remove("tdDivDefaultBorder");
   
}

function tdDivMouseOut(e){
    if(victoryFlag){
        return;
    }
    if(rightClickedContext(e.target.classList)){//오른쪽 클릭 된 ! ? 변화 안되게
        return;
    }
    if(stopFlag){
        return;
    }
    if(!e.target.classList.contains("clicked")){
        e.target.classList.add("tdDivDefaultBorder");
    }
    if(tdDivClicked){
        e.target.classList.remove("tdDivDefaultBorder");
    }
    tdDivClicked = false;

}
function tdDivMouseMove(e){
    if(victoryFlag){
        return;
    }
    if(rightClickedContext(e.target.classList)){//오른쪽 클릭 된 ! ? 변화 안되게
        return;
    }
    if(rightClicked){//마우스 오른쪽 누르면 마우스이벤트 구현 안되게 하기 위해서
    if(stopFlag){
        return;
    }
    if(mouseDowning){
        if(e.target.classList.contains("clicked")){
            return;
        }
        e.target.classList.remove("tdDivDefaultBorder");
    }
    }
   
}
//mousedown 클릭의 앞
//mouseout 요소 밖으로 벗어남
//mousemove 마우스 움직임
//mouseup 클릭의 뒤 
function createMineTable(hor, ver){//지뢰찾기 테이블 만들기
    resetData();//데이터셋, 지뢰화면 리셋 다시 실행 할때 아무것도 없게 하기 위해

    for(let i = 0; i < ver; i++){
        let arr = [];
        let tr = document.createElement("tr");//세로 만들기
        for(let j = 0; j < hor; j++){
            arr.push(0);
            let td = document.createElement("td");
            const tdDiv = document.createElement("div");//td 최소크기 설정하기 위해
            
            tdDiv.classList.add("tdDivDefault");
            tdDiv.classList.add("tdDivDefaultBorder");
            tdDiv.addEventListener("contextmenu", handleRightClick);//마우스 오른쪽 클릭시 물음표
            tdDiv.addEventListener("mousedown", tdDivMouseDown);//마우스 누를때 테두리 변화
            tdDiv.addEventListener("mouseout", tdDivMouseOut);//마우스 누르고 박스 밖으로 움직일때
            tdDiv.addEventListener("mousemove", tdDivMouseMove);
            
            td.appendChild(tdDiv);

            // td.addEventListener("contextmenu", handleRightClick);//마우스 오른쪽 클릭시 물음표
            td.addEventListener("mouseup", handleLeftClick);
            
            td.id = i+''+','+j+'';//table에서 td 좌표 알기 위해 id설정
            
            tr.appendChild(td);
        }
        dataset.push(arr);
        tbody.appendChild(tr);
        
    }
    
}

function randomMinesPosition(hor, ver, mine){//지뢰 위치 뽑기
    const minesArr = [];
    
    for(let i =0; i<ver; i++){//세로
        for(let j=0; j<hor; j++){//가로
            minesArr.push(String(i) + ',' + String(j));
        }
    }
    let arrShuffle = [];//배열 섞기
    while(minesArr.length > hor*ver - mine){
        let temp = minesArr.splice(Math.floor(Math.random() * minesArr.length), 1)[0];
        arrShuffle.push(temp);
    }
    return arrShuffle;
}

function countMines(row, col){//지뢰숫자 세기
    for(let i=-1; i<2; i++){
        for(let j=-1; j<2; j++){
            if(row+i >=0 && col+j>=0 && row+i < VER && col+j < HOR){
                if(dataset[row+i][col+j]!=="X"){
                    dataset[row+i][col+j]++;
                }
            }
        }
    }
}

function planingMines(hor, ver, mine){//지뢰심기
    const minesPosition = randomMinesPosition(hor, ver, mine);//지뢰 위치 뽑기
    for(let k = 0; k<minesPosition.length; k++){
        let arr = minesPosition[k].split(',').map(v => Number(v));
        let mineVer = arr[0];
        let mineHor = arr[1];
        dataset[mineVer][mineHor]  = "X";
        
        countMines(mineVer, mineHor);
    }
}
function emotionClickMouseDown(e){
    e.target.classList.add("emotionMouseDown");
}
function emotionClickMouseUp(e){
    e.target.classList.remove("emotionMouseDown");
    e.target.classList.add("emotionDefaultBorder");
    
}
let counter;
let timerCounter;
function stopCounter(){
    clearInterval(timerCounter);
}
function emotionClick(e){
    stopCounter();
    victoryFlag = false;
    execClick();//리셋하기
    
}
function theadAddDiv(){//thead에 깃발수 시간 이모티콘 넣기 위해
    const theadTh = theadTr.children[0];
    const theadThContainer = document.createElement("div");
    const flagDiv = document.createElement("div");
    const flagDivSpan = document.createElement("span");
    const emotionDiv = document.createElement("div");
    const timerDiv = document.createElement("div");
    const timerDivSpan = document.createElement("span");
    timerDiv.append(timerDivSpan);
    timerDivSpan.innerText = "000";
    timerDivSpan.id = "timerText"
    flagDivSpan.id = "flagText";
    flagDiv.append(flagDivSpan);
    flagDivSpan.innerHTML = `${flags < 10 ? `00${flags}` : flags < 100 ? `0${flags}`: flags}`;
    theadThContainer.append(flagDiv, emotionDiv, timerDiv);
    theadTh.append(theadThContainer);

    emotionDiv.classList.add("emotionDefaultBorder");
    emotionDiv.addEventListener("click", emotionClick);//이모티콘 클릭
    emotionDiv.addEventListener("mousedown", emotionClickMouseDown);//이모티콘 마우스로 누를때
    emotionDiv.addEventListener("mouseout", emotionClickMouseUp);

    counter = function(){
        let num = 0;
        timerCounter = setInterval(function(){
            num++;
            timerDivSpan.innerText = `${num < 10 ? `00${num}` : num > 99 ? num : `0${num}`}`;
            
        },1000);
    }

    counter();
    
    
}



// const board = document.querySelector("#game-board");//게임판 크기 고정 시키기 위해서
function execClick(e){//실행 버튼 클릭시
    HOR = parseInt(document.querySelector("#hor").value);//가로
    VER = parseInt(document.querySelector("#ver").value);//세로
    MINE = parseInt(document.querySelector("#mine").value);
    
    game_hidden.style.display = "block";
    head.classList.add("head_hidden");
    theadTr.innerHTML = "<th colspan=" + HOR+ "></th>";
    theadAddDiv();//thead에 깃발수 시간 이모티콘 넣기 위해
    //thead tr 반응형으로 가로 크기 변하게 하기 위해서

    createMineTable(HOR, VER);//지뢰찾기 테이블 만들기
    planingMines(HOR, VER, MINE);//지뢰 심기

}

function init(){
    execBtn.addEventListener("click", execClick);//실행 버튼 클릭시
    // execClick();
}
init();