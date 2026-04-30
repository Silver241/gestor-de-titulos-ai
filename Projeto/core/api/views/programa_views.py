# core/api/views/programa_views.py
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.pagination import PageNumberPagination
from core.models import Programa
from core.api.serializers import ProgramaSerializer


@api_view(['GET'])
def get_programas(request):
    """Listar todos os programas (sem paginação)."""
    programas = Programa.objects.select_related("orgao").all().order_by('-id')
    serializer = ProgramaSerializer(programas, many=True)
    return Response(serializer.data)


@api_view(['POST'])
def create_programa(request):
    """Criar novo programa."""
    serializer = ProgramaSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)


@api_view(['PUT'])
def update_programa(request, pk):
    """Atualizar programa existente."""
    try:
        programa = Programa.objects.get(pk=pk)
    except Programa.DoesNotExist:
        return Response({'error': 'Programa não encontrado'}, status=404)

    serializer = ProgramaSerializer(programa, data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=400)


@api_view(['DELETE'])
def delete_programa(request, pk):
    """Excluir programa."""
    try:
        programa = Programa.objects.get(pk=pk)
    except Programa.DoesNotExist:
        return Response({'error': 'Programa não encontrado'}, status=404)

    programa.delete()
    return Response(status=204)
