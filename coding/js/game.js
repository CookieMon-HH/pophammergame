// start game -> 스테이지 시작

// 스테이지 동작 
// 1. 스테이지에 맞는 제한 시간 설정 
// 2. 제한시간 안에 가위바위보 애니메이션 진행
// 3. 애니메이션 종료
// 4. 제한 시간 안에 player 1,2 성공 실패 입력
// 5. 성공 / 실패여부 확인
// 6. player1,2 성공 실패 여부에 따라 애니메이션 진행
 
// 스테이지 반복 or 게임 종료 


const handGestureList = ["rock", "scissors", "paper"];
const handGestureImgPath = {"rock": './lib/images/rock.png', "scissors":'./lib/images/scissors.png', "paper":'./lib/images/paper.png'};
const ToolImgPath = {"pophammer": './lib/images/pophammer.png', "yangspot":'./lib/images/yangspot.png', 
                    "pophammerAnimation":'./lib/images/pophammerAnimation.png', "yangspotAnimation":'./lib/images/yangspotAnimation.png'};
const resultImgPath = {"playerCorrect": './lib/images/Correct.png', "playerWrong":'./lib/images/Wrong.png', 
                    "player1Win": './lib/images/player1win.png', "player2Win":'./lib/images/player2win.png'};
let startModal = document.querySelector('.startModal');
let endModal = document.querySelector('.endModal');

function startGame() {
    // start 버튼 제거
    // 성공 flag 및 라운드 초기화
    // round 이길 경우 시간 줄여가면서 반복 재실행

    //이전 게임 애니메이션 리셋 필요
    startModal.style.display = 'none'

    const timelimit = {"now":3000,"next":2700};

    let round = 1;
    let intervalId = null;
    let roundResult = null;

    async function playRoundRepeater(){
        timelimit.now = timelimit.next;
        roundResult = null;
        roundResult = await playRound(round, timelimit.now);
        console.log(roundResult);

        if(roundResult["roundResult"] == "correct_draw" || roundResult["roundResult"] == "wrong_draw"){
            round += 1;
            timelimit.next = 0.95*timelimit.now;
            clearInterval(intervalId);
            intervalId = setInterval(playRoundRepeater, timelimit.now);
        }else{
            gameEnd(roundResult);
            console.log('gameEnd');
            clearInterval(intervalId);
        }
    }

    playRoundRepeater();
    intervalId = setInterval(playRoundRepeater, timelimit.now);

}

function gameEnd(roundResult){
    const game_Result = document.querySelector('.game_Result');
    console.log('game End In / round result :',roundResult["roundResult"]);
    
    // game_Result.style.display = 'block'; 
    endModal.style.display = 'block';

    if (roundResult["roundResult"] == "Player1_win") {
        game_Result.style.backgroundImage = `url(${resultImgPath['player1Win']})`;
    }else if (roundResult["roundResult"] == "Player2_win"){
        game_Result.style.backgroundImage = `url(${resultImgPath['player2Win']})`;
    }else{
        game_Result.style.display = 'none'; 
    }
}

async function playRound(round, timelimit) {
    return new Promise((resolve, reject)=> {
    console.log('round Start :',round,'  timelimit :', timelimit);
    let player1_handGesture = null;
    let player2_handGesture = null;
    let player1_choice = null;
    let player2_choice = null;
    let player1_winButton = document.querySelector('.player1_win');
    let player1_loseButton = document.querySelector('.player1_lose');
    let player2_winButton = document.querySelector('.player2_win');
    let player2_loseButton = document.querySelector('.player2_lose');
    let RockScissorsPaperResult = null;
    let roundResult = null;

    const timeline = {'handDraw': 0.2*timelimit, 'selectEnd': 0.8*timelimit, 'resultAnimation': 0.9*timelimit, 'roundEnd': 0.99*timelimit}

    player1_handGesture = handGestureList[Math.floor(Math.random() * handGestureList.length)];
    player2_handGesture = handGestureList[Math.floor(Math.random() * handGestureList.length)];

    drawHand(player1_handGesture,player2_handGesture,timeline['handDraw'],timeline['roundEnd']);
    RockScissorsPaperResult = RockScissorsPaperJudge(player1_handGesture, player2_handGesture);
    console.log('RockScissorsPaperResult :', RockScissorsPaperResult);

    player1_Select(player1_winButton,player1_loseButton,timeline['selectEnd']).then((result)=> {
        player1_choice = result;
    });
    player2_Select(player2_winButton,player2_loseButton,timeline['selectEnd']).then((result)=>{
        player2_choice = result;
    });
    // console.log('player choice : ', player1_choice, player2_choice);
    setTimeout(async()=> {
        roundResult = resultJudge(RockScissorsPaperResult, player1_choice, player2_choice);
        console.log('player choice : ', player1_choice, player2_choice);
        await resultAnimation(player1_choice, player2_choice, roundResult, timeline['roundEnd']);
        return resolve(roundResult)
    }, timeline['selectEnd'])
    });
}

