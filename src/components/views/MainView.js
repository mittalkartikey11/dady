import { html, css, LitElement } from '../../assets/lit-core-2.7.4.min.js';
import { resizeLayout } from '../../utils/windowResize.js';

export class MainView extends LitElement {
    static styles = css`
        * {
            font-family: 'DM Sans', sans-serif;
            cursor: default;
            user-select: none;
        }

        .welcome {
            font-size: 32px;
            margin-bottom: 12px;
            font-weight: 700;
            margin-top: auto;
            color: #ffd700;
            letter-spacing: -0.5px;
        }

        .input-group {
            display: flex;
            gap: 8px;
            margin-bottom: 10px;
            padding: 10px;
            background: var(--golden-rgba-light);
            border-radius: 8px;
            border: 1px solid var(--golden-rgba-border);
            transition: all 0.2s ease;
        }

        .input-group:hover {
            background: rgba(255, 215, 0, 0.08);
            border-color: rgba(255, 215, 0, 0.2);
        }

        .input-group input {
            flex: 1;
        }

        input {
            background: var(--input-background);
            color: var(--text-color);
            border: 1px solid var(--button-border);
            padding: 8px 12px;
            width: 100%;
            border-radius: 8px;
            font-size: 13px;
            transition: all 0.2s ease;
            font-weight: 500;
        }

        textarea {
            background: var(--input-background);
            color: var(--text-color);
            border: 1px solid var(--button-border);
            padding: 10px 12px;
            width: 100%;
            border-radius: 8px;
            font-size: 13px;
            transition: all 0.2s ease;
            font-weight: 400;
            resize: vertical;
            min-height: 80px;
            font-family: 'DM Sans', sans-serif;
            line-height: 1.4;
        }

        textarea:focus {
            outline: none;
            border-color: var(--golden-primary);
            box-shadow: 0 0 0 3px rgba(255, 215, 0, 0.2);
            background: var(--input-focus-background);
        }

        textarea::placeholder {
            color: var(--placeholder-color);
        }

        input:focus {
            outline: none;
            border-color: var(--golden-primary);
            box-shadow: 0 0 0 3px rgba(255, 215, 0, 0.2);
            background: var(--input-focus-background);
        }

        input::placeholder {
            color: var(--placeholder-color);
        }

        .section-title {
            font-size: 13px;
            font-weight: 600;
            color: var(--text-color);
            margin-bottom: 8px;
            margin-top: 16px;
            opacity: 0.9;
        }

        .prompt-slots-container {
            display: flex;
            flex-direction: column;
            gap: 8px;
            margin-top: 8px;
        }

        .prompt-slot {
            background: var(--input-background);
            color: var(--text-color);
            border: 1px solid var(--button-border);
            padding: 8px 12px;
            border-radius: 8px;
            font-size: 12px;
            transition: all 0.2s ease;
            cursor: pointer;
            font-weight: 400;
            text-align: left;
        }

        .prompt-slot:hover {
            background: var(--input-focus-background);
            border-color: var(--golden-primary);
        }

        .prompt-slot.active {
            background: #4caf50;
            color: white;
            border-color: #4caf50;
            font-weight: 500;
        }

        .prompt-slot::placeholder {
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
            background: linear-gradient(135deg, var(--golden-primary) 0%, var(--golden-secondary) 100%);
            color: #000;
            border: 1px solid var(--golden-rgba-border-strong);
            padding: 8px 16px;
            border-radius: 8px;
            font-size: 13px;
            font-weight: 600;
            white-space: nowrap;
            display: flex;
            align-items: center;
            gap: 6px;
            transition: all 0.2s ease;
            box-shadow: 0 2px 8px var(--golden-rgba-border-strong);
        }

        .start-button:hover {
            background: linear-gradient(135deg, var(--golden-light) 0%, var(--golden-dark) 100%);
            border-color: rgba(255, 215, 0, 0.5);
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(255, 215, 0, 0.4);
        }

        .start-button.initializing {
            opacity: 0.6;
            cursor: not-allowed;
        }

        .start-button.initializing:hover {
            background: linear-gradient(135deg, var(--golden-primary) 0%, var(--golden-secondary) 100%);
            border-color: var(--golden-rgba-border-strong);
            transform: translateY(0);
            box-shadow: 0 2px 8px var(--golden-rgba-border-strong);
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
            text-align: center;
        }

        .link {
            color: var(--golden-primary);
            text-decoration: underline;
            cursor: pointer;
            font-weight: 600;
            transition: color 0.2s ease;
        }

        .link:hover {
            color: var(--golden-light);
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
        customPrompt: { type: String },
        activePromptSlot: { type: Number },
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
        this.customPrompt = '';
        this.activePromptSlot = 0; // 0 means no slot is active, 1-3 for slots
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

        // Load custom prompt from localStorage
        this.customPrompt = localStorage.getItem('customPrompt') || '';

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

    handleCustomPromptInput(e) {
        this.customPrompt = e.target.value;
        localStorage.setItem('customPrompt', this.customPrompt);
    }

    handlePromptSlotInput(slotNumber, e) {
        const value = e.target.value;
        localStorage.setItem(`customPrompt${slotNumber}`, value);
    }

    handlePromptSlotClick(slotNumber) {
        const savedPrompt = localStorage.getItem(`customPrompt${slotNumber}`) || '';
        this.customPrompt = savedPrompt;
        localStorage.setItem('customPrompt', savedPrompt);
        this.activePromptSlot = slotNumber;
        this.requestUpdate();
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

            <div class="section-title">Custom Prompt</div>
            <textarea
                placeholder="Enter custom instructions for the AI assistant..."
                .value=${this.customPrompt}
                @input=${this.handleCustomPromptInput}
            ></textarea>

            <div class="section-title">Saved Prompts</div>
            <div class="prompt-slots-container">
                <input
                    type="text"
                    class="prompt-slot ${this.activePromptSlot === 1 ? 'active' : ''}"
                    placeholder="Custom Prompt 1 - Click to use"
                    .value=${localStorage.getItem('customPrompt1') || ''}
                    @input=${e => this.handlePromptSlotInput(1, e)}
                    @click=${() => this.handlePromptSlotClick(1)}
                />
                <input
                    type="text"
                    class="prompt-slot ${this.activePromptSlot === 2 ? 'active' : ''}"
                    placeholder="Custom Prompt 2 - Click to use"
                    .value=${localStorage.getItem('customPrompt2') || ''}
                    @input=${e => this.handlePromptSlotInput(2, e)}
                    @click=${() => this.handlePromptSlotClick(2)}
                />
                <input
                    type="text"
                    class="prompt-slot ${this.activePromptSlot === 3 ? 'active' : ''}"
                    placeholder="Custom Prompt 3 - Click to use"
                    .value=${localStorage.getItem('customPrompt3') || ''}
                    @input=${e => this.handlePromptSlotInput(3, e)}
                    @click=${() => this.handlePromptSlotClick(3)}
                />
            </div>
        `;
    }
}

customElements.define('main-view', MainView);
