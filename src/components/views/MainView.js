import { html, css, LitElement } from '../../assets/lit-core-2.7.4.min.js';
import { resizeLayout } from '../../utils/windowResize.js';

export class MainView extends LitElement {
    static styles = css`
        * {
            font-family: 'Inter', sans-serif;
            cursor: default;
            user-select: none;
        }

        .welcome {
            font-size: 24px;
            margin-bottom: 8px;
            font-weight: 600;
            margin-top: auto;
        }

        .input-group {
            display: flex;
            gap: 12px;
            margin-bottom: 20px;
        }

        .input-group input {
            flex: 1;
        }

        input {
            background: var(--input-background);
            color: var(--text-color);
            border: 1px solid var(--button-border);
            padding: 10px 14px;
            width: 100%;
            border-radius: 8px;
            font-size: 14px;
            transition: border-color 0.2s ease;
        }

        input:focus {
            outline: none;
            border-color: var(--focus-border-color);
            box-shadow: 0 0 0 3px var(--focus-box-shadow);
            background: var(--input-focus-background);
        }

        input::placeholder {
            color: var(--placeholder-color);
        }

        /* Red blink animation for empty API key */
        input.api-key-error {
            animation: blink-red 1s ease-in-out;
            border-color: #ff4444;
        }

        @keyframes blink-red {
            0%,
            100% {
                border-color: var(--button-border);
                background: var(--input-background);
            }
            25%,
            75% {
                border-color: #ff4444;
                background: rgba(255, 68, 68, 0.1);
            }
            50% {
                border-color: #ff6666;
                background: rgba(255, 68, 68, 0.15);
            }
        }

        .start-button {
            background: var(--start-button-background);
            color: var(--start-button-color);
            border: 1px solid var(--start-button-border);
            padding: 8px 16px;
            border-radius: 8px;
            font-size: 13px;
            font-weight: 500;
            white-space: nowrap;
            display: flex;
            align-items: center;
            gap: 6px;
        }

        .start-button:hover {
            background: var(--start-button-hover-background);
            border-color: var(--start-button-hover-border);
        }

        .start-button.initializing {
            opacity: 0.5;
        }

        .start-button.initializing:hover {
            background: var(--start-button-background);
            border-color: var(--start-button-border);
        }

        .shortcut-icons {
            display: flex;
            align-items: center;
            gap: 2px;
            margin-left: 4px;
        }

        .shortcut-icons svg {
            width: 14px;
            height: 14px;
        }

        .shortcut-icons svg path {
            stroke: currentColor;
        }

        .description {
            color: var(--description-color);
            font-size: 14px;
            margin-bottom: 24px;
            line-height: 1.5;
        }

        .link {
            color: var(--link-color);
            text-decoration: underline;
            cursor: pointer;
        }

        .shortcut-hint {
            color: var(--description-color);
            font-size: 11px;
            opacity: 0.8;
        }

        :host {
            height: 100%;
            display: flex;
            flex-direction: column;
            width: 100%;
            max-width: 500px;
        }
    `;

    static properties = {
        onStart: { type: Function },
        onAPIKeyHelp: { type: Function },
        isInitializing: { type: Boolean },
        onLayoutModeChange: { type: Function },
        showApiKeyError: { type: Boolean },
        showApiKeyError2: { type: Boolean },
        showApiKeyError3: { type: Boolean },
    };

    constructor() {
        super();
        this.onStart = () => {};
        this.onAPIKeyHelp = () => {};
        this.isInitializing = false;
        this.onLayoutModeChange = () => {};
        this.showApiKeyError = false;
        this.showApiKeyError2 = false;
        this.showApiKeyError3 = false;
        this.boundKeydownHandler = this.handleKeydown.bind(this);
    }

    connectedCallback() {
        super.connectedCallback();
        window.electron?.ipcRenderer?.on('session-initializing', (event, isInitializing) => {
            this.isInitializing = isInitializing;
        });

        // Add keyboard event listener for Ctrl+Enter (or Cmd+Enter on Mac)
        document.addEventListener('keydown', this.boundKeydownHandler);

        // Load and apply layout mode on startup
        this.loadLayoutMode();
        // Resize window for this view
        resizeLayout();
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        window.electron?.ipcRenderer?.removeAllListeners('session-initializing');
        // Remove keyboard event listener
        document.removeEventListener('keydown', this.boundKeydownHandler);
    }

