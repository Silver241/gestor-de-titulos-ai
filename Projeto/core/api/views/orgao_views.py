# core/api/views/orgao_views.py
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.pagination import PageNumberPagination
from core.models import Orgao
from core.api.serializers import OrgaoSerializer


@api_view(['GET'])
def get_orgaos(request):
    """Listar todos os órgãos com paginação."""
    orgaos = Orgao.objects.all().order_by('-id')
    paginator = PageNumberPagination()
    page = paginator.paginate_queryset(orgaos, request)
    serializer = OrgaoSerializer(page, many=True)
    return paginator.get_paginated_response(serializer.data)


@api_view(['POST'])
def create_orgao(request):
    """Criar novo órgão."""
    serializer = OrgaoSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)


@api_view(['PUT'])
def update_orgao(request, pk):
    """Atualizar órgão existente."""
    try:
        orgao = Orgao.objects.get(pk=pk)
    except Orgao.DoesNotExist:
        return Response({'error': 'Órgão não encontrado'}, status=404)

    serializer = OrgaoSerializer(orgao, data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=400)


@api_view(['DELETE'])
def delete_orgao(request, pk):
    """Excluir órgão."""
    try:
        orgao = Orgao.objects.get(pk=pk)
    except Orgao.DoesNotExist:
        return Response({'error': 'Órgão não encontrado'}, status=404)

    orgao.delete()
    return Response(status=204)
