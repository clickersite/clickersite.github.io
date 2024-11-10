const canvas = document.getElementById('laserCanvas');
const ctx = canvas.getContext('2d');
const progressText = document.getElementById('progress-text');

let loadingProgress = 0;
let isLoading = true;

// Create fade overlay
const fadeOverlay = document.createElement('div');
fadeOverlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: black;
    opacity: 0;
    pointer-events: none;
    transition: opacity 1.5s ease-in;
    z-index: 1000;
`;
document.body.appendChild(fadeOverlay);

document.addEventListener('DOMContentLoaded', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    init();
});

function init() {
    const cannon = {
        x: canvas.width / 2,
        y: canvas.height - 80,
        width: 100,
        height: 80,
        rotation: 0
    };

    const laserBeam = {
        active: true,
        width: 30,
        particles: [],
        glow: 50,
        height: 0
    };

    class QuantumParticle {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.size = Math.random() * 3;
            this.speedY = Math.random() * 15;
            this.speedX = (Math.random() - 0.5) * 3;
            this.color = `hsl(${Math.random() * 60 + 200}, 100%, 50%)`;
            this.alpha = 1;
        }

        update() {
            this.y -= this.speedY;
            this.x += this.speedX;
            this.alpha -= 0.01;
            this.size *= 0.97;
        }

        draw() {
            ctx.save();
            ctx.globalAlpha = this.alpha;
            ctx.fillStyle = this.color;
            ctx.shadowBlur = 20;
            ctx.shadowColor = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }

    function drawCannon() {
        ctx.save();
        ctx.translate(cannon.x, cannon.y);
        
        // Cannon base with pulsing effect
        const pulseSize = Math.sin(Date.now() * 0.005) * 5;
        ctx.fillStyle = '#444';
        ctx.beginPath();
        ctx.arc(0, 0, 50 + pulseSize, 0, Math.PI * 2);
        ctx.fill();

        // Cannon barrel
        ctx.fillStyle = '#666';
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#0ff';
        ctx.fillRect(-25, -60, 50, 60);

        // Energy core with dynamic glow
        ctx.fillStyle = '#0ff';
        ctx.shadowBlur = 20 + pulseSize;
        ctx.beginPath();
        ctx.arc(0, -30, 15 + pulseSize/2, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }

    function simulateLoading() {
        if (loadingProgress < 100) {
            loadingProgress += 0.5;
            progressText.textContent = `Loading: ${Math.floor(loadingProgress)}%`;
            laserBeam.height = (loadingProgress / 100) * canvas.height;
        } else {
            progressText.textContent = 'Press Any Key to Start';
            document.addEventListener('keypress', () => {
                // Start fade effect
                fadeOverlay.style.opacity = '1';
                
                // Redirect after fade completes
                setTimeout(() => {
                    window.location.href = 'game.html'; // Replace with actual game URL
                }, 1500);
            }, { once: true });
        }
    }

    function animate() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        drawCannon();

        if (laserBeam.active) {
            const gradient = ctx.createLinearGradient(0, canvas.height, 0, 0);
            gradient.addColorStop(0, '#4ff');
            gradient.addColorStop(0.5, '#0ff');
            gradient.addColorStop(1, '#08f');

            ctx.shadowBlur = laserBeam.glow;
            ctx.shadowColor = '#0ff';
            ctx.fillStyle = gradient;
            ctx.fillRect(
                cannon.x - laserBeam.width/2, 
                canvas.height - laserBeam.height, 
                laserBeam.width, 
                laserBeam.height
            );

            for(let i = 0; i < 3; i++) {
                laserBeam.particles.push(new QuantumParticle(
                    cannon.x + (Math.random() - 0.5) * laserBeam.width,
                    canvas.height - laserBeam.height
                ));
            }
        }

        laserBeam.particles.forEach((particle, index) => {
            particle.update();
            particle.draw();
            
            if(particle.alpha <= 0) {
                laserBeam.particles.splice(index, 1);
            }
        });

        laserBeam.glow = 50 + Math.sin(Date.now() * 0.01) * 20;

        simulateLoading();
        requestAnimationFrame(animate);
    }

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        cannon.x = canvas.width / 2;
        cannon.y = canvas.height - 80;
    });

    animate();
}
