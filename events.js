const events = [
    {
        id: 'goldRush',
        name: 'Gold Rush',
        description: 'Double points for 30 seconds!',
        probability: 0.1,
        duration: 30000,
        effect: () => {
            return {
                multiplier: 2,
                type: 'points'
            };
        }
    },
    {
        id: 'criticalFrenzy',
        name: 'Critical Frenzy',
        description: 'Triple critical chance for 20 seconds!',
        probability: 0.05,
        duration: 20000,
        effect: () => {
            const originalCrit = gameState.criticalChance;
            gameState.criticalChance *= 3;
            return {
                cleanup: () => {
                    gameState.criticalChance = originalCrit;
                }
            };
        }
    },
    {
        id: 'autoBoost',
        name: 'Auto-Clicker Surge',
        description: 'Auto-clickers work twice as fast for 15 seconds!',
        probability: 0.08,
        duration: 15000,
        effect: () => {
            return {
                multiplier: 2,
                type: 'autoClicker'
            };
        }
    }
];

function triggerRandomEvent() {
    if (Math.random() > 0.99) { // 1% chance per click
        const availableEvents = events.filter(event => 
            !gameState.activeBuffs.some(buff => buff.id === event.id)
        );
        
        if (availableEvents.length > 0) {
            const randomEvent = availableEvents[Math.floor(Math.random() * availableEvents.length)];
            activateEvent(randomEvent);
        }
    }
}

function activateEvent(event) {
    const effect = event.effect();
    const buff = {
        id: event.id,
        name: event.name,
        endTime: Date.now() + event.duration,
        ...effect
    };
    
    gameState.activeBuffs.push(buff);
    showEventNotification(event);
    playEventSound();
    
    setTimeout(() => {
        const index = gameState.activeBuffs.findIndex(b => b.id === event.id);
        if (index !== -1) {
            const removedBuff = gameState.activeBuffs.splice(index, 1)[0];
            if (removedBuff.cleanup) {
                removedBuff.cleanup();
            }
        }
        updateDisplay();
    }, event.duration);
}

function showEventNotification(event) {
    const notification = document.createElement('div');
    notification.className = 'event-notification';
    notification.innerHTML = `
        <h3>${event.name}</h3>
        <p>${event.description}</p>
    `;
    
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
}

function playEventSound() {
    const audio = new Audio('sounds/event.mp3');
    audio.volume = 0.3;
    audio.play().catch(() => {});
}

function updateBuffsDisplay() {
    const buffsDiv = document.getElementById('activeBuffs');
    buffsDiv.innerHTML = '';
    
    gameState.activeBuffs.forEach(buff => {
        const timeLeft = Math.ceil((buff.endTime - Date.now()) / 1000);
        const buffElement = document.createElement('div');
        buffElement.className = 'buff-active';
        buffElement.innerHTML = `
            <div class="buff-name">${buff.name}</div>
            <div class="buff-timer">${timeLeft}s</div>
        `;
        buffsDiv.appendChild(buffElement);
    });
}