function drawHand(player1_handGesture, player2_handGesture, drawTime, deleteTime){
    // player 방향에 맞춰 가운데에 drawTime 안에 가위바위보 그림을 그려준다.
    const player1_hand = document.querySelector('.player1_hand');
    const player2_hand = document.querySelector('.player2_hand');

    player1_hand.style.display = 'block'; 
    player1_hand.style.backgroundImage = `url(${handGestureImgPath[player1_handGesture]})`;
    player1_hand.style.transition = `top ${drawTime*0.001}s ease`;
    
    player2_hand.style.display = 'block'; 
    player2_hand.style.backgroundImage = `url(${handGestureImgPath[player2_handGesture]})`;
    player2_hand.style.transition = `top ${drawTime*0.001}s ease`;
    console.log('drawHand');
    
    setTimeout(() => {
        player1_hand.style.top = '20vh';
        player2_hand.style.top = '50vh';
        console.log('moveHand');
    }, Math.min(100,drawTime))

    setTimeout(()=> {
        resetHand();
        console.log('deleteHand',deleteTime);
    },deleteTime)
}

function resetHand(){
    const player1_hand = document.querySelector('.player1_hand');
    const player2_hand = document.querySelector('.player2_hand');

    player1_hand.style.display = 'none'; 
    player1_hand.style.removeProperty('backgroundImage')
    player1_hand.style.removeProperty('transition')
    player1_hand.style.top = '0';

    player2_hand.style.display = 'none'; 
    player2_hand.style.removeProperty('backgroundImage')
    player2_hand.style.removeProperty('transition')
    player2_hand.style.top = '70vh';

    console.log('resetHand');
}


async function player1_Select(winButton,loseButton,selectEndTime){
    // eventlistener를 통해 버튼 동작을 감지하고 누르거나 timelimit이 지나면 버튼을 비활성화 시킨다. 
    // 1. windButton, lose버튼 중 하나라도 누르면 버튼이 비활성화되어야 한다. 
    // 2. 둘 중 하나라도 누르면 해당 버튼에 맞는 값이 리턴 되어야 한다.
    // 3. 버튼을 누르지 않은 경우 endTime에 맞춰 draw 값을 리턴한다.

    // 버튼 활성화 
    winButton.disabled = false;
    loseButton.disabled = false;
    player1Choice = null;

    function winButtonClickHandler(){
        // console.log('win button click');
        winButton.disabled = true;
        winButton.removeEventListener('click',winButtonClickHandler);
        loseButton.disabled = true;
        loseButton.removeEventListener('click',loseButtonClickHandler);
        // clearTimeout(selectEndTimeId);
        player1Choice = "win"
    }

    function loseButtonClickHandler(){
        // console.log('lose button click');
        winButton.disabled = true;
        winButton.removeEventListener('click',winButtonClickHandler);
        loseButton.disabled = true;
        loseButton.removeEventListener('click',loseButtonClickHandler);
        // clearTimeout(selectEndTimeId);
        player1Choice = "lose"
    }

    winButton.addEventListener('click', winButtonClickHandler);
    loseButton.addEventListener('click', loseButtonClickHandler);

    const playerSelectEndAction = new Promise((resolve)=> {
        setTimeout(()=> {
            // removeEventListener
            // 버튼 비활성화 
            winButton.disabled = true;
            winButton.removeEventListener('click',winButtonClickHandler);
            loseButton.disabled = true;
            loseButton.removeEventListener('click',loseButtonClickHandler);
            
            resolve(player1Choice || "draw")
        },selectEndTime);
    });
    
    return await playerSelectEndAction;
}


