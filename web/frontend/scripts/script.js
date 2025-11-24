const user = [
    {
        name: "Arianne",
        last_name: "Abreu", 
        function: "Consultor Financeiro"
    }
];

const clientes = [
    {
        id: 1,
        nome: "Loren Ipsum Silva",
        cpf: "000.000.000-00",
        cnpj: "",
        razao_social: "",
        telefone: "(99) 99999-9999",
        origem_cliente: "Instagram",
        servico: "Limpa Nome",
        data_inicio_atendimento: "2025-10-15",
        objetivo: "Comprar um carro",
        status: "Em consulta",
        
        // Etapa 1: Consulta
        consulta_realizada: true,
        data_consulta: "2025-10-16",
        data_pagamento_consulta: "2025-10-16",
        valor_consulta: 59.90,
        comissao_consulta: 39.90,
        data_ligacao_proposta: "2025-10-17",
        associado_responsavel: "Arianne Abreu",
        proposta_enviada: true,
        valor_proposta: 1500.00,
        
        // Etapa 2: Entrada
        data_pagamento_entrada: "2025-10-20",
        tipo_pagamento: "parcelado",
        valor_entrada: 750.00,
        
        // Etapa 3: Resultado
        data_entrega_resultado: "2025-11-30",
        descricao_resultado: "Dívidas suspensas e score aumentado em 150 pontos",
        data_pagamento_final: "2025-12-05",
        
        // Etapa 4: Pós-venda
        cadastro_positivo_realizado: true,
        atualizacao_cadastral_realizada: true,
        conexao_bancaria_realizada: false,
        envio_cartilha: false,
        entrega_resultado: false,
        comissao_pos_venda: 450.00
    }, 
    {
        id: 2,
        nome: "Empresa XYZ Ltda",
        cpf: "",
        cnpj: "12.345.678/0001-90",
        razao_social: "Empresa XYZ Comércio Ltda",
        telefone: "(99) 88888-8888",
        origem_cliente: "Site",
        servico: "Rating",
        data_inicio_atendimento: "2025-10-18",
        objetivo: "Melhorar rating para financiamento",
        status: "Em proposta",
        
        // Etapa 1: Consulta
        consulta_realizada: true,
        data_consulta: "2025-10-19",
        data_pagamento_consulta: "2025-10-19",
        valor_consulta: 59.90,
        comissao_consulta: 39.90,
        data_ligacao_proposta: "2025-10-20",
        associado_responsavel: "Arianne Abreu",
        proposta_enviada: true,
        valor_proposta: 2000.00,
        
        // Etapa 2: Entrada
        data_pagamento_entrada: "",
        tipo_pagamento: "",
        valor_entrada: 0.00,
        
        // Etapa 3: Resultado
        data_entrega_resultado: "",
        descricao_resultado: "",
        data_pagamento_final: "",
        
        // Etapa 4: Pós-venda
        cadastro_positivo_realizado: false,
        atualizacao_cadastral_realizada: false,
        conexao_bancaria_realizada: false,
        envio_cartilha: false,
        entrega_resultado: false,
        comissao_pos_venda: 0.00
    }
];

// Variáveis globais
let clientsGrid, btnAddClient, addClientModal, closeModal, cancelAdd, clientForm;
let profilePanel, clientAvatar, clientName, clientService, clientDetails, sidebar, mainContainer;
let clientDetailsSidebar, sidebarOverlay, clientDetailsContent;
let panelActive = false;
let currentEditingClient = null;
let isEditingMode = false;

// Função para inicializar elementos DOM
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
    
    // Novos elementos do sidebar de detalhes
    clientDetailsSidebar = document.getElementById('clientDetailsSidebar');
    sidebarOverlay = document.getElementById('sidebarOverlay');
    clientDetailsContent = document.getElementById('clientDetailsContent');
}

