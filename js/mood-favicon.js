class MoodFavicon {
    constructor() {
        this.favicon = document.querySelector("link[rel='icon']");
        if (!this.favicon) {
            this.favicon = document.createElement('link');
            this.favicon.rel = 'icon';
            document.head.appendChild(this.favicon);
        }

        this.mood = 20; 
        this.level = 1; 
        
        this.states = {
            crying: 'assets/favicon-crying.png',      
            sad: 'assets/favicon-sad.png',      
            normal: 'assets/favicon-normal.png', 
            happy: 'assets/favicon-happy.png',   
            super: 'assets/favicon-super.png',   
            scrolling: 'assets/favicon-scrolling.png', 
            night: 'assets/favicon-night.png'    
        };

        this.powers = {};

        this.clickPower = 5; 

        this.startGameLoop();
        this.initializeEventListeners();
        this.updateStats();
    }

    createPowerButtons() {
        const powerContainer = document.createElement('div');
        powerContainer.id = 'power-container';
        powerContainer.style.cssText = `
            position: fixed;
            top: 200px;  
            right: 10px;
            display: flex;
            flex-direction: column;
            gap: 10px;
        `;

        const resetLevelBtn = document.createElement('button');
        resetLevelBtn.innerHTML = '🔄 Reset Level';
        resetLevelBtn.className = 'power-button';
        resetLevelBtn.onclick = () => this.resetLevel();
        powerContainer.appendChild(resetLevelBtn);

        document.body.appendChild(powerContainer);
    }

    togglePower(powerType, button) {
    }

    startGameLoop() {
        setInterval(() => {
            this.mood = Math.max(0, this.mood - 3); 
            this.updateState();
            this.updateStats();
        }, 1000);
    }

    updateState() {
        if (this.mood <= 15) {
            this.setState('crying');
        } else if (this.mood <= 30) {
            this.setState('sad');
        } else if (this.mood <= 60) {
            this.setState('normal');
        } else if (this.mood <= 90) {
            this.setState('happy');
        } else {
            this.setState('super');
        }
    }

    setState(state) {
        this.currentState = state;
        this.favicon.href = this.states[state];

        const body = document.body;
        if (body.classList.contains('dark-mode')) {
            this.favicon.href = this.states['night'];
        }
    }

    updateStats() {
        this.level = Math.floor(this.mood / 20) + 1;

        const stats = document.getElementById('mood-stats');
        if (stats) {
            stats.innerHTML = `
                Mood: ${this.mood}/100<br>
                Level: ${this.level}
            `;
        }
    }

    initializeEventListeners() {
        document.addEventListener('click', () => {
            let clickPower = this.clickPower; 

            this.mood = Math.min(100, this.mood + clickPower); 
            this.updateState();
            this.updateStats();
            this.showClickEffect(clickPower); 
        });

        let scrollTimeout;
        window.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            this.setState('scrolling');
            scrollTimeout = setTimeout(() => this.updateState(), 1000);
        });
    }

    showClickEffect(clickPower) {
        const effect = document.createElement('div');
        effect.innerHTML = `+${clickPower}`;
        effect.style.cssText = `
            position: fixed;
            color: #4CAF50;
            font-weight: bold;
            pointer-events: none;
            animation: floatUp 1s ease-out;
            z-index: 9999;
        `;
        effect.style.left = (event.clientX - 10) + 'px';
        effect.style.top = (event.clientY - 10) + 'px';
        document.body.appendChild(effect);
        
        setTimeout(() => effect.remove(), 1000);
    }

    resetLevel() {
        this.mood = 0; 
        this.updateState();
        this.updateStats();
    }
}

const style = document.createElement('style');
style.textContent = `
    @keyframes floatUp {
        0% { transform: translateY(0); opacity: 1; }
        100% { transform: translateY(-50px); opacity: 0; }
    }
    #mood-stats {
        position: fixed;
        top: 10px;
        right: 10px;
        background: #414141;
        color: white;
        padding: 10px;
        border-radius: 5px;
        font-family: Arial, sans-serif;
    }
`;
document.head.appendChild(style);

document.addEventListener('DOMContentLoaded', () => {
    const stats = document.createElement('div');
    stats.id = 'mood-stats';
    document.body.appendChild(stats);

    window.moodFavicon = new MoodFavicon();
});