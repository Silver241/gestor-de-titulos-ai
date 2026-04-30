# core/serializers.py
from rest_framework import serializers
from ..models import (
    Categoria,
    Orgao,
    Programa,
    Utilizador,
    GrupoPecas,
    Peca,
)


class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = ["id", "nome"]


class OrgaoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Orgao
        fields = ["id", "nome"]


class ProgramaSerializer(serializers.ModelSerializer):
    orgao_nome = serializers.CharField(source="orgao.nome", read_only=True)
    edicao = serializers.ChoiceField(choices=["bloco", "peca"])

    class Meta:
        model = Programa
        fields = ["id", "nome", "edicao", "orgao", "orgao_nome"]

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data["edicao"] = getattr(instance.edicao, "value", str(instance.edicao))
        return data



class UtilizadorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Utilizador
        fields = ["id", "nome", "password", "tipo"]
        extra_kwargs = {
            "password": {
                "write_only": True,
                "required": False,
                "allow_blank": True,
            }
        }



class GrupoPecasSerializer(serializers.ModelSerializer):
    programa_nome = serializers.CharField(source="programa.nome", read_only=True)

    class Meta:
        model = GrupoPecas
        fields = [
            "id",
            "nome",
            "data_emissao",
            "data_registro",
            "programa",
            "pdf",
            "programa_nome",
        ]


class PecaSerializer(serializers.ModelSerializer):
    categoria_nome = serializers.CharField(source="categoria.nome", read_only=True)
    programa_nome = serializers.CharField(source="programa.nome", read_only=True)
    grupo_nome = serializers.CharField(source="grupo.nome", read_only=True)
    utilizador_nome = serializers.CharField(source="utilizador.nome", read_only=True)

    class Meta:
        model = Peca
        fields = [
            "id",
            "titulo",
            "descricao",
            "data_emissao",
            "data_registro",
            "categoria",
            "categoria_nome",
            "programa",
            "programa_nome",
            "grupo",
            "grupo_nome",
            "utilizador",
            "utilizador_nome",
        ]
