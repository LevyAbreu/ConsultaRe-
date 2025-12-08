import { clientes } from '../../data/mockData.js';
import { showNotification } from '../../utils/helpers.js';
import { renderClients } from './clientRenderer.js';

export function addNewClient(event) {
    event.preventDefault();

    try {
        const addClientModal = document.getElementById('addClientModal');
        const clientForm = document.getElementById('clientForm');
        
        const getSafeValue = (id) => {
            try {
                const element = document.getElementById(id);
                return element ? element.value : '';
            } catch (error) {
                console.warn(`Campo ${id} não encontrado:`, error);
                return '';
            }
        };
        
        const getSafeSelectValue = (id, defaultValue = '') => {
            try {
                const element = document.getElementById(id);
                return element ? element.value : defaultValue;
            } catch (error) {
                console.warn(`Select ${id} não encontrado:`, error);
                return defaultValue;
            }
        };
        
        const novoCliente = {
            id: clientes.length > 0 ? Math.max(...clientes.map(c => c.id)) + 1 : 1,
            nome: getSafeValue('nome'),
            cpf: getSafeValue('cpf'),
            cnpj: getSafeValue('cnpj'),
            razao_social: getSafeValue('razao_social'),
            telefone: getSafeValue('telefone'),
            origem_cliente: getSafeSelectValue('origem_cliente', 'Outro'),
            servico: getSafeSelectValue('servico', 'Limpa Nome'),
            data_inicio_atendimento: getSafeValue('data_inicio_atendimento'),
            objetivo: getSafeValue('objetivo'),
            status: getSafeSelectValue('status', 'Em consulta'),
            
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
        
        if (!novoCliente.nome.trim()) {
            showNotification('O nome do cliente é obrigatório.', 'error');
            return;
        }
        
        if (!novoCliente.telefone.trim()) {
            showNotification('O telefone do cliente é obrigatório.', 'error');
            return;
        }
        
        clientes.push(novoCliente);
        renderClients();
        
        if (addClientModal) addClientModal.style.display = 'none';
        if (clientForm) clientForm.reset();
        
        showNotification('Cliente adicionado com sucesso!', 'success');
        
    } catch (error) {
        console.error('Erro ao adicionar cliente:', error);
        showNotification('Erro ao adicionar cliente. Tente novamente.', 'error');
    }
}

export function archiveClient(event, id) {
    if (event) {
        event.stopPropagation();
    }

    const cliente = clientes.find(c => c.id === id);
    if (cliente && cliente.status !== 'Arquivado') {
        cliente.status = 'Arquivado';
        renderClients();
        showNotification(`Cliente ${cliente.nome} arquivado.`, 'info');
    }
}

export function unarchiveClient(event, id) {
    if (event) {
        event.stopPropagation();
    }

    const cliente = clientes.find(c => c.id === id);
    if (cliente && cliente.status === 'Arquivado') {
        cliente.status = 'Em consulta';
        
        renderClients();
        
        showNotification(`Cliente ${cliente.nome} desarquivado e movido para "Em consulta".`, 'success');
    }
}

export function saveEditChanges(clienteId) {
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

export function editClient(id) {
    const cliente = clientes.find(c => c.id === id);
    const addClientModal = document.getElementById('addClientModal');
    const clientForm = document.getElementById('clientForm');

    if (cliente && clientForm) {
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
        
        addClientModal.style.display = 'flex';
        
        clientForm.onsubmit = function(e) {
            e.preventDefault();
            updateClient(id);
        };
        
        const submitBtn = clientForm.querySelector('button[type="submit"]');
        if (submitBtn) submitBtn.textContent = 'Atualizar Cliente';
    }
}

export function updateClient(id) {
    const clienteIndex = clientes.findIndex(c => c.id === id);
    const addClientModal = document.getElementById('addClientModal');
    const clientForm = document.getElementById('clientForm');

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
        
        clientForm.onsubmit = addNewClient;
        const submitBtn = clientForm.querySelector('button[type="submit"]');
        if (submitBtn) submitBtn.textContent = 'Adicionar Cliente';
        
        showNotification('Cliente atualizado com sucesso!', 'success');
    }
}