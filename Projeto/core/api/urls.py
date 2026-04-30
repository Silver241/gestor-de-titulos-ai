from django.urls import path
from core.api.views import (
    grupo_peca_views,
    orgao_views,
    categoria_views,
    programa_views,
    utilizador_views,
    peca_views,
    ai_views
)

urlpatterns = [
    # -----------------------------
    # Órgão URLs
    # -----------------------------
    path('orgaos/', orgao_views.get_orgaos, name='get_orgaos'),
    path('orgaos/create/', orgao_views.create_orgao, name='create_orgao'),
    path('orgaos/update/<int:pk>/', orgao_views.update_orgao, name='update_orgao'),
    path('orgaos/delete/<int:pk>/', orgao_views.delete_orgao, name='delete_orgao'),

    # -----------------------------
    # Categoria URLs
    # -----------------------------
    path('categorias/', categoria_views.get_categorias, name='get_categorias'),
    path('categorias/create/', categoria_views.create_categoria, name='create_categoria'),
    path('categorias/update/<int:pk>/', categoria_views.update_categoria, name='update_categoria'),
    path('categorias/delete/<int:pk>/', categoria_views.delete_categoria, name='delete_categoria'),

    # -----------------------------
    # Programa URLs
    # -----------------------------
    path('programas/', programa_views.get_programas, name='get_programas'),
    path('programas/create/', programa_views.create_programa, name='create_programa'),
    path('programas/update/<int:pk>/', programa_views.update_programa, name='update_programa'),
    path('programas/delete/<int:pk>/', programa_views.delete_programa, name='delete_programa'),

    # -----------------------------
    # Utilizador URLs
    # -----------------------------
    path('utilizadores/', utilizador_views.get_utilizadores, name='get_utilizadores'),
    path('utilizadores/create/', utilizador_views.create_utilizador, name='create_utilizador'),
    path('utilizadores/update/<int:pk>/', utilizador_views.update_utilizador, name='update_utilizador'),
    path('utilizadores/delete/<int:pk>/', utilizador_views.delete_utilizador, name='delete_utilizador'),
    path('utilizadores/login/', utilizador_views.login_utilizador, name='login_utilizador'),


    # -----------------------------
    # Grupo de Peças URLs
    # -----------------------------
    path('grupo_pecas/', grupo_peca_views.get_grupo_pecas, name='get_grupo_pecas'),
    path('grupo_pecas/create/', grupo_peca_views.create_grupo_pecas, name='create_grupo_pecas'),
    path('grupo_pecas/update/<int:pk>/', grupo_peca_views.update_grupo_pecas, name='update_grupo_pecas'),
    path('grupo_pecas/delete/<int:pk>/', grupo_peca_views.delete_grupo_pecas, name='delete_grupo_pecas'),
    path('grupo_pecas/<int:pk>/upload-pdf/',grupo_peca_views.update_grupo_pecas_pdf,name='update_grupo_pecas_pdf',
),

    # -----------------------------
    # Peça URLs
    # -----------------------------
    path('pecas/', peca_views.get_pecas, name='get_pecas'),
    path('pecas/create/', peca_views.create_peca, name='create_peca'),
    path('pecas/update/<int:pk>/', peca_views.update_peca, name='update_peca'),
    path('pecas/delete/<int:pk>/', peca_views.delete_peca, name='delete_peca'),

    path("teste/protegido/", utilizador_views.private_view),

    # -----------------------------
    # AI URLs
    # -----------------------------
    path("ai/suggest-peca-titles/", ai_views.suggest_peca_titles, name="suggest_peca_titles"),
]

