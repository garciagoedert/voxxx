document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;

    // Validação em tempo real
    const inputs = contactForm.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', () => {
            if (input.classList.contains('invalid')) {
                validateField.call(input);
            }
        });
    });

    // Validação do formulário no envio
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            showNotification('Por favor, preencha todos os campos corretamente.', 'error');
            return;
        }

        const submitButton = contactForm.querySelector('.submit-button');
        const originalText = submitButton.innerHTML;
        
        try {
            // Desabilitar botão e mostrar loading
            submitButton.disabled = true;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';

            // Simular envio do formulário (aqui você adicionaria a lógica real de envio)
            await simulateFormSubmission();

            // Mostrar mensagem de sucesso
            showNotification('Mensagem enviada com sucesso! Entraremos em contato em breve.', 'success');
            
            // Limpar formulário
            contactForm.reset();

        } catch (error) {
            // Mostrar mensagem de erro
            showNotification('Erro ao enviar mensagem. Por favor, tente novamente.', 'error');
            
        } finally {
            // Restaurar botão
            submitButton.disabled = false;
            submitButton.innerHTML = originalText;
        }
    });
});

// Funções de validação
function validateField() {
    const field = this;
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';

    // Remover mensagens de erro existentes
    const existingError = field.parentElement.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }

    // Validações específicas por tipo de campo
    switch (field.id) {
        case 'name':
            if (value.length < 3) {
                isValid = false;
                errorMessage = 'Nome deve ter pelo menos 3 caracteres';
            }
            break;

        case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'E-mail inválido';
            }
            break;

        case 'subject':
            if (!value) {
                isValid = false;
                errorMessage = 'Por favor, selecione um assunto';
            }
            break;

        case 'message':
            if (value.length < 10) {
                isValid = false;
                errorMessage = 'Mensagem deve ter pelo menos 10 caracteres';
            }
            break;
    }

    // Atualizar classes e mostrar mensagem de erro se necessário
    if (!isValid) {
        field.classList.add('invalid');
        field.classList.remove('valid');
        
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.textContent = errorMessage;
        field.parentElement.appendChild(errorElement);
    } else {
        field.classList.remove('invalid');
        field.classList.add('valid');
    }

    return isValid;
}

function validateForm() {
    const inputs = document.querySelectorAll('#contact-form input, #contact-form textarea, #contact-form select');
    let isValid = true;

    inputs.forEach(input => {
        if (!validateField.call(input)) {
            isValid = false;
        }
    });

    return isValid;
}

// Sistema de notificações
function showNotification(message, type) {
    // Remover notificações existentes
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Criar nova notificação
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            <span>${message}</span>
        </div>
    `;

    // Adicionar ao DOM
    document.body.appendChild(notification);

    // Animar entrada
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);

    // Remover após 5 segundos
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
}

// Simulação de envio do formulário (remover em produção)
function simulateFormSubmission() {
    return new Promise((resolve) => {
        setTimeout(resolve, 2000);
    });
}

// Adicionar estilos dinâmicos para as notificações
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        border-radius: 5px;
        background: rgba(0, 0, 0, 0.9);
        color: white;
        transform: translateX(120%);
        transition: transform 0.3s ease;
        z-index: 1000;
        max-width: 350px;
    }

    .notification.show {
        transform: translateX(0);
    }

    .notification-content {
        display: flex;
        align-items: center;
        gap: 10px;
    }

    .notification.success {
        border-left: 4px solid #4CAF50;
    }

    .notification.error {
        border-left: 4px solid #f44336;
    }

    .notification i {
        font-size: 1.2rem;
    }

    .notification.success i {
        color: #4CAF50;
    }

    .notification.error i {
        color: #f44336;
    }

    .error-message {
        color: #f44336;
        font-size: 0.9rem;
        margin-top: 5px;
        display: flex;
        align-items: center;
        gap: 5px;
    }

    .error-message::before {
        content: '⚠';
    }

    @media (max-width: 768px) {
        .notification {
            left: 20px;
            right: 20px;
            max-width: none;
        }
    }
`;

document.head.appendChild(notificationStyles);
