const events = [
    {
        id: 'goldRush',
        name: 'Gold Rush',
        description: 'Points are multiplied by 5x',
        duration: 30000,
        multiplier: 5,
        chance: 0.001
    },
    {
        id: 'criticalFrenzy',
        name: 'Critical Frenzy',
        description: '100% Critical Hit Chance',
        duration: 15000,
        effect: () => gameState.criticalChance = 100,
        cleanup: () => calculateCriticalChance(),
        chance: 0.002
    },
    {
        id: 'autoBoost',
        name: 'Automation Overdrive',
        description: 'Auto-clickers work 10x faster',
        duration: 20000,
        multiplier: 10,
        chance: 0.001
    },
    {
        id: 'prestigeBonus',
        name: 'Prestige Storm',
        description: 'Double Prestige Tokens gained',
        duration: 45000,
        prestigeMultiplier: 2,
        chance: 0.0005
    }
];

const specialEvents = [
    {
        id: 'bloodMoon',
        name: 'Blood Moon',
        description: 'All bonuses are doubled',
        duration: 60000,
        condition: () => gameState.prestigeLevel >= 5,
        effect: () => {
            gameState.globalMultiplier *= 2;
            gameState.criticalMultiplier *= 2;
        },
        cleanup: () => {
            gameState.globalMultiplier /= 2;
            gameState.criticalMultiplier /= 2;
        }
    },
    {
        id: 'quantumFlux',
        name: 'Quantum Flux',
        description: 'Random massive point bursts',
        duration: 30000,
        condition: () => gameState.superPrestigeLevel >= 1,
        interval: null,
        effect: () => {
            this.interval = setInterval(() => {
                const burst = gameState.points * 0.1;
                addPoints(burst, true);
            }, 1000);
        },
        cleanup: () => clearInterval(this.interval)
    }
];

function triggerRandomEvent() {
    if (Math.random() < 0.001) {
        const availableEvents = events.filter(event => 
            Math.random() < event.chance && 
            !gameState.activeBuffs.some(buff => buff.id === event.id)
        );
        
        if (availableEvents.length > 0) {
            const event = availableEvents[Math.floor(Math.random() * availableEvents.length)];
            activateEvent(event);
        }
    }
    
    checkSpecialEvents();
}

function activateEvent(event) {
    const activeBuff = {
        ...event,
        endTime: Date.now() + event.duration
    };
    
    gameState.activeBuffs.push(activeBuff);
    
    if (event.effect) {
        event.effect();
    }
    
    showEventNotification(event);
    playEventSound(event);
    
    setTimeout(() => {
        gameState.activeBuffs = gameState.activeBuffs.filter(buff => buff !== activeBuff);
        if (event.cleanup) {
            event.cleanup();
        }
        updateDisplay();
    }, event.duration);
}

function checkSpecialEvents() {
    specialEvents.forEach(event => {
        if (event.condition() && Math.random() < 0.0001) {
            activateEvent(event);
        }
    });
}

function showEventNotification(event) {
    const notification = document.getElementById('eventNotification');
    notification.innerHTML = `
        <div class="event-title">${event.name}</div>
        <div class="event-description">${event.description}</div>
        <div class="event-duration">${event.duration / 1000}s</div>
    `;
    notification.style.display = 'block';
    
    setTimeout(() => {
        notification.style.display = 'none';
    }, 3000);
}

function playEventSound(event) {
    const audio = new Audio(`sounds/${event.id}.mp3`);
    audio.volume = 0.4;
    audio.play().catch(() => {});
}
