document.addEventListener('DOMContentLoaded', () => {
    const boardEl = document.getElementById('board');
    const gameInfoEl = document.getElementById('game-info');
    const resetButton = document.getElementById('reset-button');
    const winMessageEl = document.getElementById('win-message');
    
    const ROWS = 6;
    const COLS = 7;
    const EMPTY = 0;
    const PLAYER1 = 1;
    const PLAYER2 = 2;
    
    let currentPlayer = PLAYER1;
    let gameOver = false;
    let board = [];
    
    function initializeGame() {
        // Inicializar tablero vacío
        board = Array(ROWS).fill().map(() => Array(COLS).fill(EMPTY));
        currentPlayer = PLAYER1;
        gameOver = false;
        
        // Limpiar el tablero HTML
        boardEl.innerHTML = '';
        winMessageEl.innerHTML = '';
        winMessageEl.className = '';
        
        // Actualizar información del juego
        updateGameInfo();
        
        // Crear columnas y celdas
        for (let col = 0; col < COLS; col++) {
            const columnEl = document.createElement('div');
            columnEl.className = 'column';
            columnEl.dataset.col = col;
            
            columnEl.addEventListener('click', () => {
                if (!gameOver) {
                    const row = dropPiece(col);
                    if (row !== -1) {
                        updateBoard();
                        
                        if (checkWin(row, col)) {
                            gameOver = true;
                            displayWinner();
                        } else if (checkDraw()) {
                            gameOver = true;
                            displayDraw();
                        } else {
                            // Cambiar turno
                            currentPlayer = currentPlayer === PLAYER1 ? PLAYER2 : PLAYER1;
                            updateGameInfo();
                        }
                    }
                }
            });
            
            for (let row = 0; row < ROWS; row++) {
                const cellEl = document.createElement('div');
                cellEl.className = 'cell';
                cellEl.dataset.row = ROWS - 1 - row; // Invertir filas para que visualmente caigan desde abajo
                cellEl.dataset.col = col;
                
                columnEl.appendChild(cellEl);
            }
            
            boardEl.appendChild(columnEl);
        }
    }
    
    function updateGameInfo() {
        if (currentPlayer === PLAYER1) {
            gameInfoEl.textContent = 'Turno del Jugador 1 (Rojo)';
        } else {
            gameInfoEl.textContent = 'Turno del Jugador 2 (Amarillo)';
        }
    }
    
    function dropPiece(col) {
        // Encontrar la primera fila disponible desde abajo
        for (let row = 0; row < ROWS; row++) {
            if (board[row][col] === EMPTY) {
                board[row][col] = currentPlayer;
                return row;
            }
        }
        return -1; // Columna llena
    }
    
    function updateBoard() {
        for (let row = 0; row < ROWS; row++) {
            for (let col = 0; col < COLS; col++) {
                const cellEl = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
                
                if (board[row][col] === PLAYER1) {
                    cellEl.classList.add('player1');
                } else if (board[row][col] === PLAYER2) {
                    cellEl.classList.add('player2');
                }
            }
        }
    }
    
    function checkWin(row, col) {
        const directions = [
            [0, 1],   // horizontal
            [1, 0],   // vertical
            [1, 1],   // diagonal /
            [1, -1]   // diagonal \
        ];
        
        for (const [dx, dy] of directions) {
            let count = 1;  // La ficha que acabamos de colocar
            
            // Comprobamos en ambas direcciones
            for (const factor of [1, -1]) {
                const newDx = dx * factor;
                const newDy = dy * factor;
                
                let r = row + newDx;
                let c = col + newDy;
                
                while (
                    r >= 0 && r < ROWS && 
                    c >= 0 && c < COLS && 
                    board[r][c] === currentPlayer
                ) {
                    count++;
                    r += newDx;
                    c += newDy;
                }
            }
            
            if (count >= 4) {
                return true;
            }
        }
        
        return false;
    }
    
    function checkDraw() {
        // Verificar si todas las celdas están ocupadas
        for (let col = 0; col < COLS; col++) {
            if (board[ROWS - 1][col] === EMPTY) {
                return false;
            }
        }
        return true;
    }
    
    function displayWinner() {
        const winMessage = document.createElement('div');
        winMessage.textContent = `¡El Jugador ${currentPlayer} ha ganado!`;
        winMessage.className = currentPlayer === PLAYER1 ? 'player1-win' : 'player2-win';
        
        winMessageEl.innerHTML = '';
        winMessageEl.className = 'win-message';
        winMessageEl.appendChild(winMessage);
        
        gameInfoEl.textContent = `Juego terminado. ¡El Jugador ${currentPlayer} ha ganado!`;
    }
    
    function displayDraw() {
        const drawMessage = document.createElement('div');
        drawMessage.textContent = '¡Empate!';
        
        winMessageEl.innerHTML = '';
        winMessageEl.className = 'win-message draw';
        winMessageEl.appendChild(drawMessage);
        
        gameInfoEl.textContent = 'Juego terminado. ¡Empate!';
    }
    
    // Iniciar juego
    initializeGame();
    
    // Botón de reinicio
    resetButton.addEventListener('click', initializeGame);
});