async function player2_Select(winButton,loseButton,selectEndTime){
    winButton.disabled = false;
    loseButton.disabled = false;
    player2Choice = null;

    function winButtonClickHandler(){
        // console.log('win button click');
        winButton.disabled = true;
        winButton.removeEventListener('click',winButtonClickHandler);
        loseButton.disabled = true;
        loseButton.removeEventListener('click',loseButtonClickHandler);
        // clearTimeout(selectEndTimeId);
        player2Choice = "win"
    }

    function loseButtonClickHandler(){
        // console.log('lose button click');
        winButton.disabled = true;
        winButton.removeEventListener('click',winButtonClickHandler);
        loseButton.disabled = true;
        loseButton.removeEventListener('click',loseButtonClickHandler);
        // clearTimeout(selectEndTimeId);
        player2Choice = "lose"
    }

    winButton.addEventListener('click', winButtonClickHandler);
    loseButton.addEventListener('click', loseButtonClickHandler);

    const playerSelectEndAction = new Promise((resolve)=> {
        setTimeout(()=> {
            // removeEventListener
            // 버튼 비활성화 
            winButton.disabled = true;
            winButton.removeEventListener('click',winButtonClickHandler);
            loseButton.disabled = true;
            loseButton.removeEventListener('click',loseButtonClickHandler);
            
            resolve(player2Choice || "draw")
        },selectEndTime);
    });

    return await playerSelectEndAction;
}

function RockScissorsPaperJudge(player1_handGesture, player2_handGesture){
    if (player1_handGesture === player2_handGesture) {
        return "draw";
    } else if (
        (player1_handGesture === "rock" && player2_handGesture === "scissors") ||
        (player1_handGesture === "scissors" && player2_handGesture === "paper") ||
        (player1_handGesture === "paper" && player2_handGesture === "rock")
    ) {
        return "Player1_win";
    } else {
        return "Player2_win";
    }
}

function resultJudge(RockScissorsPaperResult, player1_choice, player2_choice){
    // RockScissorsPaperResult = ["draw","Player1_win","Player2_win"]
    // player1_choice = ["win","lose","draw"]
    // player2_choice = ["win","lose","draw"]
    // return = ['player1_win', 'player2_win', 'correct_draw', 'wrong_draw']

    // 둘 다 정답인 경우
    // player1만 정답인 경우 
    // player2만 정답인 경우 
    // 둘 다 오답인 경우 => 이어가자

    const roundResult = {"player1_result": null, "player2_result": null, "roundResult": null};
    
    switch(player1_choice) {
        case "win":
            player1_choice = "Player1_win"
            break;
        case "lose":
            player1_choice = "Player2_win"
            break;
        case "draw":
            player1_choice = "draw"
    }

    switch(player2_choice) {
        case "win":
            player2_choice = "Player2_win"
            break;
        case "lose":
            player2_choice = "Player1_win"
            break;
        case "draw":
            player2_choice = "draw"
    }

    if(player1_choice == RockScissorsPaperResult && player2_choice == RockScissorsPaperResult){
        roundResult["player1_result"] = "correct";
        roundResult["player2_result"] = "correct";
        roundResult["roundResult"] = "correct_draw";
        return roundResult
    }else if (player1_choice == RockScissorsPaperResult && player2_choice != RockScissorsPaperResult){
        roundResult["player1_result"] = "correct";
        roundResult["player2_result"] = "wrong";
        roundResult["roundResult"] = "Player1_win";
        return roundResult
    }else if (player1_choice != RockScissorsPaperResult && player2_choice == RockScissorsPaperResult){
        roundResult["player1_result"] = "wrong";
        roundResult["player2_result"] = "correct";
        roundResult["roundResult"] = "Player2_win";
        return roundResult
    } else {
        roundResult["player1_result"] = "wrong";
        roundResult["player2_result"] = "wrong";
        roundResult["roundResult"] = "wrong_draw";
        return roundResult
    }
}

