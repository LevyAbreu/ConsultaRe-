import { 
    renderClients, 
    showClientDetails,
    enableClientEdit,
    cancelClientEdit,
    renderFilteredClients,
    saveClientEdit
} from './modules/clients/clientRenderer.js';
import {
    editClient,
    archiveClient,
    unarchiveClient,
    addNewClient
} from './modules/clients/clientService.js';

import { user, clientes } from './data/mockData.js';
import { getInitials } from './utils/helpers.js';
import { closeClientSidebar } from './components/uiManager.js';

let clientsGrid, btnAddClient, addClientModal, closeModal, cancelAdd, clientForm;
let profilePanel, clientAvatar, clientName, clientService, clientDetails, sidebar, mainContainer;
let clientDetailsSidebar, sidebarOverlay, clientDetailsContent;

let panelActive = false;
export let currentEditingClient = null;
export let isEditingMode = false;

window.editClient = editClient; 
window.archiveClient = archiveClient;
window.unarchiveClient = unarchiveClient;
window.addNewClient = addNewClient;
window.enableClientEdit = enableClientEdit;
window.cancelClientEdit = cancelClientEdit;
window.saveClientEdit = saveClientEdit;
window.renderFilteredClients = renderFilteredClients;
window.showClientDetails = showClientDetails;

function initializeDOMElements() {
    clientsGrid = document.getElementById('clientsGrid');
    btnAddClient = document.getElementById('addBtn');
    addClientModal = document.getElementById('addClientModal');
    closeModal = document.getElementById('closeModal');
    cancelAdd = document.getElementById('cancelAdd');
    clientForm = document.getElementById('clientForm');

    profilePanel = document.getElementById('profilePanel');
    clientAvatar = document.getElementById('clientAvatar');
    clientName = document.getElementById('clientName');
    clientService = document.getElementById('clientService');
    clientDetails = document.getElementById('clientDetails');
    sidebar = document.getElementById('sidebar');
    mainContainer = document.getElementById('mainContainer');

    clientDetailsSidebar = document.getElementById('clientDetailsSidebar');
    sidebarOverlay = document.getElementById('sidebarOverlay');
    clientDetailsContent = document.getElementById('clientDetailsContent');
}

function initializeEventListeners() {
    if (btnAddClient) {
        btnAddClient.addEventListener('click', () => {
            if (addClientModal) addClientModal.style.display = 'flex';
            
            if (clientForm) {
                clientForm.onsubmit = addNewClient;
                const submitBtn = clientForm.querySelector('button[type="submit"]');
                if (submitBtn) submitBtn.textContent = 'Adicionar Cliente';
            }
        });
    }

    if (closeModal) {
        closeModal.addEventListener('click', () => {
            if (addClientModal) addClientModal.style.display = 'none';
            if (clientForm) clientForm.reset();
        });
    }

    if (cancelAdd) {
        cancelAdd.addEventListener('click', () => {
            if (addClientModal) addClientModal.style.display = 'none';
            if (clientForm) clientForm.reset();
        });
    }

    window.addEventListener('click', (event) => {
        if (addClientModal && event.target === addClientModal) {
            addClientModal.style.display = 'none';
            if (clientForm) clientForm.reset();
        }
    });

    const closeSidebarBtn = document.getElementById('closeClientSidebar');
    if (closeSidebarBtn) {
        closeSidebarBtn.addEventListener('click', closeClientSidebar);
    }
    if (sidebarOverlay) {
        sidebarOverlay.addEventListener('click', closeClientSidebar);
    }
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeClientSidebar();
        }
    });
    
    document.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', function() {
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            const filter = this.textContent.trim();
            let filteredClients = clientes;
            
            switch(filter) {
            case 'Todos os leads':
                filteredClients = clientes.filter(c => c.status !== 'Arquivado');
                break;
            case 'Novos':
                filteredClients = clientes.filter(c => c.status === 'Em consulta');
                break;
            case 'Em Andamento':
                filteredClients = clientes.filter(c => 
                    ['Em proposta', 'Contratado', 'Pós venda'].includes(c.status)
                );
                break;
                    case 'Finalizado':
                        filteredClients = clientes.filter(c => c.status === 'Finalizado');
                        break;
                    case 'Concluídos':
                        filteredClients = clientes.filter(c => c.status === 'Finalizado');
                        break;
                    case 'Arquivados':
                        filteredClients = clientes.filter(c => c.status === 'Arquivado');
                        break;
                    default:
                        filteredClients = clientes.filter(c => c.status !== 'Arquivado');
                }
            
            console.log(`Filtro: ${filter}, Clientes encontrados: ${filteredClients.length}`);
            renderFilteredClients(filteredClients);
        });
    });

    document.querySelectorAll('.sidebar nav a').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768 && sidebar) {
                sidebar.classList.remove('active');
            }
        });
    });
}

