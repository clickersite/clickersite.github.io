const WebSocket = require('ws');
const server = new WebSocket.Server({ port: 8080 });

const players = new Map();

server.on('connection', (ws) => {
    const playerId = generatePlayerId();
    players.set(playerId, {
        x: 50,
        y: 50,
        width: 30,
        height: 30
    });

    ws.send(JSON.stringify({
        type: 'init',
        id: playerId,
        players: Array.from(players.values())
    }));

    ws.on('message', (message) => {
        const data = JSON.parse(message);
        if (data.type === 'update') {
            players.set(playerId, {
                x: data.x,
                y: data.y,
                width: data.width,
                height: data.height
            });

            broadcast({
                type: 'positions',
                players: Array.from(players.entries())
            });
        }
    });

    ws.on('close', () => {
        players.delete(playerId);
        broadcast({
            type: 'playerLeft',
            id: playerId
        });
    });
});

function broadcast(message) {
    server.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(message));
        }
    });
}

function generatePlayerId() {
    return Math.random().toString(36).substr(2, 9);
}