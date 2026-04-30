# core/models.py
from django.db import models
from django.utils import timezone
from enum import Enum
from django.contrib.auth.models import User
from django.core.files.storage import FileSystemStorage


# --- Campo custom para mapear o ENUM PostgreSQL existente --------------------
class ProgramaEdicaoEnum(str, Enum):
    BLOCO = "bloco"
    PECA = "peca"


class ProgramaEdicaoField(models.Field):
    """
    Mapeia o tipo PostgreSQL ENUM 'programa_edicao'.
    Certifica-te de criar o ENUM via migration (RunSQL) antes de migrar as tabelas.
    """
    description = "PostgreSQL ENUM: programa_edicao(bloco|peca)"

    def db_type(self, connection):
        return "programa_edicao"

    def from_db_value(self, value, expression, connection):
        return None if value is None else ProgramaEdicaoEnum(value)

    def to_python(self, value):
        if value is None or isinstance(value, ProgramaEdicaoEnum):
            return value
        # aceitar strings diretamente também
        return ProgramaEdicaoEnum(value)

    def get_prep_value(self, value):
        if value is None:
            return None
        # guardar como string no DB
        return str(value.value if isinstance(value, ProgramaEdicaoEnum) else value)

    def deconstruct(self):
        name, path, args, kwargs = super().deconstruct()
        # sem args/kwargs extras
        return name, path, args, kwargs


# --- Tabelas -----------------------------------------------------------------
class Categoria(models.Model):
    id = models.BigAutoField(primary_key=True)
    nome = models.TextField(unique=True)

    class Meta:
        db_table = "categoria"

    def __str__(self):
        return self.nome


class Orgao(models.Model):
    id = models.BigAutoField(primary_key=True)
    nome = models.TextField(unique=True)

    class Meta:
        db_table = "orgao"

    def __str__(self):
        return self.nome


class Programa(models.Model):
    id = models.BigAutoField(primary_key=True)
    nome = models.TextField()
    edicao = ProgramaEdicaoField()  # ENUM PostgreSQL: 'bloco' | 'peca'
    orgao = models.ForeignKey(
        Orgao,
        on_delete=models.PROTECT,      # ON DELETE RESTRICT
        related_name="programas",
        db_column="orgao_id",
    )

    class Meta:
        db_table = "programa"
        constraints = [
            models.UniqueConstraint(fields=["nome", "orgao"], name="uq_programa_nome_orgao"),
        ]

    def __str__(self):
        return f"{self.nome} ({self.orgao})"


class Utilizador(models.Model):
    TIPO_CHOICES = [
        ('admin', 'Administrador'),
        ('editor', 'Editor'),
    ]

    id = models.BigAutoField(primary_key=True)
    nome = models.TextField()
    password = models.TextField()
    tipo = models.CharField(
        max_length=10,
        choices=TIPO_CHOICES,
        default='editor'
    )

    # 🔥 LIGAÇÃO COM O DJANGO USER
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="perfil"
    )

    class Meta:
        db_table = "utilizador"

    def __str__(self):
        return f"{self.nome} ({self.tipo})"


pdf_storage = FileSystemStorage(location="media/pdfs/")

class GrupoPecas(models.Model):
    id = models.BigAutoField(primary_key=True)
    nome = models.TextField()
    data_emissao = models.DateField(null=True, blank=True)
    # TIMESTAMP WITH TIME ZONE DEFAULT now()
    data_registro = models.DateTimeField(default=timezone.now)
    programa = models.ForeignKey(
        Programa,
        on_delete=models.PROTECT,      # ON DELETE RESTRICT
        related_name="grupos",
        db_column="programa_id",
    )
    
        # Caminho do PDF
    pdf = models.FileField(
        upload_to="grupos_pdfs/",
        null=True,
        blank=True
    )

    class Meta:
        db_table = "grupo_pecas"
        constraints = [
            models.UniqueConstraint(fields=["nome", "programa"], name="uq_grupo_pecas_nome_programa"),
        ]

    def __str__(self):
        return f"{self.nome} ({self.programa})"


class Peca(models.Model):
    id = models.BigAutoField(primary_key=True)
    titulo = models.TextField()
    descricao = models.TextField(null=True, blank=True)
    data_emissao = models.DateField(null=True, blank=True)
    # TIMESTAMP WITH TIME ZONE DEFAULT now()
    data_registro = models.DateTimeField(default=timezone.now)

    categoria = models.ForeignKey(
        Categoria,
        on_delete=models.PROTECT,      # ON DELETE RESTRICT
        related_name="pecas",
        db_column="categoria_id",
    )
    programa = models.ForeignKey(
        Programa,
        on_delete=models.PROTECT,      # ON DELETE RESTRICT
        related_name="pecas",
        db_column="programa_id",
    )
    grupo = models.ForeignKey(
        GrupoPecas,
        on_delete=models.PROTECT,      # ON DELETE RESTRICT
        related_name="pecas",
        db_column="grupo_id",
        null=True,      # <── agora aceita valores nulos na base de dados
        blank=True,     # <── permite campo vazio em formulários/admin
    )
    utilizador = models.ForeignKey(
        Utilizador,
        on_delete=models.PROTECT,      # ON DELETE RESTRICT
        related_name="pecas",
        db_column="utilizador_id",
    )

    class Meta:
        db_table = "peca"

    def __str__(self):
        return self.titulo
    