function loadSidebarProfile() {
    if (user && user[0]) {
        const userData = user[0];
        
        const sidebarInitials = document.getElementById('sidebarUserInitials');
        if (sidebarInitials) {
            const initials = getInitials(`${userData.name} ${userData.last_name}`);
            sidebarInitials.textContent = initials;
        }
        
        const sidebarName = document.getElementById('sidebarUserName');
        if (sidebarName) {
            sidebarName.textContent = `${userData.name} ${userData.last_name}`;
        }
        
        const sidebarRole = document.getElementById('sidebarUserRole');
        if (sidebarRole) {
            sidebarRole.textContent = userData.function;
        }
    }
}

function loadProfileData() {
    if (user && user[0]) {
        const userData = user[0];
        
        const profileNameEl = document.getElementById('profileName');
        const profileRoleEl = document.getElementById('profileRole');
        const profileBioEl = document.getElementById('profileBio');
        const profileAvatarEl = document.getElementById('profileAvatar');
        
        if (profileNameEl) profileNameEl.textContent = `${userData.name} ${userData.last_name}`;
        if (profileRoleEl) profileRoleEl.textContent = userData.function;
        if (profileBioEl) profileBioEl.textContent = userData.bio;

        if (profileAvatarEl) {
            const initials = getInitials(`${userData.name} ${userData.last_name}`);
            profileAvatarEl.innerHTML = `<span style="font-size: 2rem;">${initials}</span>`;
            profileAvatarEl.style.display = 'flex';
            profileAvatarEl.style.alignItems = 'center';
            profileAvatarEl.style.justifyContent = 'center';
            profileAvatarEl.style.backgroundColor = 'var(--color-primary)';
            profileAvatarEl.style.color = 'white';
        }
        
        const totalClientsEl = document.getElementById('totalClients');
        const activeClientsEl = document.getElementById('activeClients');
        const totalComissionEl = document.getElementById('totalComission');
        
        if (totalClientsEl) totalClientsEl.textContent = userData.totaClients || 0;
        if (activeClientsEl) activeClientsEl.textContent = userData.activeClients || 0;
        if (totalComissionEl) totalComissionEl.textContent = `R$ ${userData.comission.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;

        const firstNameEl = document.getElementById('firstName');
        const lastNameEl = document.getElementById('lastName');
        const emailEl = document.getElementById('email');
        const phoneEl = document.getElementById('phone');
        const roleEl = document.getElementById('role');
        const enterpriseEl = document.getElementById('enterprise');
        const bioFormEl = document.getElementById('bio');
        
        if (firstNameEl) firstNameEl.value = userData.name;
        if (lastNameEl) lastNameEl.value = userData.last_name;
        if (emailEl) emailEl.value = userData.email;
        if (phoneEl) phoneEl.value = userData.cellphone;
        if (roleEl) roleEl.value = userData.function;
        if (enterpriseEl) enterpriseEl.value = userData.enterprise;
        if (bioFormEl) bioFormEl.value = userData.bio;

        const recentActivityEl = document.getElementById('recentActivity');
        if (recentActivityEl) {
            recentActivityEl.innerHTML = ''; 
            
            userData.activity.forEach(item => {
                const li = document.createElement('li');
                li.className = 'activity-item';
                
                const dateObj = new Date(item.date);
                const timeString = dateObj.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
                const dateString = dateObj.toLocaleDateString('pt-BR');

                let iconClass = 'fas fa-cogs'; 
                if (item.title.includes('cliente')) {
                    iconClass = 'fas fa-user-plus';
                } else if (item.title.includes('Perfil')) {
                    iconClass = 'fas fa-user-edit';
                } else if (item.title.includes('Serviço concluído')) {
                    iconClass = 'fas fa-check-circle';
                } else if (item.title.includes('contato')) {
                    iconClass = 'fas fa-phone-alt';
                }

                li.innerHTML = `
                    <div class="activity-icon">
                        <i class="${iconClass}"></i>
                    </div>
                    <div class="activity-content">
                        <div class="activity-title">${item.title}</div>
                        <div class="activity-description">${item.description}</div>
                    </div>
                    <div class="activity-time">${dateString} - ${timeString}</div>
                `;
                recentActivityEl.appendChild(li);
            });
        }

    } else {
        console.error("Dados do usuário não encontrados.");
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initializeDOMElements();
    initializeEventListeners();
    loadSidebarProfile();
    loadProfileData();
    renderClients();
});
