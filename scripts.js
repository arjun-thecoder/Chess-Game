const board = document.getElementById('board');
let selectedPiece = null;
let boardState = [
    ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
    ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
    ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R']
];

const pieces = {
    'r': '♜', 'n': '♞', 'b': '♝', 'q': '♛', 'k': '♚', 'p': '♟',
    'R': '♖', 'N': '♘', 'B': '♗', 'Q': '♕', 'K': '♔', 'P': '♙'
};

function renderBoard() {
    board.innerHTML = '';
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            const square = document.createElement('div');
            square.classList.add('square', (i + j) % 2 === 0 ? 'white' : 'black');
            square.dataset.row = i;
            square.dataset.col = j;
            if (boardState[i][j]) {
                const piece = document.createElement('span');
                piece.innerHTML = pieces[boardState[i][j]];
                piece.classList.add('piece');
                piece.dataset.piece = boardState[i][j];
                square.appendChild(piece);
            }
            square.addEventListener('click', () => selectPiece(i, j));
            board.appendChild(square);
        }
    }
}

function selectPiece(row, col) {
    const piece = boardState[row][col];
    if (selectedPiece) {
        movePiece(row, col);
    } else if (piece) {
        selectedPiece = { row, col, piece };
        highlightMoves(row, col);
    }
}

function movePiece(row, col) {
    const { row: fromRow, col: fromCol, piece } = selectedPiece;
    if (isValidMove(fromRow, fromCol, row, col)) {
        const fromSquare = document.querySelector(`[data-row="${fromRow}"][data-col="${fromCol}"] .piece`);
        fromSquare.style.animation = 'pieceMove 0.3s';
        setTimeout(() => {
            boardState[row][col] = piece;
            boardState[fromRow][fromCol] = '';
            selectedPiece = null;
            renderBoard();
        }, 300);
    } else {
        selectedPiece = null;
        clearHighlights();
    }
}

function isValidMove(fromRow, fromCol, toRow, toCol) {
    const piece = boardState[fromRow][fromCol].toLowerCase();
    const isWhiteTurn = piece === boardState[fromRow][fromCol];

    // Check if the move is within board limits
    if (toRow < 0 || toRow > 7 || toCol < 0 || toCol > 7) {
        return false;
    }

    // Check if the target square has own piece
    if (boardState[toRow][toCol] && isWhiteTurn === (boardState[toRow][toCol] === boardState[toRow][toCol].toLowerCase())) {
        return false;
    }

    // Check specific piece rules
    switch (piece) {
        case 'p':
            // Pawn moves one square forward
            if (fromCol === toCol && Math.abs(fromRow - toRow) === 1 && !boardState[toRow][toCol]) {
                return true;
            }
            // Pawn captures diagonally
            if (Math.abs(fromCol - toCol) === 1 && fromRow - toRow === 1 && boardState[toRow][toCol]) {
                return true;
            }
            // Pawn initial double move
            if (fromCol === toCol && fromRow - toRow === 2 && fromRow === 6 && !boardState[toRow][toCol]) {
                return true;
            }
            break;
        case 'r':
        case 'R':
            // Rook moves vertically or horizontally
            if (fromRow === toRow || fromCol === toCol) {
                return true;
            }
            break;
        case 'n':
        case 'N':
            // Knight moves in L shape
            if ((Math.abs(fromRow - toRow) === 2 && Math.abs(fromCol - toCol) === 1) ||
                (Math.abs(fromRow - toRow) === 1 && Math.abs(fromCol - toCol) === 2)) {
                return true;
            }
            break;
        case 'b':
        case 'B':
            // Bishop moves diagonally
            if (Math.abs(fromRow - toRow) === Math.abs(fromCol - toCol)) {
                return true;
            }
            break;
        case 'q':
        case 'Q':
            // Queen moves vertically, horizontally, or diagonally
            if (fromRow === toRow || fromCol === toCol || Math.abs(fromRow - toRow) === Math.abs(fromCol - toCol)) {
                return true;
            }
            break;
        case 'k':
        case 'K':
            // King moves one square in any direction
            if (Math.abs(fromRow - toRow) <= 1 && Math.abs(fromCol - toCol) <= 1) {
                return true;
            }
            break;
        default:
            return false;
    }
    return false;
}

function highlightMoves(row, col) {
    clearHighlights();
    const validMoves = getValidMoves(row, col);
    validMoves.forEach(([r, c]) => {
        document.querySelector(`[data-row="${r}"][data-col="${c}"]`).classList.add('highlight');
    });
}

function getValidMoves(row, col) {
    const piece = boardState[row][col];
    const validMoves = [];

    // Loop through all squares to check valid moves
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            if (isValidMove(row, col, r, c)) {
                validMoves.push([r, c]);
            }
        }
    }

    return validMoves;
}

function clearHighlights() {
    document.querySelectorAll('.highlight').forEach(square => {
        square.classList.remove('highlight');
    });
}

renderBoard();
