const gameboard = (function (){
    let board = [];

    let clearBoard = function(){
        board=[];
        for(let i=0; i<9;i++){
            board.push("");
        }
    }

    // Populate the board
    clearBoard(); 
   

    let getBoard = function(){
        return board;
    }

    // This function fills the square on the board. It needs the position where the move will be inserted, in case the position is already
    // taken returns false otherwhise if the move was successfull returns true.
    let fillSquare = function(position,move){
        if(board[position]!="") return false;

        board.splice(position,1,move);
        printBoard();

        return true;
    }

    


    let printBoard = function(){
        let boardText = "";
        let char = "";
        let separator = "";

        for(let i=0;i<board.length;i++){

            char = (board[i]!="") ? board[i]:" ";
            // we start index at 1 because 0%3==0
            separator = ( (i+1) %3==0)? "\n":"|"; 

            boardText = boardText + char + separator;
        }

        console.log(boardText);
    }

    return { getBoard,fillSquare,clearBoard }
})();

function Player(name="defaultPlayer",char){
    let playerName = name;
    let playerChar = char;

    const getName = function(){
        return playerName;
    }

    const getPlayerChar = function(){
        return playerChar;
    }

    const changePlayerChar = function(newChar){
        playerChar = newChar;
    }

    return {getName,getPlayerChar,changePlayerChar};
}

const gameController = (function(){
    const players = [new Player("player1","o"),new Player("player2","x")];
    let turn = 1;
    let playerTurn = players[0];

    // This variable has three possible states 
    // -1 -> no winner
    //  0 -> draw
    //  1 -> winner
    let boardState = 0;

    const returnPlayers = function(){
        return  {player1:players[0],player2:players[1]};
    }
    const switchTurn = ()=> playerTurn= (playerTurn==players[0])? players[1]: players[0];

    const getplayerTurn = function(){
        return playerTurn.getPlayerChar();
    }

    // 0 1 2 
    // 3 4 5 
    // 6 7 8 

    // i*3 + j check by rows 
    // j*3 + i check by column

    function checkWinner(){
        const boardArray = gameboard.getBoard();
        for(let i=0; i < 3; i++){
            // check by row 
            if( (boardArray[(i*3+ 0)] == boardArray[(i*3+ 1)]) && (boardArray[(i*3+ 1)] == boardArray[(i*3+ 2)]) && boardArray[(i*3+ 0)]!="" ){
                return 1;
            }

            // check by column
            if( (boardArray[i] == boardArray[i + 3]) && (boardArray[i + 3]== boardArray[i+6]) && boardArray[(i)]!=""){
                return 1;
            }

        }


        // check by diagonal 
        if( (boardArray[0] == boardArray[4]) && (boardArray[4]== boardArray[8]) && boardArray[0]!=""){
            return 1;
        }

        if( (boardArray[6] == boardArray[4]) && (boardArray[4]== boardArray[2]) && boardArray[6]!=""){
            return 1;
        }


        // Draw if array is full
        if( !boardArray.includes("") ) return -1;

        // game continues
        return 0;

    }


    const playRound = function(position){

        gameboard.fillSquare(position,playerTurn.getPlayerChar());
        switchTurn();

        turn++;
        if(turn >= 5){
            // Check for winner
            boardState = checkWinner();
        }

        return boardState;

    }


    const resetGame =  function(){
        gameboard.clearBoard();
        turn=1;
        playerTurn = players[0];
        boardState=0;
    }


    
    return {returnPlayers,playRound,getplayerTurn,resetGame}
})();


const displayController = (function(){
    const gameboard = document.getElementsByClassName("gameboard")[0];
    let gameState = 0;

    const displayGrid = function(){
        
        for(let i=0;i<9;i++){
            let box = document.createElement("div");
            box.classList.add("box");
            box.dataset.position = i;
            gameboard.appendChild(box);  
        }
        
    }

    const addPiece = function(position,piece){
        let box = document.getElementsByClassName("box")[position];
        let type = piece=="x"? "cross":"circle";
        box.classList.add(type);
    }

    const clearBoard = function(){
        let boxes =document.getElementsByClassName("box"); 
        for(let i=0;i<boxes.length;i++){
            boxes[i].classList.remove("cross","circle");
        }
    }

    const displayTurn = function(player){
        const container = document.querySelector(".player-turn span");
        container.textContent = player;
    }

    const attachClicks = function(){
        let boxes =document.getElementsByClassName("box"); 
        let reset = document.getElementById("reset_btn");


        // attach reset click
        reset.addEventListener("click",resetGame);

        // Attach grid clicks
        for(let i=0;i<boxes.length;i++){
            boxes[i].addEventListener("click",playRound);
        }

    }

    const playRound = function(event){
        let box = event.srcElement;
        let position =box.dataset.position; 

        if(box.classList.contains("cross","circle") | gameState!=0 ) return;

        addPiece(position,gameController.getplayerTurn());
        gameState = gameController.playRound(position);
        displayTurn(gameController.getplayerTurn());

        if(gameState==1)console.log("We have a winner")
        
    }

    const resetGame = function(){
        clearBoard();
        gameController.resetGame();
        gameState=0;
    }

    return {displayGrid,addPiece,displayTurn,attachClicks}


})();

displayController.displayGrid();
displayController.attachClicks();