import {LitElement, html, css} from 'lit';
import {map} from 'lit/directives/map.js';

const keyboard = [
  ['q','w','e','r','t','y','u','i','o','p'],
  ['a','s','d','f','g','h','j','k','l'],
  ['z','x','c','v','b','n','m']
];

export class Keyboard extends LitElement {
  static get styles() {
    return css`
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

  constructor() {
    super();
  }

  render() {
    return html`
      <div id="keyboard-container">
          <div id="keyboard-container" >
          <div class="keyboard-row">
            ${map(keyboard[0], (letter) => html`<button @keydown=${this.clickHandler} @click=${this.clickHandler} data-key=${letter}>${letter}</button>`)}
          </div>
          <div class="keyboard-row">
            <div class="spacer-half"></div>
            ${map(keyboard[1], (letter) => html`<button @keydown=${this.clickHandler} @click=${this.clickHandler} data-key=${letter}>${letter}</button>`)}
            <div class="spacer-half"></div>
          </div>
          <div class="keyboard-row">
            <button ?disabled="${this.disabledSubmit}" @click=${this.submitHandler} data-key="enter" class="wide-button">Enter</button>
            ${map(keyboard[2], (letter) => html`<button @keydown=${this.clickHandler} @click=${this.clickHandler} data-key=${letter}>${letter}</button>`)}
            <button @keydown=${this.deleteHandler} @click=${this.deleteHandler} data-key="del" class="wide-button">Del</button>
          </div>
        </div>
      </div>
        </div>
    </div>
    `;
  }
}

window.customElements.define('game-keyboard', Keyboard);