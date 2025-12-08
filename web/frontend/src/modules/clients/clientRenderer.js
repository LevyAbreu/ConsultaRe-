import { clientes } from '../../data/mockData.js';
import { formatDate, showNotification } from '../../utils/helpers.js';
import { openClientSidebar } from '../../components/uiManager.js';
import { archiveClient, unarchiveClient } from './clientService.js';

export let currentEditingClient = null; 
export let isEditingMode = false;

export function setCurrentEditingClient(client) {
    currentEditingClient = client;
}

export function setIsEditingMode(mode) {
    isEditingMode = mode;
}

export function renderClients() {
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
    
    clientes.forEach(clientData => {
        const isArchived = clientData.status === 'Arquivado';
        const actionText = isArchived ? 'Desarquivar' : 'Arquivar';
        const actionIcon = isArchived ? 'fas fa-box-open' : 'fas fa-archive';
        const actionFunction = isArchived ? 'unarchiveClient' : 'archiveClient';
        const actionButtonClass = isArchived ? 'unarchive-btn' : 'archive-btn';

        const card = document.createElement('div');
        card.className = 'card';
        card.dataset.id = clientData.id;
        
        let statusClass = 'status-new';
        if (clientData.status === 'Em proposta') statusClass = 'status-progress';
        if (clientData.status === 'Contratado') statusClass = 'status-progress';
        if (clientData.status === 'Pós venda') statusClass = 'status-progress';
        if (clientData.status === 'Finalizado') statusClass = 'status-completed';
        
        card.innerHTML = `
            <div class="card-header" onclick="showClientDetails(${clientData.id})">
                <div class="client-name">${clientData.nome}</div>
                <div class="client-status ${statusClass}">${clientData.status}</div>
            </div>            
            <div class="client-info" onclick="showClientDetails(${clientData.id})">
                <div class="client-date">
                    <i class="far fa-calendar"></i>
                    Primeiro contato: ${formatDate(clientData.data_inicio_atendimento)}
                </div>
                <div class="client-service">
                    <i class="fas fa-briefcase"></i>
                    Serviço: ${clientData.servico}
                </div>
            </div>
            <div class="card-footer">                
                <button class="action-btn ${actionButtonClass}" 
                        onclick="${actionFunction}(event, ${clientData.id})">
                    <i class="${actionIcon}"></i> ${actionText}
                </button>
            </div>
        `;
        
        card.style.cursor = 'pointer';
        card.addEventListener('click', () => {
            showClientDetails(clientData);
        });
        
        clientsGrid.appendChild(card);
    });
}

