const RESTART_MSG = '👾 ¿Estás seguro de reiniciar el juego? Perderás todo el progreso.'
const WIN_MSG = '🎉 ¡Terminaste! ¡Felicidades! 🎉'

class SudokuGame {
    constructor({ container, numpad, counter, size, board, win_msg }) {
        this.container = container
        this.numpad = numpad
        this.counter = counter
        this.size = size
        this.spacing = size / 9
        this.time = '00:00'
        this.board = board
        this.userBoard = board.map(row => row.slice())
        this.win_msg = win_msg
        
        this.selected = { x: null, y: null }
        
        this.createCanvas()
        this.createNumpad()
        this.drawGrid()
        this.drawBoardNumbers()
        this.addEventListeners()
        this.startCounter()
    }
    createCanvas() {
        const shadows = document.createElement('canvas')
        shadows.width = this.size
        shadows.height = this.size
        shadows.classList.add('sudokuShadows')
        this.container.appendChild(shadows)
        this.shadowsCtx = shadows.getContext('2d')

        const board = document.createElement('canvas')
        board.width = this.size
        board.height = this.size
        board.classList.add('sudokuBoard')
        this.container.appendChild(board)
        this.ctx = board.getContext('2d')

        const user = document.createElement('canvas')
        user.width = this.size
        user.height = this.size
        user.classList.add('sudokuUser')
        this.container.appendChild(user)
        this.userCtx = user.getContext('2d')
    }
    createNumpad() {
        for (let i = 0; i <= 9; i++) {
            const button = document.createElement('button')
            button.innerText = i === 0 ? 'Borrar' : `${i}`
            button.classList.add('sudokuButton-' + ((i === 0) ? 'clear' : 'number'))
            button.addEventListener('click', () => {
                this.onNumpadPress({ number: i })
            })
            this.numpad.appendChild(button)
        }

        const button = document.createElement('button')
        button.innerText = 'Reiniciar'
        button.classList.add('sudokuButton-restart')
        button.addEventListener('click', () => {
            if(confirm(RESTART_MSG)) {
                this.restart()
            }
        })
        this.numpad.appendChild(button)
    }
    restart() {
        this.userBoard = this.board.map(row => row.slice())
        this.userCtx.clearRect(0, 0, this.size, this.size)
        this.startCounter()

        this.selected.x = null
        this.selected.y = null
        this.drawSelected()
    }
    onNumpadPress({ number }) {
        const { x, y } = this.selected
        if (x === null || y === null) { return }
        if (this.board[y][x] !== 0) { return }

        this.userBoard[y][x] = number
        this.drawNumber({
            ctx: this.userCtx,
            x,
            y,
            number: number !== 0 ? number : '',
            color: 'rgb(50, 40, 220)',
            clear: true,
        })
        if (number !== 0 && this.checkWin()) {
            clearInterval(this.counterInterval)
            alert(WIN_MSG + '\n\n' + `Tu tiempo es: ${this.time}` + '\n\n' + this.win_msg)
        }
    }
    startCounter() {
        if (this.counterInterval) {
            clearInterval(this.counterInterval)
        }

        this.counter.innerText = '00:00'
        const start = Date.now()

        this.counterInterval = setInterval(() => {
            const now = Date.now()
            const time = Math.floor((now - start) / 1000)
            const minutes = Math.floor(time / 60)
            const seconds = time % 60
            const msg = `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
            this.counter.innerText = msg
            this.time = msg
        }, 1000)
    }
    checkArrayWin(arr) {
        const got = arr.slice().sort((a, b) => a - b)
        const expected = [1, 2, 3, 4, 5, 6, 7, 8, 9]
        return got.join('') === expected.join('')
    }
    checkWin() {
        // Check rows and columns
        for (let i = 0; i < 9; i++) {
            const row = this.userBoard[i]
            if (!this.checkArrayWin(row)) { return false }

            const column = this.userBoard.map(row => row[i])
            if (!this.checkArrayWin(column)) { return false }
        }

        // Check boxes
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                const box = this.userBoard.slice(i * 3, i * 3 + 3).map(row => row.slice(j * 3, j * 3 + 3))
                if (!this.checkArrayWin(box.flat())) { return false }
            }
        }

        return true
    }
    addEventListeners() {
        this.userCtx.canvas.addEventListener('click', (e) => {
            const { offsetX, offsetY } = e
            const x = Math.floor(offsetX / this.spacing)
            const y = Math.floor(offsetY / this.spacing)

            if (this.board[y][x] !== 0) {
                this.selected.x = null
                this.selected.y = null
            } else {
                this.selected.x = x
                this.selected.y = y
            }

            this.drawSelected()
        })
        document.body.addEventListener('click', (e) => {
            if (container.contains(e.target) || numpad.contains(e.target)) { return }
            this.selected.x = null
            this.selected.y = null
            this.drawSelected()
        })
    }
    drawSelected() {
        const ctx = this.shadowsCtx
        ctx.clearRect(0, 0, this.size, this.size)

        if (this.selected.x === null || this.selected.y === null) {
            return
        }

        ctx.fillStyle = 'rgba(0, 255, 200, 0.15)'
        const x = this.spacing * this.selected.x
        const y = this.spacing * this.selected.y

        // Draw row
        ctx.fillRect(0, y, this.size, this.spacing)

        // Draw column
        ctx.fillRect(x, 0, this.spacing, this.size)

        // Draw box
        ctx.fillStyle = 'rgba(0, 255, 200, 0.6)'
        ctx.fillRect(x, y, this.spacing, this.spacing)
    }

    drawNumber({ ctx, x, y, number, color, clear=false }){
        if (clear) {
            ctx.clearRect(x * this.spacing, y * this.spacing, this.spacing, this.spacing)
        }
        ctx.font = 'bold 25px sans-serif'
        ctx.fillStyle = color
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(number, this.spacing * (x + 0.5), this.spacing * (y + 0.5))
    }
    drawBoardNumbers() {
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                const number = this.board[i][j]
                if (number === 0) { continue }

                this.drawNumber({
                    ctx: this.ctx,
                    x: j,
                    y: i,
                    number,
                    color: '#000'
                })
            }
        }
    }
    drawGrid() {
        const ctx = this.ctx
        ctx.strokeStyle = '#000'
    
        // Vertical lines
        for (let i = 1; i <= 8; i++) {
            if (i % 3 === 0) {
                ctx.lineWidth = 3
            } else {
                ctx.lineWidth = 1.5
            }
            const x = this.spacing * i
    
            ctx.beginPath()
                ctx.moveTo(x, 0)
                ctx.lineTo(x, this.size)
            ctx.stroke()
        }
    
        // Horizontal lines
        for (let i = 1; i <= 8; i++) {
            if (i % 3 === 0) {
                ctx.lineWidth = 3
            } else {
                ctx.lineWidth = 1.5
            }
            const y = this.spacing * i
    
            ctx.beginPath()
                ctx.moveTo(0, y)
                ctx.lineTo(this.size, y)
            ctx.stroke()
        }
    }
}
