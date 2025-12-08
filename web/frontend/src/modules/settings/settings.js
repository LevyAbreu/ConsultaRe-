const menuToggle = document.getElementById('menuToggle');
const sidebar = document.getElementById('sidebar');
const mainContainer = document.getElementById('mainContainer');

let sidebarExpanded = false;

// Configurações padrão
const defaultSettings = {
    theme: 'dark',
    accentColor: 'primary',
    autoLogin: true,
    notifications: true
};

// Carregar configurações do localStorage
function loadSettings() {
    const savedSettings = localStorage.getItem('consultrack-settings');
    return savedSettings ? JSON.parse(savedSettings) : defaultSettings;
}

// Salvar configurações no localStorage
function saveSettings(settings) {
    localStorage.setItem('consultrack-settings', JSON.stringify(settings));
    applySettings(settings);
}

// Aplicar configurações na interface
function applySettings(settings) {
    console.log('Aplicando configurações:', settings);
    
    // Aplicar tema
    document.body.setAttribute('data-theme', settings.theme);
    
    // Aplicar cor de destaque
    document.documentElement.style.setProperty('--color-primary', getAccentColor(settings.accentColor));
    
    // Aplicar toggles
    document.querySelectorAll('.toggle-switch input').forEach(toggle => {
        const settingTitle = toggle.closest('.setting-item').querySelector('.setting-title').textContent;
        
        if (settingTitle === 'Modo Escuro') {
            toggle.checked = settings.theme === 'dark';
        } else if (settingTitle === 'Login Automático') {
            toggle.checked = settings.autoLogin;
        }
    });
    
    // Aplicar cor ativa
    document.querySelectorAll('.color-option').forEach(option => {
        option.classList.remove('active');
        if (option.dataset.color === settings.accentColor) {
            option.classList.add('active');
        }
    });
}

// Obter cor hexadecimal baseada na cor selecionada
function getAccentColor(colorName) {
    const colors = {
        primary: '#7a5cff',
        green: '#2ecc71',
        blue: '#3498db',
        orange: '#e67e22'
    };
    return colors[colorName] || colors.primary;
}

// Inicializar configurações
function initializeSettings() {
    const settings = loadSettings();
    applySettings(settings);
}

// Toggle sidebar
function toggleSidebar() {
    sidebarExpanded = !sidebarExpanded;
    
    if (sidebarExpanded) {
        sidebar.classList.add('expanded');
        mainContainer.classList.add('sidebar-expanded');
    } else {
        sidebar.classList.remove('expanded');
        mainContainer.classList.remove('sidebar-expanded');
    }
}

// Modal de mudança de senha
function showChangePasswordModal() {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3><i class="fas fa-lock"></i> Alterar Senha</h3>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                <form id="changePasswordForm">
                    <div class="form-group">
                        <label for="currentPassword">Senha Atual</label>
                        <input type="password" id="currentPassword" required>
                    </div>
                    <div class="form-group">
                        <label for="newPassword">Nova Senha</label>
                        <input type="password" id="newPassword" required minlength="6">
                    </div>
                    <div class="form-group">
                        <label for="confirmPassword">Confirmar Nova Senha</label>
                        <input type="password" id="confirmPassword" required>
                    </div>
                    <div class="form-actions">
                        <button type="button" class="cancel-btn modal-cancel">Cancelar</button>
                        <button type="submit" class="auth-button">Alterar Senha</button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Fechar modal
    const closeModal = () => modal.remove();
    
    modal.querySelector('.modal-close').addEventListener('click', closeModal);
    modal.querySelector('.modal-cancel').addEventListener('click', closeModal);
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Enviar formulário
    modal.querySelector('#changePasswordForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const currentPassword = document.getElementById('currentPassword').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        if (newPassword !== confirmPassword) {
            showNotification('As senhas não coincidem', 'error');
            return;
        }
        
        if (newPassword.length < 6) {
            showNotification('A senha deve ter pelo menos 6 caracteres', 'error');
            return;
        }
        
        // Simular alteração de senha
        showNotification('Senha alterada com sucesso!', 'success');
        closeModal();
    });
}

// Exportar dados
function exportData() {
    const settings = loadSettings();
    const userData = {
        settings: settings,
        exportDate: new Date().toISOString(),
        version: '1.0'
    };
    
    const dataStr = JSON.stringify(userData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `consultrack-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    showNotification('Dados exportados com sucesso!', 'success');
}

// Função para mostrar notificações
function showNotification(message, type = 'info') {
    // Remover notificações existentes
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#d4edda' : type === 'error' ? '#f8d7da' : '#d1ecf1'};
        color: ${type === 'success' ? '#155724' : type === 'error' ? '#721c24' : '#0c5460'};
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 350px;
        border-left: 4px solid ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#17a2b8'};
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Inicializar quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Carregado - Inicializando configurações');
    
    // Inicializar configurações
    initializeSettings();
    
    // Sidebar toggle
    if (menuToggle) {
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleSidebar();
        });
    }

    // Configurações de cor
    document.querySelectorAll('.color-option').forEach(option => {
        option.addEventListener('click', function() {
            document.querySelectorAll('.color-option').forEach(opt => {
                opt.classList.remove('active');
            });
            this.classList.add('active');
            
            const settings = loadSettings();
            settings.accentColor = this.dataset.color;
            saveSettings(settings);
            
            showNotification('Cor do tema alterada com sucesso!', 'success');
        });
    });

    // Configurações de toggle
    document.querySelectorAll('.toggle-switch input').forEach(toggle => {
        toggle.addEventListener('change', function() {
            const settingTitle = this.closest('.setting-item').querySelector('.setting-title').textContent;
            const settings = loadSettings();
            
            if (settingTitle === 'Modo Escuro') {
                settings.theme = this.checked ? 'dark' : 'light';
            } else if (settingTitle === 'Login Automático') {
                settings.autoLogin = this.checked;
            }
            
            saveSettings(settings);
            
            const status = this.checked ? 'ativada' : 'desativada';
            showNotification(`${settingTitle} ${status}`, 'info');
        });
    });

    // Botão de mudar senha
    const passwordBtn = document.getElementById('passwordBtn');
    if (passwordBtn) {
        passwordBtn.addEventListener('click', function() {
            showChangePasswordModal();
        });
    }

    // Botão de exportar dados
    const exportBtn = document.querySelector('.auth-button[style*="background: var(--color-btn-secondary)"]');
    if (exportBtn) {
        exportBtn.addEventListener('click', function() {
            exportData();
        });
    }

    // Botão de excluir conta
    const deleteBtn = document.querySelector('.danger-button');
    if (deleteBtn) {
        deleteBtn.addEventListener('click', function() {
            if (confirm('Tem certeza que deseja excluir sua conta? Esta ação é irreversível e todos os seus dados serão perdidos.')) {
                showNotification('Solicitação de exclusão de conta enviada', 'info');
                // Aqui você implementaria a lógica real de exclusão de conta
                setTimeout(() => {
                    showNotification('Conta excluída com sucesso. Redirecionando...', 'success');
                    setTimeout(() => {
                        window.location.href = '../index.html';
                    }, 2000);
                }, 2000);
            }
        });
    }

    // Fechar sidebar ao clicar em um link (em dispositivos móveis)
    document.querySelectorAll('.sidebar nav a').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                sidebar.classList.remove('active');
            }
        });
    });
});