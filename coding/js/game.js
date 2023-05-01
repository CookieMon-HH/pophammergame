// start game -> 스테이지 시작

// 스테이지 동작 
// 1. 스테이지에 맞는 제한 시간 설정 
// 2. 제한시간 안에 가위바위보 애니메이션 진행
// 3. 애니메이션 종료
// 4. 제한 시간 안에 player 1,2 성공 실패 입력
// 5. 성공 / 실패여부 확인
// 6. player1,2 성공 실패 여부에 따라 애니메이션 진행
 
// 스테이지 반복 or 게임 종료 


function startGame() {
    start 버튼 제거
    성공 flag 및 라운드 초기화

    setInterval(startGame, 5000);

    if(성공 flag) {
        playRound(round, stagetimelimit);
    }
}

const handGestureList = ["rock", "paper", "scissors"];


function playRound(round, timelimit) {
    let player1_handGesture = null;
    let player2_handGesture = null;

    player1_handGesture = handGestureList[Math.floor(Math.random() * options.length)];
    player2_handGesture = handGestureList[Math.floor(Math.random() * options.length)];

    drawHand(player1_handGesture,player2_handGesture,0.2*timelimit);

    playerSelect("player1",timelimit);
    playerSelect("player2",timelimit);

    playerSelect();
    winnerCalc();
    resultAnimation();
    성공 flag 업데이트    
}

function drawHand(player1_handGesture, player2_handGesture, drawTime){
    // player 방향에 맞춰 가운데에 drawTime 안에 가위바위보 그림을 그려준다.
}

function playerSelect(player, timelimit){
    // eventlistener를 통해 버튼 동작을 감지하고 누르거나 timelimit이 지나면 버튼을 비활성화 시킨다. 

    setInterval(function(){
        // removeEventListener
        // 버튼 비활성화 

    },timelimit);
}



const startGameButton = document.querySelector('.start-game');
startGameButton.addEventListener('click', function() {
    startGame();
});