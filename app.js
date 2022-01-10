class Tile {
    constructor(i, j) {
        this.value = "";
        this.i = i;
        this.j = j;
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
}

let playerFlag = true;
let board = [
    [],
    [],
    []
];
let playerScore = 0;
let opponentScore = 0;

const switchPlayer = () => {
    playerFlag = !playerFlag;
}

const selectTile = (event) => {
    let clickedTile = event.target;
    if (playerFlag === true) {
        clickedTile.model.setValue("X");
        clickedTile.innerText = "X";
        clickedTile['id'] = "tile-cross"
    } else if (playerFlag === false) {
        clickedTile.model.setValue("O")
        clickedTile.innerText = "O";
        clickedTile['id'] = "tile-circle"
    }
    clickedTile.removeEventListener('click', selectTile);
    checkScore();
    switchPlayer();
}

const resetGame = () => {
    board = [
        [],
        [],
        []
    ];

    playerFlag = true;

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

const checkScore = () => {
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
        if (playerFlag === true) {
            playerScore++;
        } else if (playerFlag === false) {
            opponentScore++;
        }
        console.log(playerScore, opponentScore);
        resetGame();
    }
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