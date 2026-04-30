# core/api/views/peca_views.py
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.pagination import PageNumberPagination
from core.models import Peca
from core.api.serializers import PecaSerializer


# core/api/views/peca_views.py
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.pagination import PageNumberPagination
from core.models import Peca
from core.api.serializers import PecaSerializer


@api_view(['GET'])
def get_pecas(request):
    """Listar peças com paginação e filtros opcionais por programa/grupo."""
    pecas = (
        Peca.objects
        .select_related("categoria", "programa", "grupo", "utilizador")
        .all()
    )

    # 🔹 filtros vindos da querystring
    programa_id = request.query_params.get("programa")
    grupo_id = request.query_params.get("grupo")

    if programa_id:
        pecas = pecas.filter(programa_id=programa_id)

    if grupo_id:
        pecas = pecas.filter(grupo_id=grupo_id)

    # ordenação global (mais recentes primeiro)
    pecas = pecas.order_by("-data_registro")

    paginator = PageNumberPagination()
    paginator.page_size = 10
    page = paginator.paginate_queryset(pecas, request)

    serializer = PecaSerializer(page, many=True)
    return paginator.get_paginated_response(serializer.data)



@api_view(['POST'])
def create_peca(request):
    """Criar nova peça."""
    serializer = PecaSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)


@api_view(['PUT'])
def update_peca(request, pk):
    """Atualizar peça existente."""
    try:
        peca = Peca.objects.get(pk=pk)
    except Peca.DoesNotExist:
        return Response({'error': 'Peça não encontrada'}, status=404)

    serializer = PecaSerializer(peca, data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=400)


@api_view(['DELETE'])
def delete_peca(request, pk):
    """Excluir peça."""
    try:
        peca = Peca.objects.get(pk=pk)
    except Peca.DoesNotExist:
        return Response({'error': 'Peça não encontrada'}, status=404)

    peca.delete()
    return Response(status=204)
