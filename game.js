import {LitElement, html, css} from 'lit';
import {range} from 'lit/directives/range.js';
import {map} from 'lit/directives/map.js';

const keyboard = [
  ['q','w','e','r','t','y','u','i','o','p'],
  ['a','s','d','f','g','h','j','k','l'],
  ['z','x','c','v','b','n','m']
];

const words = ['trunk', 'space', 'races', 'trend', 'coins', 'range', 'trees', 'eeeee', 'hello', 'eelle', 'eeele'];

export class Game extends LitElement {
  static get styles() {
    return css`
      :host {
        margin: 0 auto;
      }

      #container {
        display: flex;
        background-color: black;
        height: 100%;
        align-items: center;
        flex-direction: column;
      }

      #game {
        width: 100%;
        max-width: 500px;
        height: 100%;
        display: flex;
        flex-direction: column;
      }

      header {
        border-bottom: 1px solid rgb(58, 58, 60);
      }

      .title {
        color: gainsboro;
        font-size: 2.5rem;
        font-weight: bold;
        margin: 0.4rem 0 0.4rem 0;
        text-align: center;
        font-family: "Lucida Sans", "Lucida Sans Regular", "Lucida Grande",
          "Lucida Sans Unicode", Geneva, Verdana, sans-serif;
      }

      .game-grid {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-grow: 1;
        overflow: hidden;
      }

      .board {
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        grid-gap: 5px;
        padding: 10px;
        box-sizing: border-box;
      }

      .game-tile {
        border: 2px solid rgb(58, 58, 60);
        min-width: 50px;
        min-height: 50px;
        font-size: 38px;
        font-weight: bold;
        color: gainsboro;
        text-transform: uppercase;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .game-grid div.selected {
        border: 2px solid #3A3A3C;
        background-color: #3A3A3C;
      }

      .game-grid div.green {
        border: 2px solid #538d4e;
        background-color: #538d4e;
      }

      .game-grid div.yellow {
        border: 2px solid #b59f3b;
        background-color: #b59f3b;
      }

      #keyboard-container {
        height: 190px;
        padding-bottom: 10px;
      }

      .keyboard-row {
        display: flex;
        justify-content: center;
        width: 100%;
        margin: 0 auto 8px;
        touch-action: manipulation;
      }

      .keyboard-row button {
        font-family: inherit;
        font-weight: bold;
        border: 0;
        padding: 0;
        height: 58px;
        cursor: pointer;
        background-color: rgb(129, 131, 132);
        color: rgb(215, 218, 220);
        flex-grow: 1;
        text-transform: uppercase;
        margin-right: 6px;
        border-radius: 4px;
        user-select: none;
      }

      .keyboard-row button.wide-button {
        flex-grow: 1.5;
      }

      .spacer-half {
        flex-grow: 0.5;
      }
    `;
  }

  static get properties() {
    return {
      count: 0,
      currentGuess: '', 
      guesses: []
    };
  }

  constructor() {
    super();
    this.count = 0;
    this.guesses = [];
    this.currentGuess = '';
    this.answer = words[Math.floor(Math.random() * words.length)];
  }

  selectLetter(e) {
    console.log(e.target.dataset);
    console.log(e.type)
    const key = e.type === 'keypress' ? String.fromCharCode(e.which) : e.target.dataset.key;
 
    console.log(e.which);
    console.log(this.currentGuess);
    if (e.which === 8) return this.handleDelete(e);

    if (e.which === 13 && this.currentGuess.length === 5) {
      return this.handleSubmit(e);
    }

    if (this.currentGuess.length >= 5) {
      alert('Your word is already long enough');
    }

    this.currentGuess = `${this.currentGuess}${key}`;
    return;
  }

  handleSubmit(e) {
    const key = e.type === 'keypress' ? String.fromCharCode(e.which) : e.target.dataset.key;

    if (key === 'enter' || e.which === 13) {
      if (this.currentGuess.length !== 5) {
        alert(`Word (${this.currentGuess}) must be 5 letters`);
        return 
      }

      if (words.includes(this.currentGuess) === false) {
        alert('Word is invalid');
        this.currentGuess = '';
        return;
      }

      this.guesses = [
        ...this.guesses,
        this.currentGuess
      ];
      this.count++;
      this.currentGuess = '';

      return 
    }
  }

  handleDelete(e) {
    const key = e.type === 'keypress' ? String.fromCharCode(e.which) : e.target.dataset.key;
    if (key === 'del' || e.which === 8) {
      console.log('deleted');
      this.currentGuess = this.currentGuess.slice(0, -1); 
      return;
    }
  }

  render() {
    return html`
      <div id="container">
        <div id="game">
          <header>
            <h1 class="title">WORDLE</h1>
          </header>

      <div class="game-grid">
        <div class="board">
          ${map(range(6), (row) =>
            map(
              range(5),
              (col) => 
                row === this.count 
                  ? html`<div class="game-tile">${getLabel(0, col, [this.currentGuess])}</div>`
                  : html`<div class="game-tile ${getColor(row, col, this.answer, this.guesses)}">${getLabel(row, col, this.guesses)}</div>`
              )
          )}
        </div>
      </div>

      <div id="keyboard-container">
          <div id="keyboard-container" >
          <div class="keyboard-row">
            ${map(keyboard[0], (letter) => html`<button   @keypress=${(e) => this.selectLetter(e)} @click=${this.selectLetter} data-key=${letter}>${letter}</button>`)}
          </div>
          <div class="keyboard-row">
            <div class="spacer-half"></div>
            ${map(keyboard[1], (letter) => html`<button @keypress=${(e) => this.selectLetter(e)} @click=${this.selectLetter} data-key=${letter}>${letter}</button>`)}
            <div class="spacer-half"></div>
          </div>
          <div class="keyboard-row">
            <button @click=${this.handleSubmit} data-key="enter" class="wide-button">Enter</button>
            ${map(keyboard[2], (letter) => html`<button @keypress=${(e) => this.selectLetter(e)} @click=${this.selectLetter} data-key=${letter}>${letter}</button>`)}
            <button @click=${this.handleDelete} data-key="del" class="wide-button">Del</button>
          </div>
        </div>
      </div>
        </div>
    </div>
    `;
  }
}

window.customElements.define('game-element', Game);

const countLetters = (word, letter) => {
  return (word.match(new RegExp(letter, "g")) || []).length
}

const getCorrectLetterCount = (word, answer, currentLetter) => {
  return word.split('').reduce((acc, letter, index) => {
    if (currentLetter === letter && letter === answer[index]) {
       acc += 1;
    }
    return acc;
  }, 0)
}

const getColor = (row, col, answer, words) => {
  const currentWord = words[row];

  if (!currentWord) return null;

  const currentLetter = currentWord[col];

  if (answer[col] === currentLetter) return 'green';

  if (answer.includes(currentLetter)) {
    const correctLetters = getCorrectLetterCount(currentWord, answer, currentLetter);
    const lettersInAnswer = countLetters(answer, currentLetter);
    const numberOfYellowsAvailable = lettersInAnswer - correctLetters;

    if (countLetters(currentWord.slice(0, col), currentLetter) < numberOfYellowsAvailable) {
      return 'yellow';
    }
  }
  
  return 'selected';
};


const getLabel = (row, col, words) => {
  const currentWord = words[row];
  if (currentWord) return currentWord[col];
  return null
};