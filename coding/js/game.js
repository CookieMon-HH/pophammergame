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


function playRound(round, timelimit) {
    randomRSP(playTime);
    playerSelect();
    winnerCalc();
    resultAnimation();
    성공 flag 업데이트    
}


const startGameButton = document.querySelector('.start-game');
startGameButton.addEventListener('click', function() {
    startGame();
});