// Função para carregar perfil no sidebar
function loadSidebarProfile() {
    if (user && user[0]) {
        const userData = user[0];
        
        // Iniciais do avatar
        const sidebarInitials = document.getElementById('sidebarUserInitials');
        if (sidebarInitials) {
            const initials = userData.name.charAt(0) + userData.last_name.charAt(0);
            sidebarInitials.textContent = initials;
        }
        
        // Nome e função
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

function togglePanel(show = true) {
    if (!profilePanel) return;
    
    panelActive = show;
    
    if (show) {
        profilePanel.classList.add('active');
        if (mainContainer) mainContainer.classList.add('with-panel');
    } else {
        profilePanel.classList.remove('active');
        if (mainContainer) mainContainer.classList.remove('with-panel');
    }
}

function renderClients() {
    if (!clientsGrid) return;
    
    clientsGrid.innerHTML = '';
    
    if (clientes.length === 0) {
        clientsGrid.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-users"></i>
                <h3>Nenhum cliente cadastrado</h3>
                <p>Adicione seu primeiro cliente clicando no botão "Add Lead"</p>
            </div>
        `;
        return;
    }
    
    clientes.forEach(cliente => {
        const card = document.createElement('div');
        card.className = 'card';
        card.dataset.id = cliente.id;
        
        let statusClass = 'status-new';
        if (cliente.status === 'Em proposta') statusClass = 'status-progress';
        if (cliente.status === 'Contratado') statusClass = 'status-progress';
        if (cliente.status === 'Pós venda') statusClass = 'status-progress';
        if (cliente.status === 'Finalizado') statusClass = 'status-completed';
        
        card.innerHTML = `
            <div class="card-header">
                <div class="client-name">${cliente.nome}</div>
                <div class="client-status ${statusClass}">${cliente.status}</div>
            </div>
            <div class="client-info">
                <div class="client-date">
                    <i class="far fa-calendar"></i>
                    Primeiro contato: ${formatDate(cliente.data_inicio_atendimento)}
                </div>
                <div class="client-service">
                    <i class="fas fa-briefcase"></i>
                    ${cliente.servico}
                </div>
            </div>
            <div class="card-footer">
                <div class="client-origin">
                    <i class="fas fa-tag"></i>
                    ${cliente.origem_cliente}
                </div>
                <div class="client-actions">
                    <button class="action-btn" title="Editar" onclick="event.stopPropagation(); editClient(${cliente.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn" title="Arquivar" onclick="event.stopPropagation(); archiveClient(${cliente.id})">
                        <i class="fas fa-archive"></i>
                    </button>
                </div>
            </div>
        `;
        
        // Torna o card inteiro clicável para abrir os detalhes
        card.style.cursor = 'pointer';
        card.addEventListener('click', () => {
            showClientDetails(cliente);
        });
        
        clientsGrid.appendChild(card);
    });
}

// Função para obter iniciais do nome
function getInitials(name) {
    return name.split(' ').map(word => word[0]).join('').toUpperCase();
}

function showClientDetails(cliente) {
    if (!clientDetailsContent) return;
    
    currentEditingClient = cliente;
    isEditingMode = false;
    
    const totalComissao = cliente.comissao_consulta + (cliente.comissao_pos_venda || 0);
    const totalRecebido = cliente.valor_consulta + cliente.valor_entrada + (cliente.data_pagamento_final ? cliente.valor_proposta - cliente.valor_entrada : 0);
    
    // Cálculo das comissões
    const comissaoEntrada = cliente.valor_entrada * 0.20; // 20% da entrada
    const comissaoConsulta = cliente.valor_consulta - 30; // Todo o restante acima de R$ 30
    
    // Mostrar razão social se tiver CNPJ
    const nomeDisplay = cliente.cnpj && cliente.razao_social ? 
        `${cliente.nome}<br><small style="color: #666;">${cliente.razao_social}</small>` : 
        cliente.nome;

    clientDetailsContent.innerHTML = `
    
        <!-- Seção Consulta -->
        <div class="details-section">
            <div class="section-header">Consulta</div>
            <div class="section-content">
                <div class="detail-row">
                    <span class="detail-label">Nome Completo</span>
                    <span class="detail-value" id="detail-nome">${nomeDisplay}</span>
                    <input type="text" class="detail-input" id="edit-nome" value="${cliente.nome}" style="display: none;">
                </div>
                <div class="detail-row">
                    <span class="detail-label">Telefone</span>
                    <span class="detail-value" id="detail-telefone">${cliente.telefone}</span>
                    <input type="text" class="detail-input" id="edit-telefone" value="${cliente.telefone}" style="display: none;">
                </div>
                <div class="detail-row">
                    <span class="detail-label">CPF</span>
                    <span class="detail-value" id="detail-cpf">${cliente.cpf}</span>
                    <input type="text" class="detail-input" id="edit-cpf" value="${cliente.cpf}" style="display: none;">
                </div>
                <div class="detail-row">
                    <span class="detail-label">CNPJ</span>
                    <span class="detail-value ${!cliente.cnpj ? 'none' : ''}" id="detail-cnpj">${cliente.cnpj || 'None'}</span>
                    <input type="text" class="detail-input" id="edit-cnpj" value="${cliente.cnpj}" style="display: none;">
                </div>
                <div class="detail-row">
                    <span class="detail-label">Razão Social</span>
                    <span class="detail-value ${!cliente.razao_social ? 'none' : ''}" id="detail-razao_social">${cliente.razao_social || 'None'}</span>
                    <input type="text" class="detail-input" id="edit-razao_social" value="${cliente.razao_social}" style="display: none;">
                </div>
                <div class="detail-row">
                    <span class="detail-label">Origem da Prospecção</span>
                    <span class="detail-value" id="detail-origem_cliente">${cliente.origem_cliente}</span>
                    <select class="detail-input" id="edit-origem_cliente" style="display: none;">
                        <option value="Instagram" ${cliente.origem_cliente === 'Instagram' ? 'selected' : ''}>Instagram</option>
                        <option value="Facebook" ${cliente.origem_cliente === 'Facebook' ? 'selected' : ''}>Facebook</option>
                        <option value="Site" ${cliente.origem_cliente === 'Site' ? 'selected' : ''}>Site</option>
                        <option value="Indicação" ${cliente.origem_cliente === 'Indicação' ? 'selected' : ''}>Indicação</option>
                        <option value="Outro" ${cliente.origem_cliente === 'Outro' ? 'selected' : ''}>Outro</option>
                    </select>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Serviço</span>
                    <span class="detail-value" id="detail-servico">${cliente.servico}</span>
                    <select class="detail-input" id="edit-servico" style="display: none;">
                        <option value="Limpa Nome" ${cliente.servico === 'Limpa Nome' ? 'selected' : ''}>Limpa Nome</option>
                        <option value="Rating" ${cliente.servico === 'Rating' ? 'selected' : ''}>Rating</option>
                        <option value="Limpa Bacen" ${cliente.servico === 'Limpa Bacen' ? 'selected' : ''}>Limpa Bacen</option>
                        <option value="Empréstimo" ${cliente.servico === 'Empréstimo' ? 'selected' : ''}>Empréstimo</option>
                    </select>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Data de Início</span>
                    <span class="detail-value" id="detail-data_inicio_atendimento">${formatDate(cliente.data_inicio_atendimento)}</span>
                    <input type="date" class="detail-input" id="edit-data_inicio_atendimento" value="${cliente.data_inicio_atendimento}" style="display: none;">
                </div>
                <div class="detail-row">
                    <span class="detail-label">Status</span>
                    <span class="detail-value">
                        <span class="status-badge ${cliente.status.toLowerCase().replace(' ', '')}" id="detail-status">
                            ${cliente.status}
                        </span>
                    </span>
                    <select class="detail-input" id="edit-status" style="display: none;">
                        <option value="Em consulta" ${cliente.status === 'Em consulta' ? 'selected' : ''}>Em consulta</option>
                        <option value="Em proposta" ${cliente.status === 'Em proposta' ? 'selected' : ''}>Em proposta</option>
                        <option value="Contratado" ${cliente.status === 'Contratado' ? 'selected' : ''}>Contratado</option>
                        <option value="Pós venda" ${cliente.status === 'Pós venda' ? 'selected' : ''}>Pós venda</option>
                        <option value="Finalizado" ${cliente.status === 'Finalizado' ? 'selected' : ''}>Finalizado</option>
                    </select>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Objetivo</span>
                    <span class="detail-value" id="detail-objetivo">${cliente.objetivo}</span>
                    <input type="text" class="detail-input" id="edit-objetivo" value="${cliente.objetivo}" style="display: none;">
                </div>
                <div class="detail-row">
                    <span class="detail-label">Valor da Consulta</span>
                    <span class="detail-value" id="detail-valor_consulta">R$ ${cliente.valor_consulta.toFixed(2)}</span>
                    <input type="number" step="0.01" class="detail-input" id="edit-valor_consulta" value="${cliente.valor_consulta}" style="display: none;">
                </div>
            </div>
        </div>

        <!-- Seção Contrato -->
        <div class="details-section">
            <div class="section-header">Contrato</div>
            <div class="section-content">
                <div class="detail-row">
                    <span class="detail-label">Valor da Proposta</span>
                    <span class="detail-value" id="detail-valor_proposta">R$ ${cliente.valor_proposta.toFixed(2)}</span>
                    <input type="number" step="0.01" class="detail-input" id="edit-valor_proposta" value="${cliente.valor_proposta}" style="display: none;">
                </div>
                <div class="detail-row">
                    <span class="detail-label">Data de Entrada</span>
                    <span class="detail-value" id="detail-data_pagamento_entrada">${cliente.data_pagamento_entrada ? formatDate(cliente.data_pagamento_entrada) : 'Não definida'}</span>
                    <input type="date" class="detail-input" id="edit-data_pagamento_entrada" value="${cliente.data_pagamento_entrada}" style="display: none;">
                </div>
                <div class="detail-row">
                    <span class="detail-label">Quantidade de Parcelas</span>
                    <span class="detail-value" id="detail-tipo_pagamento">${cliente.tipo_pagamento === 'parcelado' ? '2' : '1'}</span>
                    <select class="detail-input" id="edit-tipo_pagamento" style="display: none;">
                        <option value="parcelado" ${cliente.tipo_pagamento === 'parcelado' ? 'selected' : ''}>Parcelado (2x)</option>
                        <option value="à vista" ${cliente.tipo_pagamento === 'à vista' ? 'selected' : ''}>À vista</option>
                    </select>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Forma de Pagamento</span>
                    <span class="detail-value" id="detail-tipo_pagamento_text">${cliente.tipo_pagamento || 'Não definida'}</span>
                </div>
            </div>
        </div>

        <!-- Seção Pós Venda -->
        <div class="details-section">
            <div class="section-header">Pós Venda</div>
            <div class="section-content">
                <div class="pos-venda-grid">
                    <div class="pos-venda-item ${cliente.atualizacao_cadastral_realizada ? 'checked' : 'unchecked'}">
                        <i class="fas ${cliente.atualizacao_cadastral_realizada ? 'fa-check' : 'fa-times'}"></i>
                        <span>Atualização Cadastral</span>
                    </div>
                    <div class="pos-venda-item ${cliente.cadastro_positivo_realizado ? 'checked' : 'unchecked'}">
                        <i class="fas ${cliente.cadastro_positivo_realizado ? 'fa-check' : 'fa-times'}"></i>
                        <span>Cadastro Positivo</span>
                    </div>
                    <div class="pos-venda-item ${cliente.conexao_bancaria_realizada ? 'checked' : 'unchecked'}">
                        <i class="fas ${cliente.conexao_bancaria_realizada ? 'fa-check' : 'fa-times'}"></i>
                        <span>Conexão Bancária</span>
                    </div>
                    <div class="pos-venda-item ${cliente.envio_cartilha ? 'checked' : 'unchecked'}">
                        <i class="fas ${cliente.envio_cartilha ? 'fa-check' : 'fa-times'}"></i>
                        <span>Envio de Cartilha</span>
                    </div>
                    <div class="pos-venda-item ${cliente.entrega_resultado ? 'checked' : 'unchecked'}">
                        <i class="fas ${cliente.entrega_resultado ? 'fa-check' : 'fa-times'}"></i>
                        <span>Entrega de Resultado</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Resumo Financeiro -->
        <div class="details-section">
            <div class="section-header">Resumo Financeiro</div>
            <div class="section-content">
                <div class="detail-row">
                    <span class="detail-label">Total Recebido</span>
                    <span class="detail-value">R$ ${totalRecebido.toFixed(2)}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Comissão da Consulta</span>
                    <span class="detail-value">R$ ${comissaoConsulta.toFixed(2)}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Comissão da Entrada (20%)</span>
                    <span class="detail-value">R$ ${comissaoEntrada.toFixed(2)}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Sua Comissão Total</span>
                    <span class="detail-value" style="font-weight: bold; color: var(--color-primary);">R$ ${totalComissao.toFixed(2)}</span>
                </div>
            </div>
        </div>

        <div class="edit-actions" id="edit-actions" style="display: none;">
            <button type="button" class="cancel-btn" onclick="cancelClientEdit()">Cancelar</button>
            <button type="button" class="save-btn" onclick="saveClientEdit()">Salvar Alterações</button>
        </div>
    `;
    
    openClientSidebar();
}

// Função para habilitar edição do cliente
function enableClientEdit() {
    isEditingMode = true;
    
    // Mostrar inputs e esconder spans
    document.querySelectorAll('.detail-value').forEach(span => {
        span.style.display = 'none';
    });
    document.querySelectorAll('.detail-input').forEach(input => {
        input.style.display = 'block';
    });
    
    // Mostrar botões de ação
    document.getElementById('edit-actions').style.display = 'block';
    
    // Atualizar botão de edição
    const editBtn = document.querySelector('.edit-client-btn');
    editBtn.innerHTML = '<i class="fas fa-save"></i>';
    editBtn.onclick = saveClientEdit;
}

// Função para cancelar edição
function cancelClientEdit() {
    isEditingMode = false;
    
    // Mostrar spans e esconder inputs
    document.querySelectorAll('.detail-value').forEach(span => {
        span.style.display = 'block';
    });
    document.querySelectorAll('.detail-input').forEach(input => {
        input.style.display = 'none';
    });
    
    // Esconder botões de ação
    document.getElementById('edit-actions').style.display = 'none';
    
    // Restaurar botão de edição
    const editBtn = document.querySelector('.edit-client-btn');
    editBtn.innerHTML = '<i class="fas fa-edit"></i>';
    editBtn.onclick = enableClientEdit;
}

// Função para salvar edição do cliente
function saveClientEdit() {
    if (!currentEditingClient) return;
    
    // Atualizar dados do cliente
    currentEditingClient.nome = document.getElementById('edit-nome').value;
    currentEditingClient.telefone = document.getElementById('edit-telefone').value;
    currentEditingClient.cpf = document.getElementById('edit-cpf').value;
    currentEditingClient.cnpj = document.getElementById('edit-cnpj').value;
    currentEditingClient.razao_social = document.getElementById('edit-razao_social').value;
    currentEditingClient.origem_cliente = document.getElementById('edit-origem_cliente').value;
    currentEditingClient.servico = document.getElementById('edit-servico').value;
    currentEditingClient.data_inicio_atendimento = document.getElementById('edit-data_inicio_atendimento').value;
    currentEditingClient.status = document.getElementById('edit-status').value;
    currentEditingClient.objetivo = document.getElementById('edit-objetivo').value;
    currentEditingClient.valor_consulta = parseFloat(document.getElementById('edit-valor_consulta').value);
    currentEditingClient.valor_proposta = parseFloat(document.getElementById('edit-valor_proposta').value);
    currentEditingClient.data_pagamento_entrada = document.getElementById('edit-data_pagamento_entrada').value;
    currentEditingClient.tipo_pagamento = document.getElementById('edit-tipo_pagamento').value;
    
    // Atualizar exibição
    showClientDetails(currentEditingClient);
    renderClients();
    
    showNotification('Cliente atualizado com sucesso!', 'success');
}

// Funções para controlar o sidebar
function openClientSidebar() {
    if (clientDetailsSidebar && sidebarOverlay && mainContainer) {
        clientDetailsSidebar.classList.add('active');
        sidebarOverlay.classList.add('active');
        mainContainer.classList.add('with-client-sidebar');
    }
}

function closeClientSidebar() {
    if (clientDetailsSidebar && sidebarOverlay && mainContainer) {
        clientDetailsSidebar.classList.remove('active');
        sidebarOverlay.classList.remove('active');
        mainContainer.classList.remove('with-client-sidebar');
        currentEditingClient = null;
        isEditingMode = false;
    }
}

// Função para abrir modal de edição
function openEditModal(clienteId) {
    const cliente = clientes.find(c => c.id === clienteId);
    if (!cliente) return;
    
    // Criar modal de edição
    const editModal = document.createElement('div');
    editModal.className = 'modal';
    editModal.id = 'editDetailsModal';
    editModal.style.display = 'flex';
    
    editModal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Editar Status do Cliente</h3>
                <button class="close-btn" onclick="closeEditModal()">&times;</button>
            </div>
            <form id="editDetailsForm">
                <div class="form-group">
                    <label for="editStatus">Status Geral</label>
                    <select id="editStatus">
                        <option value="Em consulta" ${cliente.status === 'Em consulta' ? 'selected' : ''}>Em consulta</option>
                        <option value="Em proposta" ${cliente.status === 'Em proposta' ? 'selected' : ''}>Em proposta</option>
                        <option value="Contratado" ${cliente.status === 'Contratado' ? 'selected' : ''}>Contratado</option>
                        <option value="Pós venda" ${cliente.status === 'Pós venda' ? 'selected' : ''}>Pós venda</option>
                        <option value="Finalizado" ${cliente.status === 'Finalizado' ? 'selected' : ''}>Finalizado</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label>Etapa 1 - Consulta</label>
                    <select id="editConsulta">
                        <option value="Pendente" ${!cliente.consulta_realizada ? 'selected' : ''}>Pendente</option>
                        <option value="Em andamento" ${cliente.consulta_realizada && !cliente.data_consulta ? 'selected' : ''}>Em andamento</option>
                        <option value="Finalizado" ${cliente.consulta_realizada && cliente.data_consulta ? 'selected' : ''}>Finalizado</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label>Etapa 2 - Entrada</label>
                    <select id="editEntrada">
                        <option value="Pendente" ${!cliente.data_pagamento_entrada ? 'selected' : ''}>Pendente</option>
                        <option value="Em andamento" ${cliente.data_pagamento_entrada && !cliente.valor_entrada ? 'selected' : ''}>Em andamento</option>
                        <option value="Finalizado" ${cliente.data_pagamento_entrada && cliente.valor_entrada > 0 ? 'selected' : ''}>Finalizado</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label>Etapa 3 - Resultado</label>
                    <select id="editResultado">
                        <option value="Pendente" ${!cliente.data_entrega_resultado ? 'selected' : ''}>Pendente</option>
                        <option value="Em andamento" ${cliente.data_entrega_resultado && !cliente.descricao_resultado ? 'selected' : ''}>Em andamento</option>
                        <option value="Finalizado" ${cliente.data_entrega_resultado && cliente.descricao_resultado ? 'selected' : ''}>Finalizado</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label>Etapa 4 - Pós-venda</label>
                    <div class="checkbox-group">
                        <div class="checkbox-item">
                            <input type="checkbox" id="editCadastroPositivo" ${cliente.cadastro_positivo_realizado ? 'checked' : ''}>
                            <label for="editCadastroPositivo">Cadastro Positivo</label>
                        </div>
                        <div class="checkbox-item">
                            <input type="checkbox" id="editAtualizacaoCadastral" ${cliente.atualizacao_cadastral_realizada ? 'checked' : ''}>
                            <label for="editAtualizacaoCadastral">Atualização Cadastral</label>
                        </div>
                        <div class="checkbox-item">
                            <input type="checkbox" id="editConexaoBancaria" ${cliente.conexao_bancaria_realizada ? 'checked' : ''}>
                            <label for="editConexaoBancaria">Conexão Bancária</label>
                        </div>
                        <div class="checkbox-item">
                            <input type="checkbox" id="editEnvioCartilha" ${cliente.envio_cartilha ? 'checked' : ''}>
                            <label for="editEnvioCartilha">Envio de Cartilha</label>
                        </div>
                        <div class="checkbox-item">
                            <input type="checkbox" id="editEntregaResultado" ${cliente.entrega_resultado ? 'checked' : ''}>
                            <label for="editEntregaResultado">Entrega de Resultado</label>
                        </div>
                    </div>
                </div>
                
                <div class="form-actions">
                    <button type="button" class="cancel-btn" onclick="closeEditModal()">Cancelar</button>
                    <button type="submit">Salvar Alterações</button>
                </div>
            </form>
        </div>
    `;
    
    document.body.appendChild(editModal);
    
    // Adicionar evento de submit
    document.getElementById('editDetailsForm').addEventListener('submit', function(e) {
        e.preventDefault();
        saveEditChanges(clienteId);
    });
    
    // Fechar modal ao clicar fora
    editModal.addEventListener('click', function(e) {
        if (e.target === editModal) {
            closeEditModal();
        }
    });
}

// Função para fechar modal de edição
function closeEditModal() {
    const editModal = document.getElementById('editDetailsModal');
    if (editModal) {
        editModal.remove();
    }
}

// Função para salvar alterações do modal de edição
function saveEditChanges(clienteId) {
    const clienteIndex = clientes.findIndex(c => c.id === clienteId);
    if (clienteIndex === -1) return;
    
    const cliente = clientes[clienteIndex];
    
    // Atualizar status geral
    cliente.status = document.getElementById('editStatus').value;
    
    // Atualizar etapa 1 - Consulta
    const consultaStatus = document.getElementById('editConsulta').value;
    cliente.consulta_realizada = consultaStatus === 'Finalizado';
    if (consultaStatus === 'Finalizado' && !cliente.data_consulta) {
        cliente.data_consulta = new Date().toISOString().split('T')[0];
    }
    
    // Atualizar etapa 2 - Entrada
    const entradaStatus = document.getElementById('editEntrada').value;
    if (entradaStatus === 'Finalizado' && !cliente.data_pagamento_entrada) {
        cliente.data_pagamento_entrada = new Date().toISOString().split('T')[0];
        cliente.valor_entrada = cliente.valor_proposta * 0.5; // 50% de entrada
    }
    
    // Atualizar etapa 3 - Resultado
    const resultadoStatus = document.getElementById('editResultado').value;
    if (resultadoStatus === 'Finalizado' && !cliente.data_entrega_resultado) {
        cliente.data_entrega_resultado = new Date().toISOString().split('T')[0];
        cliente.descricao_resultado = "Serviço concluído com sucesso";
        cliente.data_pagamento_final = new Date().toISOString().split('T')[0];
    }
    
    // Atualizar etapa 4 - Pós-venda
    cliente.cadastro_positivo_realizado = document.getElementById('editCadastroPositivo').checked;
    cliente.atualizacao_cadastral_realizada = document.getElementById('editAtualizacaoCadastral').checked;
    cliente.conexao_bancaria_realizada = document.getElementById('editConexaoBancaria').checked;
    cliente.envio_cartilha = document.getElementById('editEnvioCartilha').checked;
    cliente.entrega_resultado = document.getElementById('editEntregaResultado').checked;
    
    // Atualizar comissões baseadas no progresso
    if (cliente.consulta_realizada && cliente.comissao_consulta === 0) {
        cliente.comissao_consulta = cliente.valor_consulta - 30; // Todo o restante acima de R$ 30
    }
    
    if (cliente.data_pagamento_final && cliente.comissao_pos_venda === 0) {
        cliente.comissao_pos_venda = cliente.valor_proposta * 0.3;
    }
    
    // Fechar modal
    closeEditModal();
    
    // Atualizar exibição
    showClientDetails(cliente);
    renderClients();
    
    showNotification('Status atualizado com sucesso!', 'success');
}

// Função para formatar a data
function formatDate(dateString) {
    if (!dateString) return 'Não definida';
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('pt-BR', options);
}

// Função para editar cliente
function editClient(id) {
    const cliente = clientes.find(c => c.id === id);
    if (cliente && clientForm) {
        // Preencher o formulário com os dados do cliente
        document.getElementById('nome').value = cliente.nome;
        document.getElementById('cpf').value = cliente.cpf;
        document.getElementById('cnpj').value = cliente.cnpj;
        document.getElementById('razao_social').value = cliente.razao_social;
        document.getElementById('telefone').value = cliente.telefone;
        document.getElementById('origem_cliente').value = cliente.origem_cliente;
        document.getElementById('servico').value = cliente.servico;
        document.getElementById('data_inicio_atendimento').value = cliente.data_inicio_atendimento;
        document.getElementById('objetivo').value = cliente.objetivo;
        document.getElementById('status').value = cliente.status;
        
        // Abrir modal
        if (addClientModal) addClientModal.style.display = 'flex';
        
        // Alterar o comportamento do formulário para edição
        clientForm.onsubmit = function(e) {
            e.preventDefault();
            updateClient(id);
        };
        
        // Alterar o texto do botão
        const submitBtn = clientForm.querySelector('button[type="submit"]');
        if (submitBtn) submitBtn.textContent = 'Atualizar Cliente';
    }
}

// Função para atualizar cliente
function updateClient(id) {
    const clienteIndex = clientes.findIndex(c => c.id === id);
    if (clienteIndex !== -1 && clientForm) {
        clientes[clienteIndex] = {
            ...clientes[clienteIndex],
            nome: document.getElementById('nome').value,
            cpf: document.getElementById('cpf').value,
            cnpj: document.getElementById('cnpj').value,
            razao_social: document.getElementById('razao_social').value,
            telefone: document.getElementById('telefone').value,
            origem_cliente: document.getElementById('origem_cliente').value,
            servico: document.getElementById('servico').value,
            data_inicio_atendimento: document.getElementById('data_inicio_atendimento').value,
            objetivo: document.getElementById('objetivo').value,
            status: document.getElementById('status').value
        };
        
        renderClients();
        if (addClientModal) addClientModal.style.display = 'none';
        clientForm.reset();
        
        // Restaurar comportamento padrão do formulário
        clientForm.onsubmit = addNewClient;
        const submitBtn = clientForm.querySelector('button[type="submit"]');
        if (submitBtn) submitBtn.textContent = 'Adicionar Cliente';
        
        showNotification('Cliente atualizado com sucesso!', 'success');
    }
}

// Função para arquivar cliente
function archiveClient(id) {
    if (confirm('Tem certeza que deseja arquivar este cliente?')) {
        const clienteIndex = clientes.findIndex(c => c.id === id);
        if (clienteIndex !== -1) {
            clientes.splice(clienteIndex, 1);
            renderClients();
            closeClientSidebar();
            showNotification('Cliente arquivado com sucesso!', 'info');
        }
    }
}

// Adicionar novo cliente
function addNewClient(event) {
    event.preventDefault();
    
    const novoCliente = {
        id: clientes.length > 0 ? Math.max(...clientes.map(c => c.id)) + 1 : 1,
        nome: document.getElementById('nome').value,
        cpf: document.getElementById('cpf').value,
        cnpj: document.getElementById('cnpj').value,
        razao_social: document.getElementById('razao_social').value,
        telefone: document.getElementById('telefone').value,
        origem_cliente: document.getElementById('origem_cliente').value,
        servico: document.getElementById('servico').value,
        data_inicio_atendimento: document.getElementById('data_inicio_atendimento').value,
        objetivo: document.getElementById('objetivo').value,
        status: document.getElementById('status').value,
        
        consulta_realizada: false,
        data_consulta: "",
        data_pagamento_consulta: "",
        valor_consulta: 0.00,
        comissao_consulta: 0.00,
        data_ligacao_proposta: "",
        associado_responsavel: "",
        proposta_enviada: false,
        valor_proposta: 0.00,
        
        data_pagamento_entrada: "",
        tipo_pagamento: "",
        valor_entrada: 0.00,
        
        data_entrega_resultado: "",
        descricao_resultado: "",
        data_pagamento_final: "",
        
        cadastro_positivo_realizado: false,
        atualizacao_cadastral_realizada: false,
        conexao_bancaria_realizada: false,
        envio_cartilha: false,
        entrega_resultado: false,
        comissao_pos_venda: 0.00
    };
    
    clientes.push(novoCliente);
    renderClients();
    if (addClientModal) addClientModal.style.display = 'none';
    if (clientForm) clientForm.reset();
    
    // Mostrar notificação de sucesso
    showNotification('Cliente adicionado com sucesso!', 'success');
}
 
// Função para mostrar notificações
function showNotification(message, type = 'info') {
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

// Função para renderizar clientes filtrados
function renderFilteredClients(filteredClients) {
    if (!clientsGrid) return;
    
    clientsGrid.innerHTML = '';
    
    if (filteredClients.length === 0) {
        clientsGrid.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-search"></i>
                <h3>Nenhum cliente encontrado</h3>
                <p>Tente alterar os filtros de busca</p>
            </div>
        `;
        return;
    }
    
    filteredClients.forEach(cliente => {
        const card = document.createElement('div');
        card.className = 'card';
        card.dataset.id = cliente.id;
        
        let statusClass = 'status-new';
        if (cliente.status === 'Em proposta') statusClass = 'status-progress';
        if (cliente.status === 'Contratado') statusClass = 'status-progress';
        if (cliente.status === 'Pós venda') statusClass = 'status-progress';
        if (cliente.status === 'Finalizado') statusClass = 'status-completed';
        
        card.innerHTML = `
            <div class="card-header">
                <div class="client-name">${cliente.nome}</div>
                <div class="client-status ${statusClass}">${cliente.status}</div>
            </div>
            <div class="client-info">
                <div class="client-date">
                    <i class="far fa-calendar"></i>
                    Primeiro contato: ${formatDate(cliente.data_inicio_atendimento)}
                </div>
                <div class="client-service">
                    <i class="fas fa-briefcase"></i>
                    ${cliente.servico}
                </div>
            </div>
            <div class="card-footer">
                <div class="client-origin">
                    <i class="fas fa-tag"></i>
                    ${cliente.origem_cliente}
                </div>
                <div class="client-actions">
                    <button class="action-btn" title="Editar" onclick="event.stopPropagation(); editClient(${cliente.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn" title="Arquivar" onclick="event.stopPropagation(); archiveClient(${cliente.id})">
                        <i class="fas fa-archive"></i>
                    </button>
                </div>
            </div>
        `;
        
        // Torna o card inteiro clicável para abrir os detalhes
        card.style.cursor = 'pointer';
        card.addEventListener('click', () => {
            showClientDetails(cliente);
        });
        
        clientsGrid.appendChild(card);
    });
}

// Função para inicializar event listeners
function initializeEventListeners() {
    // Abrir modal para adicionar cliente
    if (btnAddClient) {
        btnAddClient.addEventListener('click', () => {
            if (addClientModal) addClientModal.style.display = 'flex';
            
            // Garantir que o formulário está no modo de adição
            if (clientForm) {
                clientForm.onsubmit = addNewClient;
                const submitBtn = clientForm.querySelector('button[type="submit"]');
                if (submitBtn) submitBtn.textContent = 'Adicionar Cliente';
            }
        });
    }

    // Fechar modal
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

    // Fechar modal clicando fora dele
    window.addEventListener('click', (event) => {
        if (addClientModal && event.target === addClientModal) {
            addClientModal.style.display = 'none';
            if (clientForm) clientForm.reset();
        }
    });

    // Event listeners para o sidebar de detalhes
    const closeSidebarBtn = document.getElementById('closeClientSidebar');
    if (closeSidebarBtn) {
        closeSidebarBtn.addEventListener('click', closeClientSidebar);
    }
    
    if (sidebarOverlay) {
        sidebarOverlay.addEventListener('click', closeClientSidebar);
    }
    
    // Fechar sidebar com ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeClientSidebar();
        }
    });

    // Event listeners para as tabs
    document.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', function() {
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            const filter = this.textContent;
            let filteredClients = clientes;
            
            switch(filter) {
                case 'Novos':
                    filteredClients = clientes.filter(c => c.status === 'Em consulta');
                    break;
                case 'Em Andamento':
                    filteredClients = clientes.filter(c => ['Em proposta', 'Contratado', 'Pós venda'].includes(c.status));
                    break;
                case 'Concluídos':
                    filteredClients = clientes.filter(c => c.status === 'Finalizado');
                    break;
                case 'Arquivados':
                    filteredClients = [];
                    break;
                default:
                    filteredClients = clientes;
            }
            
            renderFilteredClients(filteredClients);
        });
    });

    // Fechar sidebar ao clicar em um link (em dispositivos móveis)
    document.querySelectorAll('.sidebar nav a').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768 && sidebar) {
                sidebar.classList.remove('active');
            }
        });
    });
}

// Inicialização quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    initializeDOMElements();
    initializeEventListeners();
    loadSidebarProfile();
    renderClients();
});