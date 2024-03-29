import {LitElement, html, css} from 'lit';
import {range} from 'lit/directives/range.js';
import {map} from 'lit/directives/map.js';

import './src/keyboard.js';

import { wordlist } from './src/words.js';

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

      .letter-row {
        display: contents;
      }

   
      .game-tile {
        border-width: 2px;
        border-style: solid;
        border-color: rgb(58, 58, 60);
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

      .letter-row.current > .game-tile.filled {
        animation: bounce 0.2s ease-in-out;
        border-color: #ddd;
      }

      .game-tile.selected {
        --border: 2px solid #3A3A3C;
        --background-color: #3A3A3C;
        animation: flip 0.5s ease forwards;
      }

      .game-tile.green {
        --border: 2px solid #538d4e;
        --background-color: #538d4e;
        animation: flip 0.5s ease forwards;
      }

      .game-tile.yellow {
        --border: 2px solid #b59f3b;
        --background-color: #b59f3b;
        animation: flip 0.5s ease forwards;
      }

      @keyframes flip {
        0% {
          transform: rotateX(0);
          border: 2px solid rgb(58, 58, 60);
          background-color: black;
        }
        45% {
          transform: rotateX(90deg);
          border: 2px solid rgb(58, 58, 60);
          background-color: black;
        }
        55% {
          transform: rotateX(90deg);
          background: var(--background-color);
          border: var(--border);
        }
        100% {
          transform: rotateX(0);
          background: var(--background-color);
          border: var(--border);
        }
      }

      @keyframes bounce {
        0% {
          transform: scale(1);
          border-color: rgb(58, 58, 60);
        }
        50% {
          transform: scale(1.2);
        }
        100% {
          transform: scale(1);
          border-color: #e5e5e5;
        }
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
    this.answer = wordlist[Math.floor(Math.random() * wordlist.length)];
  }


  isLetter(key) {
    return /^[a-z|A-Z]+$/i.test(key);
  }

  getKeyFromEvent(e) {
    return e.type === 'keydown' ? String.fromCharCode(e.which) : e.target.dataset.key;
  }

  selectLetter(e) {
    console.log(e)
    const key = this.getKeyFromEvent(e);

    console.log(e.which, e.type);
    if (e.which === 8) return this.handleDelete(e);

    if (e.which === 13 && this.currentGuess.length === 5) {
      return this.handleSubmit(e);
    }

    if (this.currentGuess.length >= 5) {
      alert('Your word is already long enough');
    }


    if (this.isLetter(key)) {
      this.currentGuess = `${this.currentGuess}${key.toLowerCase()}`;
    }

    return;
  }

  handleSubmit(e) {
    e.preventDefault();
    const key = this.getKeyFromEvent(e);
    console.log(key);
    if (key === 'enter' || e.which === 13) {
      if (this.currentGuess.length !== 5) {
        alert(`Word (${this.currentGuess}) must be 5 letters`);
        return 
      }

      console.log(wordlist, this.currentGuess);
      if (wordlist.includes(this.currentGuess) === false) {
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
    const key = this.getKeyFromEvent(e);
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
              html`<div class="letter-row ${row === this.count ? 'current' : ''}">
                ${map(
                  range(5),
                  (col) => 
                    row === this.count 
                      ? html`<div class="game-tile ${col < (this.currentGuess.length) ? 'filled' : ''}">${getLabel(0, col, [this.currentGuess])}</div>`
                      : html`<div style="animation-delay: 0.${col * 2}s" class="game-tile ${getColor(row, col, this.answer, this.guesses)}">${getLabel(row, col, this.guesses)}</div>`
                )}
              </div>`
            )}
          </div>
        </div>

      <game-keyboard 
        .disableSubmit="${this.currentGuess.length !== 5}" 
        .clickHandler="${(e) => this.selectLetter(e)}"
        .submitHandler="${(e) => this.handleSubmit(e)}"
        .deleteHandler="${(e) => this.handleDelete(e)}"
      ></game-keyboard>
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