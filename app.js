class Tile {
    constructor(i, j) {
        this.value = "";
        this.i = i;
        this.j = j;
        this.clicked = false;
    }

    setValue(value) {
        this.value = value;
    }

    index() {
        return [this.i, this.j];
    }

    currentValue() {
        return this.value;
    }

    selectTile() {
        this.clicked = true;
    }

    isSelected() {
        return this.clicked;
    }
}

let playerFlag = true;
let tieFlag = false;
let board = [
    [],
    [],
    []
];
let playerScore = 0;
let opponentScore = 0;
let tieScore = 0;

const switchPlayer = () => {
    let turnLabel = document.querySelector('.turn-label');
    playerFlag = !playerFlag;
    if (playerFlag) {
        turnLabel.innerText = "X";
    } else if (!playerFlag) {
        turnLabel.innerText = "O";
    }
}

const removeBanner = () => {
    if (tieFlag) {
        document.querySelector('.tie-banner-container').style.display = "none";
    } else {
        if (playerFlag) {
            document.querySelector('.cross-banner-container').style.display = "none";
        } else if (!playerFlag) {
            document.querySelector('.circle-banner-container').style.display = "none";
        }
    }
    resetGame();
}

const quitHandler = (event) => {
    playerScore = 0;
    opponentScore = 0;
    tieScore = 0;
    updateScoreHandler();
    event.target.removeEventListener('click', quitHandler);
    removeBanner();
}

const continueHandler = (event) => {
    event.target.removeEventListener('click', continueHandler);
    removeBanner();
}

const loadBanner = () => {
    if (tieFlag) {
        document.querySelector('.tie-banner-container').style.display = "block";
        document.querySelectorAll('.quit-btn')[2].addEventListener('click', quitHandler);
        document.querySelectorAll('.continue-btn')[2].addEventListener('click', continueHandler);
    } else {
        if (playerFlag) {
            document.querySelector('.cross-banner-container').style.display = "block";
            document.querySelectorAll('.quit-btn')[0].addEventListener('click', quitHandler);
            document.querySelectorAll('.continue-btn')[0].addEventListener('click', continueHandler);
        } else if (!playerFlag) {
            document.querySelector('.circle-banner-container').style.display = "block";
            document.querySelectorAll('.quit-btn')[1].addEventListener('click', quitHandler);
            document.querySelectorAll('.continue-btn')[1].addEventListener('click', continueHandler);
        }
    }
}

const endGameEffectsHandler = (winningIndexes) => {
    let gameTiles = document.querySelectorAll('.game-tile');
    if (tieFlag) {
        gameTiles.forEach(tile => {
            tile.id = "tile-tie"
        })
    } else {
        let winningID = ""
        if (playerFlag) {
            winningID = "tile-cross__win"
        } else if (!playerFlag) {
            winningID = "tile-circle__win"
        }
        console.log(winningIndexes);
        gameTiles.forEach(tile => {
            let currentIndex = tile.model.index();
            winningIndexes.forEach(i => {
                if (currentIndex[0] === i[0] && currentIndex[1] === i[1]) {
                    tile.id = winningID;
                }
            })
        })
    }
}

const selectTile = (event) => {
    let clickedTile = event.target;
    if (playerFlag) {
        clickedTile.model.setValue("X");
        clickedTile.innerText = "X";
        clickedTile['id'] = "tile-cross"
    } else if (!playerFlag) {
        clickedTile.model.setValue("O")
        clickedTile.innerText = "O";
        clickedTile['id'] = "tile-circle"
    }
    clickedTile.model.selectTile();
    clickedTile.removeEventListener('click', selectTile);
    let gameStatus = checkScore();
    if (gameStatus[0]) {
        endGameEffectsHandler(gameStatus[1]);
        loadBanner();
    } else {
        switchPlayer();
    }
}

const resetGame = () => {
    board = [
        [],
        [],
        []
    ];

    playerFlag = true;
    tieFlag = false;

    let tiles = document.querySelectorAll('.game-tile');
    tiles.forEach(tile => {
        tile.id = "";
        tile.innerText = "";
        tile.model = "";
    })
    loadGame();
}

