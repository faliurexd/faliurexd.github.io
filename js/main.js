// Three.js Background - Swirling Planets
const bgCanvas = document.getElementById('bg-canvas');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: bgCanvas, alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Create planets
const planets = [];
const planetGeometry = new THREE.SphereGeometry(1, 32, 32);

for (let i = 0; i < 15; i++) {
    const material = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        wireframe: true,
        transparent: true,
        opacity: 0.1 + Math.random() * 0.2
    });
    const planet = new THREE.Mesh(planetGeometry, material);
    const scale = 0.3 + Math.random() * 1.5;
    planet.scale.set(scale, scale, scale);
    planet.position.set(
        (Math.random() - 0.5) * 30,
        (Math.random() - 0.5) * 30,
        (Math.random() - 0.5) * 30
    );
    planet.userData = {
        rotationSpeed: 0.001 + Math.random() * 0.005,
        orbitSpeed: 0.0005 + Math.random() * 0.002,
        orbitRadius: 5 + Math.random() * 10,
        angle: Math.random() * Math.PI * 2
    };
    scene.add(planet);
    planets.push(planet);
}

// Add stars
const starsGeometry = new THREE.BufferGeometry();
const starsMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.02,
    transparent: true,
    opacity: 0.8
});

const starsVertices = [];
for (let i = 0; i < 2000; i++) {
    starsVertices.push(
        (Math.random() - 0.5) * 100,
        (Math.random() - 0.5) * 100,
        (Math.random() - 0.5) * 100
    );
}
starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
const stars = new THREE.Points(starsGeometry, starsMaterial);
scene.add(stars);

camera.position.z = 15;

// Wave Canvas Animation
const waveCanvas = document.getElementById('wave-canvas');
const waveCtx = waveCanvas.getContext('2d');

function resizeWaveCanvas() {
    waveCanvas.width = window.innerWidth;
    waveCanvas.height = 300;
}
resizeWaveCanvas();
window.addEventListener('resize', resizeWaveCanvas);

let waveTime = 0;

function drawWaves() {
    waveCtx.clearRect(0, 0, waveCanvas.width, waveCanvas.height);

    for (let w = 0; w < 3; w++) {
        waveCtx.beginPath();
        waveCtx.moveTo(0, waveCanvas.height);

        for (let x = 0; x < waveCanvas.width; x++) {
            const y = waveCanvas.height - 100 +
                Math.sin(x * 0.01 + waveTime + w * 0.5) * 20 +
                Math.sin(x * 0.02 + waveTime * 0.5 + w) * 15 +
                Math.sin(x * 0.005 + waveTime * 0.3) * 30;
            waveCtx.lineTo(x, y);
        }

        waveCtx.lineTo(waveCanvas.width, waveCanvas.height);
        waveCtx.closePath();

        const gradient = waveCtx.createLinearGradient(0, waveCanvas.height - 150, 0, waveCanvas.height);
        gradient.addColorStop(0, `rgba(255, 255, 255, ${0.05 - w * 0.01})`);
        gradient.addColorStop(1, `rgba(0, 240, 255, ${0.1 - w * 0.02})`);
        waveCtx.fillStyle = gradient;
        waveCtx.fill();
    }

    waveTime += 0.02;
}

// Animation Loop
function animate() {
    requestAnimationFrame(animate);

    // Rotate planets
    planets.forEach(planet => {
        planet.rotation.x += planet.userData.rotationSpeed;
        planet.rotation.y += planet.userData.rotationSpeed * 1.5;
        planet.userData.angle += planet.userData.orbitSpeed;
        planet.position.x = Math.cos(planet.userData.angle) * planet.userData.orbitRadius;
        planet.position.z = Math.sin(planet.userData.angle) * planet.userData.orbitRadius;
    });

    // Rotate stars slowly
    stars.rotation.y += 0.0001;

    renderer.render(scene, camera);
    drawWaves();
}
animate();

// Handle resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Intersection Observer for scroll animations
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'all 0.8s ease';
    observer.observe(section);
});

// Parallax effect on mouse move
document.addEventListener('mousemove', (e) => {
    const moveX = (e.clientX - window.innerWidth / 2) * 0.01;
    const moveY = (e.clientY - window.innerHeight / 2) * 0.01;
    camera.position.x = moveX;
    camera.position.y = -moveY;
});

// Add typing effect to subtitle
const subtitle = document.querySelector('.subtitle');
const originalText = subtitle.textContent;
subtitle.textContent = '';
let charIndex = 0;

function typeWriter() {
    if (charIndex < originalText.length) {
        subtitle.textContent += originalText.charAt(charIndex);
        charIndex++;
        setTimeout(typeWriter, 100);
    }
}
setTimeout(typeWriter, 1000);

// Theme Toggle
const themeToggle = document.getElementById('theme-toggle');
const sunIcon = document.getElementById('sun-icon');
const moonIcon = document.getElementById('moon-icon');

// Check for saved theme preference
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'light') {
    document.body.classList.add('light-mode');
    sunIcon.style.display = 'none';
    moonIcon.style.display = 'block';
}

themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
    
    if (document.body.classList.contains('light-mode')) {
        sunIcon.style.display = 'none';
        moonIcon.style.display = 'block';
        localStorage.setItem('theme', 'light');
    } else {
        sunIcon.style.display = 'block';
        moonIcon.style.display = 'none';
        localStorage.setItem('theme', 'dark');
    }
});