import './index.css'
import { SudokuGame } from './sudoku.js'
import { SUDOKU_SAMPLES } from './samples.js'

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

document.querySelector('.form').addEventListener('submit', (e) => {
    e.preventDefault()
    const { value } = $form__code
    const board = SUDOKU_SAMPLES.find(({ id }) => id === value)
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
