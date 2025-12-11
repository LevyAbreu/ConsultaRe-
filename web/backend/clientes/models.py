from django.db import models

class Cliente(models.Model):
    nome = models.CharField(max_length=100)
    cpf = models.CharField(max_length=14, blank=True, null=True)
    cnpj = models.CharField(max_length=18, blank=True, null=True)
    razao_social = models.CharField(max_length=200, blank=True, null=True)
    telefone = models.CharField(max_length=20)
    origem_cliente = models.CharField(max_length=50)
    servico = models.CharField(max_length=100)
    data_inicio_atendimento = models.DateField(auto_now_add=True)
    objetivo = models.TextField(blank=True, null=True)
    status = models.CharField(max_length=50, default='Em consulta')

    consulta_realizada = models.BooleanField(default=False)
    data_consulta = models.DateField(blank=True, null=True)
    valor_consulta = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)

    data_pagamento_entrada = models.DateField(blank=True, null=True)
    tipo_pagamento = models.CharField(max_length=50, blank=True, null=True)
    valor_entrada = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    # ...
    
    def __str__(self):
        return self.nome