class Game {
    constructor() {
        this.clicks = 0;
        this.clickPower = 1;
        this.upgradeCost = 10;
        this.doubleClickChance = 0;
        this.doubleClickCost = 50;
        this.autoClickers = 0;
        this.autoClickerCost = 15;
        this.factories = 0;
        this.factoryCost = 100;
        this.prestigePoints = 0;
        this.multiplier = 1;
        this.achievements = new Set();
        this.activeBuffs = new Map();
        this.buffMultiplier = 1;

        // Research System
        this.researchPoints = 0;
        this.research = {
            production: { level: 0, cost: 100, bonus: 1 },
            automation: { level: 0, cost: 100, bonus: 1 },
            power: { level: 0, cost: 100, bonus: 1 }
        };

        this.initialize();
        this.startGameLoop();
    }

    initialize() {
        document.getElementById('click-button').addEventListener('click', () => {
            const isDouble = Math.random() < (this.doubleClickChance / 100);
            this.addClicks(this.clickPower * this.multiplier * this.buffMultiplier * (isDouble ? 2 : 1));
            this.addResearchPoints(0.1 * this.getResearchBonus('power'));
        });

        document.getElementById('power-upgrade').addEventListener('click', () => {
            this.buyUpgrade();
        });

        document.getElementById('double-click-upgrade').addEventListener('click', () => {
            this.buyDoubleClickUpgrade();
        });

        document.getElementById('buy-autoclicker').addEventListener('click', () => {
            this.buyAutoClicker();
        });

        document.getElementById('buy-factory').addEventListener('click', () => {
            this.buyFactory();
        });

        document.getElementById('prestige-button').addEventListener('click', () => {
            this.prestige();
        });

        // Research handlers
        document.getElementById('research-production').addEventListener('click', () => this.conductResearch('production'));
        document.getElementById('research-automation').addEventListener('click', () => this.conductResearch('automation'));
        document.getElementById('research-power').addEventListener('click', () => this.conductResearch('power'));
    }

    conductResearch(type) {
        const research = this.research[type];
        if (this.researchPoints >= research.cost) {
            this.researchPoints -= research.cost;
            research.level++;
            research.cost = Math.floor(research.cost * 1.5);
            research.bonus = 1 + (research.level * 0.2);
            this.updateDisplay();
        }
    }

    getResearchBonus(type) {
        return this.research[type].bonus;
    }

    addResearchPoints(amount) {
        this.researchPoints += amount;
        this.updateDisplay();
    }

    addClicks(amount) {
        amount *= this.getResearchBonus('production');
        this.clicks += amount;
        this.checkAchievements();
        this.updateDisplay();
    }

    buyUpgrade() {
        if (this.clicks >= this.upgradeCost) {
            this.clicks -= this.upgradeCost;
            this.clickPower += 1;
            this.upgradeCost = Math.floor(this.upgradeCost * 1.5);
            this.updateDisplay();
        }
    }

    buyDoubleClickUpgrade() {
        if (this.clicks >= this.doubleClickCost) {
            this.clicks -= this.doubleClickCost;
            this.doubleClickChance += 5;
            this.doubleClickCost = Math.floor(this.doubleClickCost * 1.5);
            this.updateDisplay();
        }
    }

    buyAutoClicker() {
        if (this.clicks >= this.autoClickerCost) {
            this.clicks -= this.autoClickerCost;
            this.autoClickers += 1;
            this.autoClickerCost = Math.floor(this.autoClickerCost * 1.15);
            this.updateDisplay();
        }
    }

    buyFactory() {
        if (this.clicks >= this.factoryCost) {
            this.clicks -= this.factoryCost;
            this.factories += 1;
            this.factoryCost = Math.floor(this.factoryCost * 1.15);
            this.updateDisplay();
        }
    }

    calculatePrestigeGain() {
        return Math.floor(Math.sqrt(this.clicks / 1e6));
    }

    prestige() {
        const gain = this.calculatePrestigeGain();
        if (gain > 0) {
            this.prestigePoints += gain;
            this.multiplier = 1 + this.prestigePoints * 0.1;
            
            // Reset resources but keep prestige points, research, and achievements
            this.clicks = 0;
            this.clickPower = 1;
            this.upgradeCost = 10;
            this.doubleClickChance = 0;
            this.doubleClickCost = 50;
            this.autoClickers = 0;
            this.autoClickerCost = 15;
            this.factories = 0;
            this.factoryCost = 100;
            
            this.updateDisplay();
        }
    }

