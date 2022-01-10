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
    playerFlag = !playerFlag;
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
    if (checkScore()) {
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
    let playerWon = false;
    board.forEach(row => {
        let count = 0;
        row.forEach(tile => {
            if (tile.currentValue() === playerValue) {
                count++;
            }
        });
        if (count === 3) {
            playerWon = true;
        }
    })
    return playerWon;
}

const verticalHelper = (playerValue) => {
    let playerWon = false;
    board[0].forEach(col => {
        let [i, j] = col.index();
        let tileOne = board[i][j].currentValue();
        let tileTwo = board[i + 1][j].currentValue();
        let tileThree = board[i + 2][j].currentValue();
        if (tileOne === playerValue && tileTwo === playerValue && tileThree === playerValue) {
            playerWon = true;
        }
    })
    return playerWon;
}

const diagonalHelper = (playerValue) => {
    let playerWon = false;
    let count = 0;
    for (let i = 0; i < 3; i++) {
        if (board[i][i].currentValue() === playerValue) count++;
    }
    if (count === 3) playerWon = true;

    if (!playerWon) {
        let j = 0;
        count = 0;
        for (let i = 2; i >= 0; i--) {
            if (board[i][j].currentValue() === playerValue) count++;
            j++;
        }
        if (count === 3) playerWon = true;
    }

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
    let gameOver = false;
    let horizontalWin = false;
    let verticalWin = false;
    let diagonalWin = false;
    let value = "";
    if (playerFlag) {
        value = "X";
    } else if (!playerFlag) {
        value = "O";
    }
    horizontalWin = horizontalHelper(value);
    verticalWin = verticalHelper(value);
    diagonalWin = diagonalHelper(value);

    if (horizontalWin || verticalWin || diagonalWin) {
        if (playerFlag) {
            playerScore++;
        } else if (!playerFlag) {
            opponentScore++;
        }
        gameOver = true;
    } else if (tieChecker()) {
        tieScore++;
        tieFlag = true;
        gameOver = true;
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

// const startGame = () => {
//     document.querySelector('.start').addEventListener('click', loadGame);
// }

// startGame();
loadGame();