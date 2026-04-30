# core/api/views/utilizador_views.py
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.pagination import PageNumberPagination
from core.models import Utilizador
from core.api.serializers import UtilizadorSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import User



@api_view(['GET'])
def get_utilizadores(request):
    """Listar todos os utilizadores com paginação."""
    utilizadores = Utilizador.objects.all().order_by('-id')
    paginator = PageNumberPagination()
    paginator.page_size = 10
    page = paginator.paginate_queryset(utilizadores, request)
    if page is not None:
        serializer = UtilizadorSerializer(page, many=True)
        return paginator.get_paginated_response(serializer.data)

    serializer = UtilizadorSerializer(utilizadores, many=True)
    return Response(serializer.data)


@api_view(['POST'])
def create_utilizador(request):
    """Criar novo utilizador."""
    serializer = UtilizadorSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)


@api_view(['PUT'])
def update_utilizador(request, pk):
    """Atualizar utilizador existente."""
    try:
        utilizador = Utilizador.objects.get(pk=pk)
    except Utilizador.DoesNotExist:
        return Response({'error': 'Utilizador não encontrado'}, status=404)

    serializer = UtilizadorSerializer(utilizador, data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=400)


@api_view(['DELETE'])
def delete_utilizador(request, pk):
    """Excluir utilizador."""
    try:
        utilizador = Utilizador.objects.get(pk=pk)
    except Utilizador.DoesNotExist:
        return Response({'error': 'Utilizador não encontrado'}, status=404)

    utilizador.delete()
    return Response(status=204)

@api_view(['POST'])
def login_utilizador(request):
    nome = request.data.get('nome')
    password = request.data.get('password')

    if not nome or not password:
        return Response({'error': 'Nome e password são obrigatórios.'}, status=400)

    try:
        utilizador = Utilizador.objects.get(nome=nome)
    except Utilizador.DoesNotExist:
        return Response({'error': 'Utilizador não encontrado.'}, status=404)

    # Verificar password simples
    if utilizador.password != password:
        return Response({'error': 'Password incorreta.'}, status=401)

    # 🔥 Criar User (auth_user) se ainda não existir
    if not utilizador.user:
        django_user = User.objects.create_user(
            username=utilizador.nome,
            password=utilizador.password
        )
        utilizador.user = django_user
        utilizador.save()

    # 🔥 Agora geramos JWT baseado no Django User (funciona!)
    refresh = RefreshToken.for_user(utilizador.user)
    access_token = str(refresh.access_token)

    serializer = UtilizadorSerializer(utilizador)

    return Response({
        'message': 'Login efetuado com sucesso!',
        'access': access_token,
        'refresh': str(refresh),
        'utilizador': serializer.data
    }, status=200)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def private_view(request):
    return Response({"message": "Acesso autorizado!"})