    createPowerOrb() {
        const orb = document.createElement('div');
        orb.className = 'power-orb';
        
        const maxX = window.innerWidth - 60;
        const maxY = window.innerHeight - 60;
        orb.style.left = Math.random() * maxX + 'px';
        orb.style.top = Math.random() * maxY + 'px';
        
        orb.addEventListener('click', () => {
            this.activateBuff();
            orb.remove();
        });
        
        document.body.appendChild(orb);
        
        setTimeout(() => orb.remove(), 10000);
    }

    activateBuff() {
        const buffs = [
            { name: 'Click Frenzy', multiplier: 7, duration: 10 },
            { name: 'Production Boost', multiplier: 15, duration: 15 },
            { name: 'Lucky Clicks', multiplier: 20, duration: 5 }
        ];
        
        const buff = buffs[Math.floor(Math.random() * buffs.length)];
        this.activeBuffs.set(buff.name, {
            multiplier: buff.multiplier,
            endTime: Date.now() + buff.duration * 1000
        });
        
        this.showBuffPopup(buff.name, buff.multiplier, buff.duration);
    }

    showBuffPopup(name, multiplier, duration) {
        const popup = document.createElement('div');
        popup.className = 'buff-popup';
        popup.textContent = `${name}! (x${multiplier} for ${duration}s)`;
        document.body.appendChild(popup);
        setTimeout(() => popup.remove(), 3000);
    }

    checkAchievements() {
        const newAchievements = [
            { id: 'clicks100', condition: () => this.clicks >= 100, name: '100 Clicks!' },
            { id: 'clicks1000', condition: () => this.clicks >= 1000, name: '1,000 Clicks!' },
            { id: 'clicks10000', condition: () => this.clicks >= 10000, name: '10,000 Clicks!' },
            { id: 'firstPrestige', condition: () => this.prestigePoints > 0, name: 'First Prestige!' },
            { id: 'research1', condition: () => this.researchPoints >= 100, name: 'Research Beginner!' }
        ];

        newAchievements.forEach(achievement => {
            if (!this.achievements.has(achievement.id) && achievement.condition()) {
                this.achievements.add(achievement.id);
                this.showAchievementPopup(achievement.name);
            }
        });
    }

    showAchievementPopup(name) {
        const popup = document.createElement('div');
        popup.className = 'achievement-popup';
        popup.textContent = `Achievement Unlocked: ${name}`;
        document.body.appendChild(popup);
        setTimeout(() => popup.remove(), 3000);
    }

    calculateProduction() {
        const baseProduction = (this.autoClickers + this.factories * 5);
        return baseProduction * this.multiplier * this.buffMultiplier * this.getResearchBonus('automation');
    }

    updateDisplay() {
        document.getElementById('click-count').textContent = Math.floor(this.clicks);
        document.getElementById('power-level').textContent = this.clickPower;
        document.getElementById('upgrade-cost').textContent = this.upgradeCost;
        document.getElementById('double-click-chance').textContent = this.doubleClickChance;
        document.getElementById('double-click-cost').textContent = this.doubleClickCost;
        document.getElementById('autoclicker-count').textContent = this.autoClickers;
        document.getElementById('autoclicker-cost').textContent = this.autoClickerCost;
        document.getElementById('factory-count').textContent = this.factories;
        document.getElementById('factory-cost').textContent = this.factoryCost;
        document.getElementById('clicks-per-second').textContent = this.calculateProduction().toFixed(1);
        document.getElementById('prestige-points').textContent = this.prestigePoints;
        document.getElementById('multiplier').textContent = this.multiplier.toFixed(1);
        document.getElementById('prestige-gain').textContent = this.calculatePrestigeGain();
        document.getElementById('achievement-count').textContent = this.achievements.size;
        document.getElementById('buff-multiplier').textContent = this.buffMultiplier.toFixed(1);
        document.getElementById('research-points').textContent = Math.floor(this.researchPoints);
        document.getElementById('production-research-level').textContent = this.research.production.level;
        document.getElementById('automation-research-level').textContent = this.research.automation.level;
        document.getElementById('power-research-level').textContent = this.research.power.level;
        document.getElementById('production-research-cost').textContent = this.research.production.cost;
        document.getElementById('automation-research-cost').textContent = this.research.automation.cost;
        document.getElementById('power-research-cost').textContent = this.research.power.cost;
    }

    startGameLoop() {
        setInterval(() => {
            let totalMultiplier = 1;
            const now = Date.now();
            
            for (const [buffName, buff] of this.activeBuffs) {
                if (now > buff.endTime) {
                    this.activeBuffs.delete(buffName);
                } else {
                    totalMultiplier *= buff.multiplier;
                }
            }
            this.buffMultiplier = totalMultiplier;
            const production = this.calculateProduction();
            this.addClicks(production / 10);
        }, 100);

        setInterval(() => {
            this.createPowerOrb();
        }, Math.random() * 40000 + 20000);
    }
}

const game = new Game();
