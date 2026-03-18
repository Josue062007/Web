// script.js
const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".nav-links");

// Toggle mobile menu
hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    navMenu.classList.toggle("active");
});

// Close mobile menu when clicking a link
document.querySelectorAll(".nav-links a").forEach(n => n.addEventListener("click", () => {
    hamburger.classList.remove("active");
    navMenu.classList.remove("active");
}));

// Add event listeners to sponsor buttons for interaction
const sponsorBtns = document.querySelectorAll('.sponsor-btn');

sponsorBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        const planName = e.target.parentElement.querySelector('h3').innerText;
        alert(`¡Deliciosa elección! Gracias por tu interés en el plan "${planName}". Preparando tu caja de galletas... (Simulación de pasarela de pago)`);
    });
});

// Navbar smooth shrink effect on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.padding = '1rem 5%';
        navbar.style.boxShadow = '0 5px 20px rgba(0,0,0,0.1)';
        navbar.style.background = 'rgba(255, 248, 220, 0.98)';
    } else {
        navbar.style.padding = '1.5rem 5%';
        navbar.style.boxShadow = '0 2px 10px rgba(0,0,0,0.05)';
        navbar.style.background = 'rgba(255, 248, 220, 0.95)';
    }
});
