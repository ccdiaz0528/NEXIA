// Redireccionar a la app de chat
const ctaButtons = document.querySelectorAll('#cta-button, #start-chat, #final-cta');

ctaButtons.forEach(button => {
    button.addEventListener('click', () => {
        window.location.href = 'index.html';
    });
});

// Demo button - muestra una demostración rápida
document.getElementById('demo-button').addEventListener('click', () => {
    alert('Demo: Esta es una vista previa de Nexia. Haz clic en "Comenzar Chat Ahora" para acceder a la aplicación completa.');
});

// Smooth scroll para los links de navegación
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Efecto de entrada en scroll para elementos
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Aplicar efectos a elementos
const elementsToObserve = document.querySelectorAll('.feature-card, .step, .benefit-item, .faq-item');

elementsToObserve.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'all 0.5s ease';
    observer.observe(el);
});

// Animación de carga suave
window.addEventListener('load', () => {
    document.body.style.opacity = '1';
});

// Efecto de click en botones
document.querySelectorAll('button').forEach(button => {
    button.addEventListener('click', function() {
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = 'scale(1)';
        }, 100);
    });
});
