# clientes/views.py
from rest_framework import viewsets
from .models import Cliente
from .serializers import ClienteSerializer

class ClienteViewSet(viewsets.ModelViewSet):
    """
    API endpoint que permite clientes serem visualizados ou editados.
    """
    queryset = Cliente.objects.all().order_by('-data_inicio_atendimento')
    serializer_class = ClienteSerializer