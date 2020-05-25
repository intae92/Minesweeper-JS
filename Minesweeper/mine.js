//sprite로 작은 이미지 
//백그라운드 포지션을 sprite로 필요한 부분만 보이게끔
const execBtn = document.querySelector("#exec");
const tbody = document.querySelector("#table > tbody");
let stopFlag = false;
//지뢰찾기 theat tr 반응형으로 가로 크기 변하게 하기 위해서
const table = document.querySelector("table")
const theadTr = table.children[0].children[0];

let HOR, VER, MINE;
let dataset = [];//지뢰찾기 데이터

function resetData(){ //데이터셋, 지뢰화면 리셋
    dataset = [];
    if(tbody.hasChildNodes()){//tbody에 자식노드 있으면 리셋
        tbody.innerHTML = '';
    }
    stopFlag = false;
}
function handleContextMenu(e){//마우스 오른쪽 클릭 물음표
    e.preventDefault();
    if(stopFlag){
        return;
    }
    
    //target, currentTarget 차이?
    //만약에 tbody에 이벤트리스너 달았다면
    //currentTarget 이벤트 리스너가 달린얘 td클릭하면 tbody
    //target 실제 이벤트가 발생한 얘 td클릭하면 td

    // console.dir(e.currentTarget.children.HTMLCollection.item());
    // console.log(e.target)
    // console.log(e.target.parentNode);
    // console.log(e.target.parentNode.parentNode)

    // const idArr = idRowCol(e.target.parentNode.id);
    // const row = idArr[0], col = idArr[1];

    // const row = e.target.id[0], col = e.target.id[1];
    // console.log(e.target)
    if(e.target.textContent === ''){
    // if(e.target.textContent === '' || e.target.textContent === "X"){
        e.target.textContent = "!"
    } else if(e.target.textContent === "!"){
        e.target.textContent = "?"
    } else if(e.target.textContent === "?"){
        e.target.textContent = "";
        // if(dataset[row][col] !== "X"){
        //     e.target.textContent = "";
        // } else {
        //     e.target.textContent = "X";
        // }
    }
}
function clickZreo(zero, row, col){//지뢰 수 0 클릭시 주변 오픈
    if(zero === 0){
        // tbody.childNodes[row-1].childNodes[col-1].textContent = dataset[row-1][col-1];
        // tbody.childNodes[row-1].childNodes[col].textContent = dataset[row-1][col];
        // tbody.childNodes[row-1].childNodes[col+1].textContent = dataset[row-1][col+1];
        // tbody.childNodes[row].childNodes[col-1].textContent = dataset[row][col-1];
        // // tbody.childNodes[row].childNodes[col].textContent = dataset[row][col];
        // tbody.childNodes[row].childNodes[col+1].textContent = dataset[row][col+1];
        // tbody.childNodes[row+1].childNodes[col-1].textContent = dataset[row+1][col-1];
        // tbody.childNodes[row+1].childNodes[col].textContent = dataset[row+1][col];
        // tbody.childNodes[row+1].childNodes[col+1].textContent = dataset[row+1][col+1];
        
        for(let i=-1; i<2; i++){
            for(let j=-1; j<2; j++){
                if(row+i >=0 && col+j>=0 && row+i < VER && col+j < HOR){
                    if(tbody.childNodes[row+i].childNodes[col+j].textContent === ''){
                        tbody.childNodes[row+i].childNodes[col+j].textContent = dataset[row+i][col+j];
                        if(dataset[row+i][col+j] === 0){
                            
                            clickZreo(dataset[row+i][col+j], row+i, col+j);
                        }
                    }
                    
                }
                // if(row+i >=0 && col+j>=0 && row+i < VER && col+j < HOR){
                //     if(dataset[row+i][col+j]!=="X"){
                //         dataset[row+i][col+j]++;
                //         // console.log(dataset[row+i][col+j]);
                //     }
                // }
            }
        }
    }
}
function idRowCol(strId){//문자열형태의 id를 원하는 형태, 숫자인 row와 col로 바꿈
    return strId.split(',').map(v => Number(v));
}
function handleClick(e){
    // e.preventDefault();
    if(stopFlag){
        return;
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


    // const row = Number(e.target.id[0]), col = Number(e.target.id[1]);
    // console.dir(e.target.parentNode)
    // console.log(typeof(row), col)
    // console.log(dataset)

    if(e.target.textContent === ''){
        if(dataset[row][col] === "X"){
        
            e.target.textContent = '펑';
            stopFlag = true; //클릭 안되게 함
        } else {
            // console.log(dataset)
            // console.log(typeof(dataset[row][col]))
            e.target.textContent = dataset[row][col];
            // const r = e.target.parentNode.parentNode.childNodes;
            // const c = e.target.parentNode.childNodes;
            
            // console.log(tbody.childNodes[row-1].childNodes[col-1]);
            // e.target.parentNode.parentNode.childNodes[row-1].childNodes[col-1].textContent = dataset[row-1][col-1];
            // console.log(e.target.parentNode.parentNode.childNodes[row-1].childNodes[col-1]);
            // console.log(e.target.parentNode.parentNode.childNodes[row-1].childNodes[col]);
            // console.log(e.target.parentNode.parentNode.childNodes[row-1].childNodes[col+1]);
            // console.log(e.target.parentNode.parentNode.childNodes[row].childNodes[col-1]);
            // console.log(e.target.parentNode.parentNode.childNodes[row].childNodes[col]);
            // console.log(e.target.parentNode.parentNode.childNodes[row].childNodes[col+1]);
            // console.log(e.target.parentNode.parentNode.childNodes[row+1].childNodes[col-1]);
            // console.log(e.target.parentNode.parentNode.childNodes[row+1].childNodes[col]);
            // console.log(e.target.parentNode.parentNode.childNodes[row+1].childNodes[col+1]);
           
            // tbody.childNodes[row-1].childNodes[col-1].textContent = dataset[row-1][col-1];
            // tbody.childNodes[row-1].childNodes[col].textContent = dataset[row-1][col];
            // tbody.childNodes[row-1].childNodes[col+1].textContent = dataset[row-1][col+1];
            // tbody.childNodes[row].childNodes[col-1].textContent = dataset[row][col-1];
            // // tbody.childNodes[row].childNodes[col].textContent = dataset[row][col];
            // tbody.childNodes[row].childNodes[col+1].textContent = dataset[row][col+1];
            // tbody.childNodes[row+1].childNodes[col-1].textContent = dataset[row+1][col-1];
            // tbody.childNodes[row+1].childNodes[col].textContent = dataset[row+1][col];
            // tbody.childNodes[row+1].childNodes[col+1].textContent = dataset[row+1][col+1];
    
            clickZreo(dataset[row][col], row, col);//지뢰 수 0 클릭시 주변 오픈
        }
        // console.log(dataset)
    }
    
}

function createMineTable(hor, ver){//지뢰찾기 테이블 만들기
    resetData();//데이터셋, 지뢰화면 리셋 다시 실행 할때 아무것도 없게 하기 위해

    for(let i = 0; i < ver; i++){
        let arr = [];
        let tr = document.createElement("tr");//세로 만들기
        for(let j = 0; j < hor; j++){
            arr.push(0);
            let td = document.createElement("td");
            const tdDiv = document.createElement("div");//td 최소크기 설정하기 위해
            tdDiv.id = "tdDiv";
            td.appendChild(tdDiv);

            td.addEventListener("contextmenu", handleContextMenu);//마우스 오른쪽 클릭시 물음표
            td.addEventListener("click", handleClick);

            td.id = i+''+','+j+'';//table에서 td 좌표 알기 위해 id설정
            
            tr.appendChild(td);
            // td.textContent = 1;
        }
        dataset.push(arr);
        tbody.appendChild(tr);
        
    }
    // console.log(tbody);
    
}

function randomMinesPosition(hor, ver, mine){//지뢰 위치 뽑기
    // const minesArr = Array(hor*ver).fill(null).map((v, idx) => {
    //     return idx;
    // });
    const minesArr = [];
    
    for(let i =0; i<ver; i++){//세로
        for(let j=0; j<hor; j++){//가로
            // minesArr.push(Number(String(i)+String(j)));
            minesArr.push(String(i) + ',' + String(j));
        }
    }
    // console.log(minesArr)
    let arrShuffle = [];//배열 섞기
    while(minesArr.length > hor*ver - mine){
        let temp = minesArr.splice(Math.floor(Math.random() * minesArr.length), 1)[0];
        // console.log(temp)
        arrShuffle.push(temp);
    }
    
    // console.log(arrShuffle)
    return arrShuffle;
}

function countMines(row, col){//지뢰숫자 세기
    // console.log(HOR, VER)
    // console.log(row, col)
    for(let i=-1; i<2; i++){
        for(let j=-1; j<2; j++){
            // console.log(row, col)
            if(row+i >=0 && col+j>=0 && row+i < VER && col+j < HOR){
                if(dataset[row+i][col+j]!=="X"){
                    dataset[row+i][col+j]++;
                    // console.log(dataset[row+i][col+j]);
                }
            }
        }
    }
    // console.log(dataset)
    // let count = [
    // dataset[row-1][col-1], dataset[row-1][col], dataset[row-1][col+1],
    // dataset[row][col-1], dataset[row][col], dataset[row][col+1],
    // dataset[row+1][col-1], dataset[row+1][col], dataset[row+1][col+1]
    // ]
}

function planingMines(hor, ver, mine){//지뢰심기
    const minesPosition = randomMinesPosition(hor, ver, mine);//지뢰 위치 뽑기
    for(let k = 0; k<minesPosition.length; k++){
        let arr = minesPosition[k].split(',').map(v => Number(v));
        // let mineVer = Math.floor(minesPosition[k] / 10);//세로
        let mineVer = arr[0];
        let mineHor = arr[1];
        
        // let mineHor = minesPosition[k] % 10;//가로
        // tbody.childNodes[mineVer].childNodes[mineHor].textContent = "X";
        // tbody.children[mineVer].children[mineHor].textContent = "X";
        // tbody.children[mineVer].children[mineHor].textContent = mineVer+''+mineHor+'';
        dataset[mineVer][mineHor]  = "X";
        
        countMines(mineVer, mineHor);
    }
}
function theadAddDiv(){//thead에 깃발수 시간 이모티콘 넣기 위해
    console.dir(theadTr)
    const theadTh = theadTr.children[0];
    console.log(theadTh);
    console.dir(theadTh);
    const theadThContainer = document.createElement("div");
    const flagDiv = document.createElement("div");
    const emotionDiv = document.createElement("div");
    const timerDiv = document.createElement("div");
    theadThContainer.append(flagDiv, emotionDiv, timerDiv);
    theadTh.append(theadThContainer);

}

function execClick(e){//실행 버튼 클릭시
    // e.preventDefault();
    // HOR = parseInt(document.querySelector("#hor").value);//가로
    // VER = parseInt(document.querySelector("#ver").value);//세로
    // MINE = parseInt(document.querySelector("#mine").value);
    
    HOR = 10;
    VER = 10;
    MINE = 20;
    // theadTr.innerHTML = "<th colspan=" + `${HOR}`+ "></th>";
    theadTr.innerHTML = "<th colspan=" + HOR+ "></th>";
    theadAddDiv();//thead에 깃발수 시간 이모티콘 넣기 위해
    //thead tr 반응형으로 가로 크기 변하게 하기 위해서

    createMineTable(HOR, VER);//지뢰찾기 테이블 만들기
    planingMines(HOR, VER, MINE);//지뢰 심기

}


// function paintImage(imgNumber){
//     const image = new Image();
//     image.src = `../assets/images/bg${imgNumber + 1}.jpg`;
//     image.classList.add("bgImage");
//     body.prepend(image);
// }

function init(){
    // execBtn.addEventListener("click", execClick);//실행 버튼 클릭시
    execClick();
    
}
init();