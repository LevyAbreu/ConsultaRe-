import { clientes } from '../data/mockData.js';
import { setCurrentEditingClient, setIsEditingMode } from '../modules/clients/clientRenderer.js';

export function togglePanel(show = true) {
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

export function openClientSidebar() {
    if (clientDetailsSidebar && sidebarOverlay && mainContainer) {
        clientDetailsSidebar.classList.add('active');
        sidebarOverlay.classList.add('active');
        mainContainer.classList.add('with-client-sidebar');
    }
}

export function closeClientSidebar() {
    if (clientDetailsSidebar && sidebarOverlay && mainContainer) {
        clientDetailsSidebar.classList.remove('active');
        sidebarOverlay.classList.remove('active');
        mainContainer.classList.remove('with-client-sidebar');
        
        setCurrentEditingClient(null); 
        setIsEditingMode(false);
    }
}

export function openEditModal(clienteId) {
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

export function closeEditModal() {
    const editModal = document.getElementById('editDetailsModal');
    if (editModal) {
        editModal.remove();
    }
}