    handleKeydown(e) {
        const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
        const isStartShortcut = isMac ? e.metaKey && e.key === 'Enter' : e.ctrlKey && e.key === 'Enter';

        if (isStartShortcut) {
            e.preventDefault();
            this.handleStartClick(1);
        }
    }

    handleInput(e, keyNumber) {
        localStorage.setItem(`apiKey${keyNumber}`, e.target.value);
        // Clear error state when user starts typing
        if (keyNumber === 1 && this.showApiKeyError) {
            this.showApiKeyError = false;
        } else if (keyNumber === 2 && this.showApiKeyError2) {
            this.showApiKeyError2 = false;
        } else if (keyNumber === 3 && this.showApiKeyError3) {
            this.showApiKeyError3 = false;
        }
    }

    handleStartClick(keyNumber) {
        if (this.isInitializing) {
            return;
        }

        // Get the appropriate API key
        const apiKey = localStorage.getItem(`apiKey${keyNumber}`)?.trim();

        // Validate API key
        if (!apiKey || apiKey === '') {
            this.triggerApiKeyError(keyNumber);
            return;
        }

        // Set the active API key before starting
        localStorage.setItem('apiKey', apiKey);
        this.onStart();
    }

    handleAPIKeyHelpClick() {
        this.onAPIKeyHelp();
    }

    handleResetOnboarding() {
        localStorage.removeItem('onboardingCompleted');
        // Refresh the page to trigger onboarding
        window.location.reload();
    }

    loadLayoutMode() {
        const savedLayoutMode = localStorage.getItem('layoutMode');
        if (savedLayoutMode && savedLayoutMode !== 'normal') {
            // Notify parent component to apply the saved layout mode
            this.onLayoutModeChange(savedLayoutMode);
        }
    }

    // Method to trigger the red blink animation
    triggerApiKeyError(keyNumber = 1) {
        if (keyNumber === 1) {
            this.showApiKeyError = true;
            setTimeout(() => {
                this.showApiKeyError = false;
            }, 1000);
        } else if (keyNumber === 2) {
            this.showApiKeyError2 = true;
            setTimeout(() => {
                this.showApiKeyError2 = false;
            }, 1000);
        } else if (keyNumber === 3) {
            this.showApiKeyError3 = true;
            setTimeout(() => {
                this.showApiKeyError3 = false;
            }, 1000);
        }
    }

    render() {
        return html`
            <div class="welcome">Welcome</div>

            <div class="input-group">
                <input
                    type="password"
                    placeholder="API Key 1"
                    .value=${localStorage.getItem('apiKey1') || ''}
                    @input=${e => this.handleInput(e, 1)}
                    class="${this.showApiKeyError ? 'api-key-error' : ''}"
                />
                <button @click=${() => this.handleStartClick(1)} class="start-button ${this.isInitializing ? 'initializing' : ''}">Start 1</button>
            </div>

            <div class="input-group">
                <input
                    type="password"
                    placeholder="API Key 2"
                    .value=${localStorage.getItem('apiKey2') || ''}
                    @input=${e => this.handleInput(e, 2)}
                    class="${this.showApiKeyError2 ? 'api-key-error' : ''}"
                />
                <button @click=${() => this.handleStartClick(2)} class="start-button ${this.isInitializing ? 'initializing' : ''}">Start 2</button>
            </div>

            <div class="input-group">
                <input
                    type="password"
                    placeholder="API Key 3"
                    .value=${localStorage.getItem('apiKey3') || ''}
                    @input=${e => this.handleInput(e, 3)}
                    class="${this.showApiKeyError3 ? 'api-key-error' : ''}"
                />
                <button @click=${() => this.handleStartClick(3)} class="start-button ${this.isInitializing ? 'initializing' : ''}">Start 3</button>
            </div>

            <p class="description">
                dont have an api key?
                <span @click=${this.handleAPIKeyHelpClick} class="link">get one here</span>
            </p>
        `;
    }
}

customElements.define('main-view', MainView);
