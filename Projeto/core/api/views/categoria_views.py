# core/api/views/categoria_views.py
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.pagination import PageNumberPagination
from core.models import Categoria
from core.api.serializers import CategoriaSerializer


@api_view(['GET'])
def get_categorias(request):
    """Listar todas as categorias com paginação."""
    categorias = Categoria.objects.all().order_by('-id')
    serializer = CategoriaSerializer(categorias, many=True)
    return Response(serializer.data)


@api_view(['POST'])
def create_categoria(request):
    """Criar nova categoria."""
    serializer = CategoriaSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)


@api_view(['PUT'])
def update_categoria(request, pk):
    """Atualizar categoria existente."""
    try:
        categoria = Categoria.objects.get(pk=pk)
    except Categoria.DoesNotExist:
        return Response({'error': 'Categoria não encontrada'}, status=404)

    serializer = CategoriaSerializer(categoria, data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=400)


@api_view(['DELETE'])
def delete_categoria(request, pk):
    """Excluir categoria."""
    try:
        categoria = Categoria.objects.get(pk=pk)
    except Categoria.DoesNotExist:
        return Response({'error': 'Categoria não encontrada'}, status=404)

    categoria.delete()
    return Response(status=204)
