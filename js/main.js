document.addEventListener('DOMContentLoaded', () => {
    setupMobileMenu();
    setupScrollEffects();
    setupScrollAnimations();
});

// Menu Mobile
function setupMobileMenu() {
    const header = document.querySelector('.header-container');
    const mainNav = document.querySelector('.main-nav');
    
    // Criar botão do menu mobile
    const mobileMenuButton = document.createElement('button');
    mobileMenuButton.className = 'mobile-menu-button';
    mobileMenuButton.setAttribute('aria-label', 'Menu');
    mobileMenuButton.innerHTML = `
        <span></span>
        <span></span>
        <span></span>
    `;
    
    // Inserir botão antes da navegação principal
    if (mainNav) {
        mainNav.parentNode.insertBefore(mobileMenuButton, mainNav);
        
        // Toggle do menu mobile
        mobileMenuButton.addEventListener('click', () => {
            mobileMenuButton.classList.toggle('active');
            mainNav.classList.toggle('active');
            
            // Gerenciar acessibilidade
            const isExpanded = mobileMenuButton.classList.contains('active');
            mobileMenuButton.setAttribute('aria-expanded', isExpanded);
            
            // Prevenir scroll quando menu estiver aberto
            document.body.style.overflow = isExpanded ? 'hidden' : '';
        });
        
        // Fechar menu ao clicar em um link
        mainNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenuButton.classList.remove('active');
                mainNav.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }
}

// Efeitos de Scroll
function setupScrollEffects() {
    const header = document.querySelector('.header');
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        // Adicionar classe quando rolar
        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });
}

// Animações de Entrada
function setupScrollAnimations() {
    const animateElements = document.querySelectorAll('.animate-on-scroll');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Adicionar delay para elementos em sequência
                const delay = Array.from(entry.target.parentElement.children)
                    .indexOf(entry.target) * 100;
                
                entry.target.style.transitionDelay = delay + 'ms';
                entry.target.classList.add('animated');
                
                // Remover delay após a animação
                setTimeout(() => {
                    entry.target.style.transitionDelay = '0ms';
                }, delay + 600);
                
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    animateElements.forEach(element => observer.observe(element));
}

// Smooth Scroll para links internos
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = document.querySelector('.header').offsetHeight;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});
