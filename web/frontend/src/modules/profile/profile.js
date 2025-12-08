const menuToggle = document.getElementById('menuToggle');
const sidebar = document.getElementById('sidebar');
const mainContainer = document.getElementById('mainContainer');

let sidebarExpanded = false;

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

function loadUserData() {
    console.log('Carregando dados do usuário...', user);
    
    if (user && user[0]) {
        const userData = user[0];
        
        // Avatar
        const profileAvatar = document.getElementById('profileAvatar');
        const initials = userData.name.charAt(0) + userData.last_name.charAt(0);
        profileAvatar.innerHTML = `${initials}
            <div class="avatar-edit">
                <i class="fas fa-camera"></i>
            </div>`;
        
        // Informações básicas
        document.getElementById('profileName').textContent = `${userData.name} ${userData.last_name}`;
        document.getElementById('profileRole').textContent = userData.function;
        document.getElementById('profileBio').textContent = userData.bio;
        
        // Estatísticas
        document.getElementById('totalClients').textContent = userData.totaClients;
        document.getElementById('activeClients').textContent = userData.activeClients;
        document.getElementById('totalComission').textContent = `R$ ${userData.comission.toLocaleString()}`;
        
        // Formulário
        document.getElementById('firstName').value = userData.name;
        document.getElementById('lastName').value = userData.last_name;
        document.getElementById('email').value = userData.email;
        document.getElementById('phone').value = userData.cellphone;
        document.getElementById('bio').value = userData.bio;
        
        // Atividades
        loadUserActivities(userData.activity);
    } else {
        showNotification('Erro ao carregar dados do usuário', 'error');
    }
}

function loadUserActivities(activities) {
    const activityList = document.getElementById('recentActivity');
    activityList.innerHTML = '';
    
    if (activities && activities.length > 0) {
        activities.forEach(activity => {
            const activityItem = document.createElement('li');
            activityItem.className = 'activity-item';
            
            // Determinar ícone
            let iconClass = 'fas fa-info-circle';
            if (activity.title.includes('adicionado') || activity.title.includes('novo')) iconClass = 'fas fa-user-plus';
            if (activity.title.includes('atualizou') || activity.title.includes('modificadas')) iconClass = 'fas fa-edit';
            if (activity.title.includes('concluído') || activity.title.includes('finalizado')) iconClass = 'fas fa-check-circle';
            if (activity.title.includes('contato')) iconClass = 'fas fa-comment';
            
            // Calcular tempo relativo
            const activityDate = new Date(activity.date);
            const now = new Date();
            const diffTime = Math.abs(now - activityDate);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
            
            let timeText = '';
            if (diffHours < 24) {
                timeText = diffHours === 1 ? '1 hora atrás' : `${diffHours} horas atrás`;
            } else if (diffDays === 1) {
                timeText = '1 dia atrás';
            } else {
                timeText = `${diffDays} dias atrás`;
            }
            
            activityItem.innerHTML = `
                <div class="activity-icon">
                    <i class="${iconClass}"></i>
                </div>
                <div class="activity-content">
                    <div class="activity-title">${activity.title}</div>
                    <div class="activity-description">${activity.description || ''}</div>
                </div>
                <div class="activity-time">${timeText}</div>
            `;
            
            activityList.appendChild(activityItem);
        });
    } else {
        activityList.innerHTML = `
            <li class="activity-item">
                <div class="activity-icon">
                    <i class="fas fa-info-circle"></i>
                </div>
                <div class="activity-content">
                    <div class="activity-title">Nenhuma atividade recente</div>
                    <div class="activity-description">Suas atividades aparecerão aqui</div>
                </div>
                <div class="activity-time">-</div>
            </li>
        `;
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Carregado');
    
    const profileForm = document.getElementById('profileForm');
    if (profileForm) {
        profileForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (user && user[0]) {
                user[0].name = document.getElementById('firstName').value;
                user[0].last_name = document.getElementById('lastName').value;
                user[0].email = document.getElementById('email').value;
                user[0].cellphone = document.getElementById('phone').value;
                user[0].bio = document.getElementById('bio').value;
                
                const newActivity = {
                    date: new Date().toISOString(),
                    title: "Perfil atualizado",
                    description: "Informações pessoais modificadas"
                };
                
                if (!user[0].activity) user[0].activity = [];
                user[0].activity.unshift(newActivity);
                
                loadUserData();
                showNotification('Perfil atualizado com sucesso!', 'success');
            }
        });
    }

    const cancelBtn = document.querySelector('.cancel-btn');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', function() {
            loadUserData();
            showNotification('Alterações descartadas', 'info');
        });
    }

    document.addEventListener('click', function(e) {
        if (e.target.closest('.avatar-edit')) {
            showNotification('Funcionalidade de edição de avatar em desenvolvimento', 'info');
        }
    });

    // Inicialização
    setTimeout(() => {
        loadUserData();
    }, 500);
});

// Função de notificação
function showNotification(message, type = 'info') {
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

// Sidebar functionality
if (menuToggle) {
    menuToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleSidebar();
    });
}

document.querySelectorAll('.sidebar nav a').forEach(link => {
    link.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
            sidebar.classList.remove('active');
        }
    });
});