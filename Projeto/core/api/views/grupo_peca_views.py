# core/api/views/grupo_pecas_views.py
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.pagination import PageNumberPagination
from core.models import GrupoPecas
from core.api.serializers import GrupoPecasSerializer
from django.shortcuts import get_object_or_404


@api_view(['GET'])
def get_grupo_pecas(request):
    """
    Listar grupos de peças com paginação.
    Aceita filtro opcional ?programa=<id>.
    """
    grupos = (
        GrupoPecas.objects
        .select_related("programa")
        .all()
        .order_by('-id')
    )

    # 👇 filtro opcional por programa
    programa_id = request.GET.get("programa")
    if programa_id:
        grupos = grupos.filter(programa_id=programa_id)

    paginator = PageNumberPagination()
    paginator.page_size = 5  # 👈 5 grupos por página

    page = paginator.paginate_queryset(grupos, request)
    if page is not None:
        serializer = GrupoPecasSerializer(
            page,
            many=True,
            context={"request": request},
        )
        return paginator.get_paginated_response(serializer.data)

    serializer = GrupoPecasSerializer(
        grupos,
        many=True,
        context={"request": request},
    )
    return Response(serializer.data)


@api_view(['POST'])
def create_grupo_pecas(request):
    """Criar novo grupo de peças."""
    serializer = GrupoPecasSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)


@api_view(['PUT'])
def update_grupo_pecas(request, pk):
    """Atualizar grupo de peças existente."""
    try:
        grupo = GrupoPecas.objects.get(pk=pk)
    except GrupoPecas.DoesNotExist:
        return Response({'error': 'Grupo de peças não encontrado'}, status=404)

    serializer = GrupoPecasSerializer(grupo, data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=400)


@api_view(['DELETE'])
def delete_grupo_pecas(request, pk):
    """Excluir grupo de peças."""
    try:
        grupo = GrupoPecas.objects.get(pk=pk)
    except GrupoPecas.DoesNotExist:
        return Response({'error': 'Grupo de peças não encontrado'}, status=404)

    grupo.delete()
    return Response(status=204)


@api_view(['PATCH'])
def update_grupo_pecas_pdf(request, pk):
    """
    Atualizar apenas o PDF de um grupo de peças existente.
    Pode ser usado para adicionar um PDF onde antes era null
    ou trocar o PDF atual.
    """
    grupo = get_object_or_404(GrupoPecas, pk=pk)

    # partial=True => não obriga a enviar nome, programa, etc.
    serializer = GrupoPecasSerializer(grupo, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)

    return Response(serializer.errors, status=400)
