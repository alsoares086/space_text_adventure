class Game {
    constructor() {
        this.scenes = SCENES;
        this.state = {
            currentScene: 'start',
            inventory: [],
            logs: [],
            flags: {
                trustAI: 0,
                discoveredTruth: 0
            }
        };
        
        this.textDisplay = document.getElementById('text-display');
        this.choicesContainer = document.getElementById('choices-container');
        this.inventoryItems = document.getElementById('inventory-items');
        this.logsContent = document.getElementById('logs-content');
    }

    start() {
        this.showScene('start');
    }

    async typeWriter(textObj, element) {
        const speed = 15;
        let div = document.createElement('div');
        
        switch(textObj.type) {
            case 'ai':
                div.className = 'ai-speech';
                break;
            case 'player':
                div.className = 'player-speech';
                break;
            case 'system':
                div.className = 'system-message';
                break;
            default:
                div.className = 'system-message';
        }
        
        element.appendChild(div);
        
        for (let i = 0; i < textObj.text.length; i++) {
            div.innerHTML += textObj.text.charAt(i);
            await new Promise(resolve => setTimeout(resolve, speed));
        }
    }

    async showScene(sceneId) {
        const scene = this.scenes[sceneId];
        if (!scene) return;

        // Limpa as escolhas anteriores
        this.choicesContainer.innerHTML = '';
        this.textDisplay.innerHTML = '';
        
        // Exibe o texto com efeito de digitação
        for (let textObj of scene.text) {
            await this.typeWriter(textObj, this.textDisplay);
        }

        // Cria os botões de escolha
        scene.choices.forEach(choice => {
            const button = document.createElement('button');
            button.className = 'choice-btn';
            button.textContent = choice.text;
            button.onclick = () => {
                if (choice.addToInventory) {
                    this.addToInventory(choice.addToInventory);
                }
                this.showScene(choice.nextScene);
            };
            this.choicesContainer.appendChild(button);
        });
    }

    addToInventory(item) {
        this.state.inventory.push(item);
        this.updateInventory();
    }

    updateInventory() {
        this.inventoryItems.innerHTML = this.state.inventory
            .map(item => `<div class="inventory-item">${item}</div>`)
            .join('');
    }

    addLog(log) {
        this.state.logs.push(log);
        this.updateLogs();
    }

    updateLogs() {
        this.logsContent.innerHTML = this.state.logs
            .map(log => `<div class="log-entry">${log}</div>`)
            .join('');
    }
}

// Iniciar o jogo quando a página carregar
window.addEventListener('DOMContentLoaded', () => {
    const game = new Game();
    game.start();
});
