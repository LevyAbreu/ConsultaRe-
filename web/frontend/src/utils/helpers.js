export function formatDate(dateString) {
    if (!dateString) return 'Não definida';
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('pt-BR', options);
}

export function getInitials(name) {
    return name.split(' ').map(word => word[0]).join('').toUpperCase();
}

export function showNotification(message, type = 'info') {
    // Criar elemento de notificação
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Adicionar estilos para a notificação
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? 'var(--color-bg-success)' : type === 'error' ? 'var(--color-bg-danger)' : 'var(--color-bg-card)'};
        color: ${type === 'success' ? 'var(--color-text-success)' : type === 'error' ? 'var(--color-text-danger)' : 'var(--color-text-primary)'};
        padding: 15px 20px;
        border-radius: var(--border-radius);
        box-shadow: var(--shadow);
        z-index: 1000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 350px;
        border-left: 4px solid ${type === 'success' ? 'var(--color-text-success)' : type === 'error' ? 'var(--color-text-danger)' : 'var(--color-primary)'};
    `;
    
    document.body.appendChild(notification);
    
    // Animação de entrada
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remover após 3 segundos
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}