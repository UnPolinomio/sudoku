import { SudokuGame } from './sudoku.js'

const $form__code = document.querySelector('.form__code')
const START_MSG = '🎯¿Estás seguro que quieres comenzar ya?'
const TEMPLATE =`
    <p class='counter_container'><span class="counter"></span></p>
    <div class="app">
        <div class='wrapper'>
            <div class="container"></div>
        </div>
        <div class="numpad"></div>
    </div>
`

const SUDOKU_SET = [
    {
        id: 'tt1',
        sudoku: [
            [9, 6, 0, 1, 7, 4, 0, 5, 8],
            [1, 7, 8, 3, 2, 5, 6, 4, 9],
            [2, 5, 4, 6, 8, 9, 7, 3, 1],
            [8, 2, 1, 4, 3, 7, 5, 9, 6],
            [4, 9, 6, 8, 5, 2, 3, 1, 7],
            [0, 3, 5, 9, 6, 1, 8, 2, 4],
            [5, 8, 9, 7, 1, 3, 4, 6, 2],
            [3, 1, 7, 2, 4, 6, 9, 8, 5],
            [6, 4, 2, 5, 9, 8, 1, 7, 0],
        ],
    },
    {
        id: 'a12',
        sudoku: [
            [0, 0, 7, 8, 0, 6, 4, 0, 1],
            [3, 0, 0, 0, 0, 0, 0, 0, 5],
            [8, 0, 0, 0, 1, 0, 0, 0, 6],
            [0, 0, 3, 6, 0, 2, 0, 0, 9],
            [0, 0, 5, 0, 0, 0, 2, 0, 0],
            [1, 0, 0, 9, 0, 3, 5, 0, 0],
            [5, 0, 0, 2, 0, 7, 0, 0, 0],
            [0, 0, 1, 0, 0, 0, 6, 0, 0],
            [9, 0, 0, 0, 8, 0, 7, 3, 0],
        ],
    },
    {
        id: 'b23',
        sudoku: [
            [0, 0, 9, 7, 0, 0, 2, 3, 0],
            [4, 0, 0, 0, 0, 5, 0, 0, 0],
            [6, 0, 0, 8, 2, 0, 1, 0, 5],
            [0, 0, 0, 0, 0, 0, 0, 4, 0],
            [2, 5, 0, 0, 9, 0, 0, 0, 7],
            [0, 0, 8, 4, 0, 3, 0, 2, 0],
            [8, 0, 0, 3, 0, 0, 0, 0, 0],
            [0, 0, 6, 0, 0, 0, 8, 7, 3],
            [7, 0, 1, 6, 0, 0, 0, 0, 0],
        ],
    },
    {
        id: 'c44',
        sudoku: [
            [0, 0, 3, 8, 0, 0, 0, 0, 4],
            [0, 0, 0, 0, 2, 0, 0, 8, 0],
            [8, 0, 0, 0, 0, 9, 2, 0, 0],
            [3, 0, 0, 0, 0, 0, 0, 0, 6],
            [0, 0, 2, 0, 8, 0, 4, 1, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 3, 0, 0, 0, 0, 0],
            [1, 3, 0, 2, 0, 0, 0, 4, 9],
            [0, 0, 7, 0, 9, 8, 0, 0, 2],
        ],
    }
]

document.querySelector('.form').addEventListener('submit', (e) => {
    e.preventDefault()
    const { value } = $form__code
    const board = SUDOKU_SET.find(({ id }) => id === value)
    if (board) {
        if (!confirm(START_MSG)) { return }

        const date = new Date().toISOString()
        const id = Math.random().toString(36).substr(2, 9)
        const msg = `Código del juego: ${value} \n\n Identificador: ${id} \n\n ${date}`
        
        document.body.innerHTML = TEMPLATE
        new SudokuGame({
            container: document.querySelector('.container'),
            numpad: document.querySelector('.numpad'),
            counter: document.querySelector('.counter'),
            size: 1280,
            board: board.sudoku,
            win_msg: msg
        })
    } else {
        alert('Código inválido.')
        $form__code.value = ''
    }
})
