export const clientes = [
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
        
        consulta_realizada: true,
        data_consulta: "2025-10-16",
        data_pagamento_consulta: "2025-10-16",
        valor_consulta: 59.90,
        comissao_consulta: 39.90,
        data_ligacao_proposta: "2025-10-17",
        associado_responsavel: "Arianne Abreu",
        proposta_enviada: true,
        valor_proposta: 1500.00,
        
        data_pagamento_entrada: "2025-10-20",
        tipo_pagamento: "parcelado",
        valor_entrada: 750.00,
        data_entrega_resultado: "2025-11-30",
        descricao_resultado: "Dívidas suspensas e score aumentado em 150 pontos",
        data_pagamento_final: "2025-12-05",
        
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
        
        consulta_realizada: true,
        data_consulta: "2025-10-19",
        data_pagamento_consulta: "2025-10-19",
        valor_consulta: 59.90,
        comissao_consulta: 39.90,
        data_ligacao_proposta: "2025-10-20",
        associado_responsavel: "Arianne Abreu",
        proposta_enviada: true,
        valor_proposta: 2000.00,
        
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
    }
];

export const user = [
    {
        id: 1,
        name: "Arianne",
        last_name: "Abreu",
        email: "adm.arianne.abreu@gmail.com",
        cellphone: "(11) 99999-9999",
        password: "Lolzinho123.",
        function: "Consultor Financeiro",
        enterprise: "Grupo Agora",
        totaClients: 24,
        activeClients: 18,
        comission: 42000,
        bio: "Consultora financeira especializada em reestruturação de crédito e análise de rating comercial. Comprometida em ajudar clientes a alcançarem estabilidade financeira.",
        activity: [
            {
                date: "2025-10-06T10:35:00",
                title: "Perfil atualizado",
                description: "Informações pessoais modificadas"
            },
            {
                date: "2025-10-05T14:20:00",
                title: "Novo cliente adicionado",
                description: "Victor Levy foi adicionado ao sistema"
            },
            {
                date: "2025-10-04T09:15:00",
                title: "Cliente atualizado",
                description: "Informações de Kathryn Richards foram modificadas"
            },
            {
                date: "2025-10-02T16:45:00",
                title: "Serviço concluído",
                description: "Rating comercial de Shawn Jones finalizado"
            },
            {
                date: "2025-09-30T11:30:00",
                title: "Novo contato",
                description: "Pat Nguyen entrou em contato via Instagram"
            }
        ],
    }
];