const horizontalHelper = (playerValue) => {
    let playerWon = [false, []];
    let winningIndexes = [];
    board.forEach(row => {
        let count = 0;
        row.forEach(tile => {
            if (!playerWon[0]) winningIndexes.push(tile.index());
            if (tile.currentValue() === playerValue) {
                count++;
            }
        });
        if (count === 3) playerWon[0] = true;
        if (!playerWon[0]) winningIndexes.length = 0;
    })
    playerWon[1].push(...winningIndexes);
    return playerWon;
}

const verticalHelper = (playerValue) => {
    let playerWon = [false, []];
    let winningIndexes = [];
    board[0].forEach(col => {
        let [i, j] = col.index();
        let tileOne = board[i][j].currentValue();
        let tileTwo = board[i + 1][j].currentValue();
        let tileThree = board[i + 2][j].currentValue();
        let indexes = [[i, j], [i + 1, j], [i + 2, j]];
        if (tileOne === playerValue && tileTwo === playerValue && tileThree === playerValue) {
            playerWon[0] = true;
            winningIndexes.push(...indexes);
        }
        if (!playerWon[0]) winningIndexes.length = 0;
    })
    playerWon[1].push(...winningIndexes);
    return playerWon;
}

const diagonalHelper = (playerValue) => {
    let playerWon = [false, []];
    let winningIndexes = [];
    let count = 0;
    for (let i = 0; i < 3; i++) {
        winningIndexes.push([i, i]);
        if (board[i][i].currentValue() === playerValue) count++;
    }
    if (count === 3) { 
        playerWon[0] = true;
    } else {
        winningIndexes.length = 0;
    }

    if (!playerWon[0]) {
        let j = 0;
        count = 0;
        for (let i = 2; i >= 0; i--) {
            winningIndexes.push([i, j]);
            if (board[i][j].currentValue() === playerValue) count++;
            j++;
        }
        if (count === 3) { 
            playerWon[0] = true;
        } else {
            winningIndexes.length = 0;
        }
    }
    playerWon[1].push(...winningIndexes);
    return playerWon;
}

const updateScoreHandler = () => {
    document.querySelector('#player-num').innerText = `${playerScore}`;
    document.querySelector('#opponent-num').innerText = `${opponentScore}`;
    document.querySelector('#tie-num').innerText = `${tieScore}`;
}

const tieChecker = () => {
    let isTie = true;
    board.forEach(col => {
        col.forEach(tile => {
            if (!tile.isSelected()) isTie = false;
        })
    })
    return isTie;
}

const checkScore = () => {
    let gameOver = [false, []];
    let horizontalWin = false;
    let verticalWin = false;
    let diagonalWin = false;
    let value = "";
    if (playerFlag) {
        value = "X";
    } else if (!playerFlag) {
        value = "O";
    }
    let horizontalResult = horizontalHelper(value);
    horizontalWin = horizontalResult[0];

    let verticalResult = verticalHelper(value);
    verticalWin = verticalResult[0];

    let diagonalResult = diagonalHelper(value);
    diagonalWin = diagonalResult[0];

    if (horizontalWin || verticalWin || diagonalWin) {
        if (playerFlag) {
            playerScore++;
        } else if (!playerFlag) {
            opponentScore++;
        }
        gameOver[0] = true;
        if (horizontalWin) {
            gameOver[1].push(...horizontalResult[1]);
        } else if (verticalWin) {
            gameOver[1].push(...verticalResult[1]);
        } else if (diagonalWin) {
            gameOver[1].push(...diagonalResult[1]);
        }
    } else if (tieChecker()) {
        tieScore++;
        tieFlag = true;
        gameOver[0] = true;
    }
    updateScoreHandler();
    return gameOver;
}

const loadGame = () => {
    document.querySelector('.reset').addEventListener('click', resetGame);

    let i = 0;
    let j = 0;

    document.querySelectorAll('.game-tile').forEach(tile => {
        if (j >= 3) {
            i++;
            j = 0;
        }
        let newTile = new Tile(i, j, tile);
        board[i].push(newTile);
        tile['model'] = newTile;
        tile.addEventListener('click', selectTile);
        j++;
    })
}

loadGame();