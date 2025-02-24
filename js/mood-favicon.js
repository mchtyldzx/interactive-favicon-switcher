class MoodFavicon {
    constructor() {
        this.favicon = document.querySelector("link[rel='icon']");
        if (!this.favicon) {
            this.favicon = document.createElement('link');
            this.favicon.rel = 'icon';
            document.head.appendChild(this.favicon);
        }

        this.happiness = 50;
        this.level = 1;
        this.clickPower = 5;

        this.states = {
            sad: '/assets/favicon-sad.png',
            normal: '/assets/favicon-normal.png',
            happy: '/assets/favicon-happy.png',
            super: '/assets/favicon-super.png',
            scrolling: '/assets/favicon-scrolling.png',
            night: '/assets/favicon-night.png'
        };

        this.startGameLoop();
        this.initializeEventListeners();
        this.updateStats();
    }

    startGameLoop() {
        setInterval(() => {
            if (!this.isNightTime()) {
                this.happiness = Math.max(0, this.happiness - 10);
                this.updateState();
                this.updateStats();
            }
        }, 1000);
    }

    updateState() {
        if (this.happiness <= 30) {
            this.setState('sad');
        } else if (this.happiness <= 60) {
            this.setState('normal');
        } else if (this.happiness <= 90) {
            this.setState('happy');
        } else {
            this.setState('super');
        }
    }

    setState(state) {
        this.currentState = state;
        this.favicon.href = this.states[state];
    }

    updateStats() {
        this.level = Math.floor(this.happiness / 20) + 1;
        this.clickPower = 5 + Math.floor(this.level / 2);

        const stats = document.getElementById('mood-stats');
        if (stats) {
            stats.innerHTML = `
                Mutluluk: ${this.happiness}/100<br>
                Seviye: ${this.level}<br>
                Tıklama Gücü: ${this.clickPower}
            `;
        }
    }

    isNightTime() {
        const hour = new Date().getHours();
        return hour >= 20 || hour <= 6;
    }

    initializeEventListeners() {
        document.addEventListener('click', () => {
            if (!this.isNightTime()) {
                this.happiness = Math.min(100, this.happiness + this.clickPower);
                this.updateState();
                this.updateStats();
                this.showClickEffect();
            }
        });

        let scrollTimeout;
        window.addEventListener('scroll', () => {
            if (!this.isNightTime()) {
                clearTimeout(scrollTimeout);
                this.setState('scrolling');
                scrollTimeout = setTimeout(() => this.updateState(), 1000);
            }
        });

        setInterval(() => {
            if (this.isNightTime()) {
                this.setState('night');
            } else {
                this.updateState();
            }
        }, 60000);
    }

    showClickEffect() {
        const effect = document.createElement('div');
        effect.innerHTML = `+${this.clickPower}`;
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
        background: rgba(0,0,0,0.7);
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
