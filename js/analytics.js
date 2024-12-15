// Google Analytics 4 Configuration
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}

// Substitua GA_MEASUREMENT_ID pelo ID real do Google Analytics
gtag('js', new Date());
gtag('config', 'GA_MEASUREMENT_ID', {
    page_path: window.location.pathname,
    debug_mode: false
});

// Eventos personalizados para rastreamento
const trackEvent = (eventName, parameters = {}) => {
    gtag('event', eventName, parameters);
};

// Rastrear cliques em links sociais
document.querySelectorAll('.social-links a, .footer-social a').forEach(link => {
    link.addEventListener('click', () => {
        const network = link.getAttribute('aria-label');
        trackEvent('social_click', {
            social_network: network
        });
    });
});

// Rastrear cliques em links de streaming
document.querySelectorAll('.stream-button').forEach(button => {
    button.addEventListener('click', () => {
        const platform = button.classList.contains('spotify') ? 'Spotify' : 'Apple Music';
        trackEvent('streaming_click', {
            platform: platform
        });
    });
});

// Rastrear envios de formulário de contato
const contactForm = document.querySelector('#contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', () => {
        trackEvent('form_submission', {
            form_type: 'contact'
        });
    });
}

// Rastrear tempo de permanência na página
let startTime = new Date();
window.addEventListener('beforeunload', () => {
    const endTime = new Date();
    const timeSpent = Math.round((endTime - startTime) / 1000);
    
    trackEvent('page_time', {
        seconds: timeSpent,
        page: window.location.pathname
    });
});