async function resultAnimation(player1_choice, player2_choice, roundResult, deleteTime){
    return new Promise((resolve, reject)=> {
    // 1. 결과를 전달 받는다. 
    // 2. player1의 선택 결과 애니메이션 출력 
    // 3. player2의 선택 결과 애니메이션 출력 
    // 4. player1의 결과 출력 
    // 5. player2의 결과 출력 
    
    // 게임 결과 출력 => 이건 gameEnd에서 하자 

//     const ToolImgPath = {"pophammer": './lib/images/pophammer.png', "yangspot":'./lib/images/yangspot.png', 
// "pophammerAnimation":'./lib/images/pophammerAnimation.png', "yangspotAnimation":'./lib/images/yangspotAnimation.png'};

    const player1_selectResult = document.querySelector('.player1_selectResult');
    const player2_selectResult = document.querySelector('.player2_selectResult');
    const player1_Result = document.querySelector('.player1_Result');
    const player2_Result = document.querySelector('.player2_Result');
    
    player1_selectResult.style.display = 'block'; 
    if (player1_choice == "win") {
        player1_selectResult.style.backgroundImage = `url(${ToolImgPath['pophammerAnimation']})`;
    }else if (player1_choice == "lose"){
        player1_selectResult.style.backgroundImage = `url(${ToolImgPath['yangspotAnimation']})`;
    }else{
        player1_selectResult.style.display = 'none'; 
    }

    player2_selectResult.style.display = 'block'; 
    if (player2_choice == "win") {
        player2_selectResult.style.backgroundImage = `url(${ToolImgPath['pophammerAnimation']})`;
    }else if (player2_choice == "lose"){
        player2_selectResult.style.backgroundImage = `url(${ToolImgPath['yangspotAnimation']})`;
    }else{
        player2_selectResult.style.display = 'none'; 
    }
    
    player1_Result.style.display = 'block'; 
    if(roundResult['player1_result'] == "correct"){
        player1_Result.style.backgroundImage = `url(${resultImgPath['playerCorrect']})`;
    }else if(roundResult['player1_result'] == "wrong"){
        player1_Result.style.backgroundImage = `url(${resultImgPath['playerWrong']})`;
    }else{
        player1_Result.style.display = 'none'; 
    }

    player2_Result.style.display = 'block'; 
    if(roundResult['player2_result'] == 'correct'){
        player2_Result.style.backgroundImage = `url(${resultImgPath['playerCorrect']})`;
    }else if(roundResult['player2_result'] == 'wrong'){
        player2_Result.style.backgroundImage = `url(${resultImgPath['playerWrong']})`;
    }else{
        player2_Result.style.display = 'none'; 
    }
    setTimeout(async()=> {
        resetResultAnimation();
        console.log('resetResultAnimation',deleteTime);
    },deleteTime)

    resolve(true);
    });
}

function resetResultAnimation(){
    const player1_selectResult = document.querySelector('.player1_selectResult');
    const player2_selectResult = document.querySelector('.player2_selectResult');
    const player1_Result = document.querySelector('.player1_Result');
    const player2_Result = document.querySelector('.player2_Result');

    player1_selectResult.style.display = 'none'; 
    player1_selectResult.style.removeProperty('backgroundImage')

    player2_selectResult.style.display = 'none'; 
    player2_selectResult.style.removeProperty('backgroundImage')

    player1_Result.style.display = 'none'; 
    player1_Result.style.removeProperty('backgroundImage')

    player2_Result.style.display = 'none'; 
    player2_Result.style.removeProperty('backgroundImage')

    console.log('resetResultAnimation');
}


const startGameButton = document.querySelector('.start_game');
startGameButton.addEventListener('click', function() {
    startGame();
});