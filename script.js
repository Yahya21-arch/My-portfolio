/* ==========================================================
   INITIALIZATION & LENIS SMOOTH SCROLL
   ========================================================== */
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    smooth: true,
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

/* ==========================================================
   LOADER SCREEN SIMULATION
   ========================================================== */
window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    const progress = document.querySelector('.loader-progress');
    const counter = document.querySelector('.loader-counter');
    
    let count = 0;
    const interval = setInterval(() => {
        count += Math.floor(Math.random() * 10) + 5;
        if (count >= 100) {
            count = 100;
            clearInterval(interval);
            setTimeout(() => {
                gsap.to(loader, {
                    opacity: 0,
                    duration: 0.6,
                    onComplete: () => loader.style.display = 'none'
                });
            }, 300);
        }
        progress.style.width = count + '%';
        counter.textContent = count + '%';
    }, 40);
});

/* ==========================================================
   CUSTOM CURSOR & MOUSE GLOW
   ========================================================== */
const cursor = document.querySelector('.cursor');
const follower = document.querySelector('.cursor-follower');
const mouseGlow = document.querySelector('.mouse-glow');

let mouseX = 0, mouseY = 0;
let cursorX = 0, cursorY = 0;
let followerX = 0, followerY = 0;

window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    mouseGlow.style.top = mouseY + 'px';
    mouseGlow.style.left = mouseX + 'px';
});

function renderCursor() {
    cursorX += (mouseX - cursorX) * 0.2;
    cursorY += (mouseY - cursorY) * 0.2;
    cursor.style.transform = `translate3d(${cursorX - 4}px, ${cursorY - 4}px, 0)`;

    followerX += (mouseX - followerX) * 0.1;
    followerY += (mouseY - followerY) * 0.1;
    follower.style.transform = `translate3d(${followerX - 18}px, ${followerY - 18}px, 0)`;

    requestAnimationFrame(renderCursor);
}
renderCursor();

/* ==========================================================
   MOBILE NAVIGATION TOGGLE
   ========================================================== */
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    navToggle.querySelector('i').classList.toggle('fa-bars');
    navToggle.querySelector('i').classList.toggle('fa-xmark');
});

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.querySelector('i').classList.add('fa-bars');
        navToggle.querySelector('i').classList.remove('fa-xmark');
    });
});

/* ==========================================================
   TYPED.JS HERO SUBTITLE
   ========================================================== */
document.addEventListener('DOMContentLoaded', () => {
    new Typed('.typed-text', {
        strings: [
            'Front-End Developer',
            'React Developer',
            'Three.js Developer',
            'Creative Web Designer'
        ],
        typeSpeed: 60,
        backSpeed: 40,
        backDelay: 2000,
        loop: true
    });
});

/* ==========================================================
   THREE.JS 3D HERO SCENE
   ========================================================== */
const canvas = document.getElementById('hero-canvas');
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(60, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
renderer.setSize(canvas.clientWidth, canvas.clientHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0x00E5FF, 2.5);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

const secondaryLight = new THREE.DirectionalLight(0x7B61FF, 2);
secondaryLight.position.set(-5, -5, -2);
scene.add(secondaryLight);

// Create Floating Geometric Composition (Laptop / Code / Abstract Shapes)
const group = new THREE.Group();

// Central Floating Abstract Laptop / Cube Frame
const geometryBox = new THREE.BoxGeometry(2, 1.2, 0.1);
const materialBox = new THREE.MeshStandardMaterial({
    color: 0x050816,
    roughness: 0.2,
    metalness: 0.8,
    wireframe: false
});
const laptopBase = new THREE.Mesh(geometryBox, materialBox);
group.add(laptopBase);

// Floating Torus Rings & Spheres
const torusGeometry = new THREE.TorusGeometry(1.5, 0.03, 16, 100);
const torusMaterial = new THREE.MeshStandardMaterial({
    color: 0x00E5FF,
    roughness: 0.1,
    metalness: 0.9,
    emissive: 0x00E5FF,
    emissiveIntensity: 0.3
});
const torus = new THREE.Mesh(torusGeometry, torusMaterial);
torus.rotation.x = Math.PI / 3;
group.add(torus);

// Particle Field
const particlesCount = 300;
const particlesGeometry = new THREE.BufferGeometry();
const particlesPositions = new Float32Array(particlesCount * 3);

for(let i = 0; i < particlesCount * 3; i++) {
    particlesPositions[i] = (Math.random() - 0.5) * 10;
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(particlesPositions, 3));
const particlesMaterial = new THREE.PointsMaterial({
    size: 0.025,
    color: 0x00FFC6,
    transparent: true,
    opacity: 0.8
});
const particles = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particles);

scene.add(group);

// Mouse Interaction Parallax
let targetX = 0, targetY = 0;
window.addEventListener('mousemove', (e) => {
    targetX = (e.clientX / window.innerWidth - 0.5) * 0.8;
    targetY = (e.clientY / window.innerHeight - 0.5) * 0.8;
});

// Animation Loop
const clock = new THREE.Clock();
function animateScene() {
    const elapsedTime = clock.getElapsedTime();

    group.rotation.y = elapsedTime * 0.3 + targetX;
    group.rotation.x = Math.sin(elapsedTime * 0.5) * 0.2 + targetY;
    
    torus.rotation.z = elapsedTime * 0.5;

    particles.rotation.y = elapsedTime * 0.05;

    renderer.render(scene, camera);
    requestAnimationFrame(animateScene);
}
animateScene();

// Responsive Canvas Resize
window.addEventListener('resize', () => {
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
});

/* ==========================================================
   VANILLA TILT INITIALIZATION
   ========================================================== */
VanillaTilt.init(document.querySelectorAll(".glass-card"), {
    max: 8,
    speed: 400,
    glare: true,
    "max-glare": 0.15,
});

/* ==========================================================
   ANIMATED COUNTERS & INTERSECTION OBSERVER
   ========================================================== */
const counters = document.querySelectorAll('.counter');
const speed = 200;

const startCounters = () => {
    counters.forEach(counter => {
        const updateCount = () => {
            const target = +counter.getAttribute('data-target');
            const count = +counter.innerText;
            const inc = target / speed;
            
            if (count < target) {
                counter.innerText = Math.ceil(count + inc);
                setTimeout(updateCount, 25);
            } else {
                counter.innerText = target;
            }
        };
        updateCount();
    });
};

const observerOptions = { threshold: 0.3 };
const aboutObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            startCounters();
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

const aboutSection = document.getElementById('about');
if (aboutSection) aboutObserver.observe(aboutSection);

/* Skill progress bar observation */
const skillCards = document.querySelectorAll('.skill-card');
const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
        }
    });
}, { threshold: 0.5 });

skillCards.forEach(card => skillObserver.observe(card));

/* ==========================================================
   MAGNETIC BUTTONS EFFECT
   ========================================================== */
const magneticButtons = document.querySelectorAll('.magnetic');

magneticButtons.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
    });
    
    btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0px, 0px)';
    });
});

/* ==========================================================
   CONTACT FORM SUBMISSION HANDLER
   ========================================================== */
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Thank you, Eng. Yahya has received your message and will respond shortly!');
        contactForm.reset();
    });
}
