// --- INTERACTIVE BACKGROUND: NETWORK NODES ---
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');

let particlesArray = [];
const particleCount = 75;
const connectionDistance = 120;

// Set canvas dimensions
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Mouse tracking
let mouse = {
  x: null,
  y: null,
  radius: 150
};

window.addEventListener('mousemove', (event) => {
  mouse.x = event.x;
  mouse.y = event.y;
});

window.addEventListener('mouseout', () => {
  mouse.x = null;
  mouse.y = null;
});

// Particle Class
class Particle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.vx = (Math.random() - 0.5) * 0.8;
    this.vy = (Math.random() - 0.5) * 0.8;
    this.size = Math.random() * 2.5 + 1;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0, 240, 255, 0.6)';
    ctx.fill();
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;

    // Bounce off walls
    if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx;
    if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy;

    this.draw();
  }
}

// Initialize particles
function initParticles() {
  particlesArray = [];
  for (let i = 0; i < particleCount; i++) {
    particlesArray.push(new Particle());
  }
}
initParticles();

// Connect particles with lines
function connectParticles() {
  for (let i = 0; i < particlesArray.length; i++) {
    for (let j = i + 1; j < particlesArray.length; j++) {
      const dx = particlesArray[i].x - particlesArray[j].x;
      const dy = particlesArray[i].y - particlesArray[j].y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < connectionDistance) {
        // Compute line opacity based on distance
        const opacity = (1 - (distance / connectionDistance)) * 0.15;
        ctx.strokeStyle = `rgba(59, 130, 246, ${opacity})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
        ctx.lineTo(particlesArray[j].x, particlesArray[j].y);
        ctx.stroke();
      }
    }

    // Connect to mouse if close
    if (mouse.x && mouse.y) {
      const dxMouse = particlesArray[i].x - mouse.x;
      const dyMouse = particlesArray[i].y - mouse.y;
      const distanceMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);
      if (distanceMouse < mouse.radius) {
        const opacityMouse = (1 - (distanceMouse / mouse.radius)) * 0.25;
        ctx.strokeStyle = `rgba(0, 240, 255, ${opacityMouse})`;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.stroke();
      }
    }
  }
}

// Animation loop
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < particlesArray.length; i++) {
    particlesArray[i].update();
  }
  connectParticles();
  requestAnimationFrame(animate);
}
animate();


// --- DYNAMIC TYPING EFFECT ---
const typedTextSpan = document.getElementById('typed-text');
const roles = ["Cybersecurity Analyst", "Web Application Security Specialist", "Vulnerability Auditor"];
let roleIndex = 0;
let charIndex = 0;
const typingDelay = 100;
const erasingDelay = 50;
const newRoleDelay = 2000; // Pause between roles

function type() {
  if (charIndex < roles[roleIndex].length) {
    typedTextSpan.textContent += roles[roleIndex].charAt(charIndex);
    charIndex++;
    setTimeout(type, typingDelay);
  } else {
    setTimeout(erase, newRoleDelay);
  }
}

function erase() {
  if (charIndex > 0) {
    typedTextSpan.textContent = roles[roleIndex].substring(0, charIndex - 1);
    charIndex--;
    setTimeout(erase, erasingDelay);
  } else {
    roleIndex = (roleIndex + 1) % roles.length;
    setTimeout(type, typingDelay + 500);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  if (roles.length) setTimeout(type, newRoleDelay + 250);
});


// --- SCROLL EFFECTS & SCROLL SPY ---
const header = document.getElementById('main-header');
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
  // Sticky header background opacity changes
  if (window.scrollY > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }

  // Active navigation link detection (Scroll Spy)
  let currentActive = "";
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 150;
    if (window.scrollY >= sectionTop) {
      currentActive = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${currentActive}`) {
      link.classList.add('active');
    }
  });
});


// --- MOBILE NAVIGATION BAR TOGGLE ---
const mobileBtn = document.getElementById('mobile-menu-btn');
const navMenu = document.getElementById('nav-menu');

mobileBtn.addEventListener('click', () => {
  navMenu.classList.toggle('active');
  const icon = mobileBtn.querySelector('i');
  if (navMenu.classList.contains('active')) {
    icon.className = 'fa-solid fa-xmark';
  } else {
    icon.className = 'fa-solid fa-bars';
  }
});

// Close mobile menu when nav-link clicked
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('active');
    mobileBtn.querySelector('i').className = 'fa-solid fa-bars';
  });
});


// --- SKILLS PROGRESS ANIMATIONS ---
const skillBars = document.querySelectorAll('.skill-bar-fill');
const skillObserverOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px"
};

const skillObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const bar = entry.target;
      const targetWidth = bar.getAttribute('data-width');
      bar.style.width = targetWidth;
      observer.unobserve(bar); // Run animation once
    }
  });
}, skillObserverOptions);

skillBars.forEach(bar => skillObserver.observe(bar));


// --- CONTACT FORM HANDLING & SECURE MESSAGE FEEDBACK ---
const contactForm = document.getElementById('contact-form');

if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('form-name').value;
    const email = document.getElementById('form-email').value;
    const message = document.getElementById('form-message').value;

    if (name && email && message) {
      // Premium custom notification toast/overlay instead of simple alert
      const toast = document.createElement('div');
      toast.style.position = 'fixed';
      toast.style.bottom = '30px';
      toast.style.right = '30px';
      toast.style.background = 'rgba(10, 15, 26, 0.95)';
      toast.style.backdropFilter = 'blur(8px)';
      toast.style.border = '1px solid #00f0ff';
      toast.style.boxShadow = '0 0 15px rgba(0, 240, 255, 0.3)';
      toast.style.padding = '1.2rem 2rem';
      toast.style.borderRadius = '8px';
      toast.style.zIndex = '1000';
      toast.style.display = 'flex';
      toast.style.alignItems = 'center';
      toast.style.gap = '12px';
      toast.style.color = '#fff';
      toast.style.transition = 'all 0.5s ease';
      toast.style.transform = 'translateY(100px)';
      toast.style.opacity = '0';

      toast.innerHTML = `
        <i class="fa-solid fa-circle-check" style="color: #00f0ff; font-size: 1.5rem;"></i>
        <div>
          <h5 style="margin: 0; font-size: 1rem; color: #fff; font-family: 'Outfit', sans-serif;">Transmission Encrypted</h5>
          <p style="margin: 0; font-size: 0.85rem; color: #94a3b8;">Thanks ${name}, message sent securely.</p>
        </div>
      `;

      document.body.appendChild(toast);
      
      // Animate entry
      setTimeout(() => {
        toast.style.transform = 'translateY(0)';
        toast.style.opacity = '1';
      }, 100);

      // Reset Form
      contactForm.reset();

      // Dismiss Toast after 4 seconds
      setTimeout(() => {
        toast.style.transform = 'translateY(100px)';
        toast.style.opacity = '0';
        setTimeout(() => {
          toast.remove();
        }, 500);
      }, 4000);
    }
  });
}