export function renderFilteredClients(filteredClients) {
    if (!clientsGrid) return;
    
    clientsGrid.innerHTML = '';
    
    if (filteredClients.length === 0) {
        clientsGrid.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-search"></i>
                <h3>Nenhum cliente encontrado</h3>
            </div>
        `;
        return;
    }
    
    filteredClients.forEach(cliente => {
        const card = document.createElement('div');
        card.className = 'card';
        card.dataset.id = cliente.id;
        
        let statusClass = 'status-new';
        if (cliente.status === 'Em proposta' || cliente.status === 'Contratado' || cliente.status === 'Pós venda') {
            statusClass = 'status-progress';
        } else if (cliente.status === 'Finalizado') {
            statusClass = 'status-completed';
        } else if (cliente.status === 'Arquivado') {
            statusClass = 'status-archived';
        } else if (cliente.status === 'Em consulta') {
            statusClass = 'status-new';
        }

        const isArchived = cliente.status === 'Arquivado';
        const actionText = isArchived ? 'Desarquivar' : 'Arquivar';
        const actionIcon = isArchived ? 'fas fa-box-open' : 'fas fa-archive';
        const actionFunction = isArchived ? 'unarchiveClient' : 'archiveClient';
        const actionButtonClass = isArchived ? 'unarchive-btn' : 'archive-btn';
        
        card.innerHTML = `
            <div class="card-header" onclick="showClientDetails(${cliente.id})">
                <div class="client-name">${cliente.nome}</div>
                <div class="client-status ${statusClass}">${cliente.status}</div>
            </div>
            <div class="client-info" onclick="showClientDetails(${cliente.id})">
                <div class="client-date">
                    <i class="far fa-calendar"></i>
                    Primeiro contato: ${formatDate(cliente.data_inicio_atendimento)}
                </div>
                <div class="client-service">
                    <i class="fas fa-briefcase"></i>
                    Serviço: ${cliente.servico}
                </div>
            </div>
            <div class="card-footer">
                <button class="action-btn ${actionButtonClass}" 
                        onclick="${actionFunction}(event, ${cliente.id})">
                    <i class="${actionIcon}"></i> ${actionText}
                </button>
            </div>
        `;

        clientsGrid.appendChild(card);
    });
}

export function showClientDetails(clienteParam) {
    const contentDiv = document.getElementById('clientDetailsContent');
    if (!contentDiv) return;
    
    let clienteId;
    let cliente;
    
    if (typeof clienteParam === 'object' && clienteParam !== null) {
        cliente = clienteParam;
        clienteId = cliente.id;
    } else {
        clienteId = parseInt(clienteParam);
        cliente = clientes.find(c => c.id === clienteId);
    }

    if (!cliente) {
        console.error(`Erro: Cliente não encontrado. Parâmetro: ${clienteParam}`);
        return;
    }

    if (!clientDetailsContent) return;

    const headerTitle = document.querySelector('.client-details-header h3');
    if (headerTitle) {
        headerTitle.textContent = cliente.nome;
    }
    
    currentEditingClient = cliente;
    isEditingMode = false;
    
    updateHeaderButton(false);
    
    const totalComissao = cliente.comissao_consulta + (cliente.comissao_pos_venda || 0);
    const totalRecebido = cliente.valor_consulta + cliente.valor_entrada + (cliente.data_pagamento_final ? cliente.valor_proposta - cliente.valor_entrada : 0);
    
    const comissaoEntrada = cliente.valor_entrada * 0.20;
    const comissaoConsulta = cliente.valor_consulta - 30;
    
    const nomeDisplay = cliente.cnpj && cliente.razao_social ? 
        `${cliente.nome}<br><small style="color: #666;">${cliente.razao_social}</small>` : 
        cliente.nome;

    clientDetailsContent.innerHTML = `
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

        <div class="details-section">
            <div class="section-header">Pós Venda</div>
            <div class="section-content">
                <div class="pos-venda-grid">
                    <div class="pos-venda-item ${cliente.atualizacao_cadastral_realizada ? 'checked' : 'unchecked'}">
                        <i class="fas ${cliente.atualizacao_cadastral_realizada ? 'fa-check' : 'fa-times'}"></i>
                        <span>Atualização Cadastral</span>
                    </div>
                    <div class="pos-venda-item ${cliente.cadastro_positivo_realizado ? 'checked' : 'unchecked'}">
                        <i class="fas ${cliente.cadastro_positivo_realizada ? 'fa-check' : 'fa-times'}"></i>
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
            <button type="button" class="cancel-btn">Cancelar</button>
            <button type="button" class="save-btn">Salvar Alterações</button>
        </div>
    `;
    
    const cancelBtn = document.querySelector('.cancel-btn');
    const saveBtn = document.querySelector('.save-btn');
    
    if (cancelBtn) {
        cancelBtn.onclick = cancelClientEdit;
    }
    
    if (saveBtn) {
        saveBtn.onclick = saveClientEdit;
    }
    
    openClientSidebar();
}

export function enableClientEdit() {
    console.log('enableClientEdit chamado');
    
    if (!currentEditingClient) {
        console.warn('Nenhum cliente selecionado para edição');
        return;
    }
    
    isEditingMode = true;
    
    updateHeaderButton(true);
    
    const detailValues = document.querySelectorAll('.detail-value');
    const detailInputs = document.querySelectorAll('.detail-input');
    
    detailValues.forEach(span => {
        if (span) span.style.display = 'none';
    });
    
    detailInputs.forEach(input => {
        if (input) input.style.display = 'block';
    });
    
    const editActions = document.getElementById('edit-actions');
    if (editActions) {
        editActions.style.display = 'flex';
    }
}

export function cancelClientEdit() {
    console.log('cancelClientEdit chamado');
    
    isEditingMode = false;
    
    updateHeaderButton(false);
    
    const detailValues = document.querySelectorAll('.detail-value');
    const detailInputs = document.querySelectorAll('.detail-input');
    
    detailValues.forEach(span => {
        if (span) span.style.display = 'block';
    });
    
    detailInputs.forEach(input => {
        if (input) input.style.display = 'none';
    });
    
    const editActions = document.getElementById('edit-actions');
    if (editActions) {
        editActions.style.display = 'none';
    }
    
    if (currentEditingClient) {
        showClientDetails(currentEditingClient);
    }
}

export function saveClientEdit() {
    console.log('saveClientEdit chamado');
    
    if (!currentEditingClient) {
        console.warn('Nenhum cliente selecionado para salvar');
        return;
    }
    
    try {
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
        currentEditingClient.valor_consulta = parseFloat(document.getElementById('edit-valor_consulta').value) || 0;
        currentEditingClient.valor_proposta = parseFloat(document.getElementById('edit-valor_proposta').value) || 0;
        currentEditingClient.data_pagamento_entrada = document.getElementById('edit-data_pagamento_entrada').value;
        currentEditingClient.tipo_pagamento = document.getElementById('edit-tipo_pagamento').value;
        
        isEditingMode = false;
        
        updateHeaderButton(false);
        
        showClientDetails(currentEditingClient);
        renderClients();
        
        showNotification('Cliente atualizado com sucesso!', 'success');
    } catch (error) {
        console.error('Erro ao salvar cliente:', error);
        showNotification('Erro ao salvar cliente. Verifique os dados.', 'error');
    }
}

function updateHeaderButton(isEditing) {
    const editButton = document.querySelector('.edit-client-btn');
    
    if (!editButton) {
        console.warn('Botão de edição não encontrado');
        return;
    }
    
    const icon = editButton.querySelector('i');
    if (!icon) return;

    if (isEditing) {
        icon.className = 'fas fa-save';
        editButton.setAttribute('title', 'Salvar Alterações');
        editButton.onclick = saveClientEdit;
    } else {
        icon.className = 'fas fa-edit';
        editButton.setAttribute('title', 'Editar cliente');
        editButton.onclick = enableClientEdit;
    }
}