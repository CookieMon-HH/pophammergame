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
    // start 버튼 제거
    // 성공 flag 및 라운드 초기화
    // round 이길 경우 시간 줄여가면서 반복 재실행
    const timelimit = {"now":3000,"next":2700};
    let round = 1;
    let result = playRound(round, timelimit.now);

    if(result){round +=1}

    setInterval(function(){
        timelimit.now = timelimit.next;
        if(result){
            result = playRound(round, timelimit.now);
            round += 1;
            timelimit.next = 0.9*timelimit.now;
        }else{
            gameOver();
            // clearInterval
        }
    }, timelimit.now);

}

function gameOver(){

}

const handGestureList = ["rock", "paper", "scissors"];
const handGestureImgPath = {"rock": './lib/images/rock.png', "paper":'./lib/images/paper.png', "scissors":'./lib/images/scissors.png'};

function playRound(round, timelimit) {
    let player1_handGesture = null;
    let player2_handGesture = null;
    let player1_choice = null;
    let player2_choice = null;

    player1_handGesture = handGestureList[Math.floor(Math.random() * handGestureList.length)];
    player2_handGesture = handGestureList[Math.floor(Math.random() * handGestureList.length)];

    drawHand(player1_handGesture,player2_handGesture,0.2*timelimit);

    playerSelect("player1",timelimit);
    playerSelect("player2",timelimit);

    RockScissorsPaperJudge(player1_handGesture, player2_handGesture);
    resultJudge('temp', player1_choice, player2_choice);

    resultAnimation('temp');
    
    // 임시 코드
    let result = 1;
    return result
}

function drawHand(player1_handGesture, player2_handGesture, drawTime){
    // player 방향에 맞춰 가운데에 drawTime 안에 가위바위보 그림을 그려준다.
    const player1_hand = document.querySelector('.player1_hand');
    const player2_hand = document.querySelector('.player2_hand');

    player1_hand.style.display = 'block'; 
    player1_hand.style.backgroundImage = `url(${handGestureImgPath[player1_handGesture]})`;
    // player1_hand.style.transition = `transform ${drawTime*0.001}s ease`;
    // player1_hand.style.transform = 'rotate(180deg) translateY(200px)';
    player1_hand.style.top = 0;
    setTimeout(() => {
            player1_hand.style.top = '20vh';
        // player1_hand.style.transform = 'rotate(180deg) translateY(800px)';
    }, 400)

    // player1_hand.style.transform = 'translate3d(0, 20vh , 0)';

    player2_hand.style.display = 'block'; 
    player2_hand.style.backgroundImage = `url(${handGestureImgPath[player2_handGesture]})`;

}

function playerSelect(player, timelimit){
    // eventlistener를 통해 버튼 동작을 감지하고 누르거나 timelimit이 지나면 버튼을 비활성화 시킨다. 

    setInterval(function(){
        // removeEventListener
        // 버튼 비활성화 

    },timelimit);
}

function RockScissorsPaperJudge(player1_handGesture, player2_handGesture){

}

function resultJudge(RockScissorsPaperWinner, player1_choice, player2_choice){

}

function resultAnimation(animationType){

}



const startGameButton = document.querySelector('.start-game');
startGameButton.addEventListener('click', function() {
    startGame();
});