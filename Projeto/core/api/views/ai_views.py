import json
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.conf import settings

from openai import OpenAI


def _safe_json_list(text: str):
    """
    Tenta extrair uma lista JSON do texto.
    Se falhar, retorna lista vazia.
    """
    try:
        data = json.loads(text)
        if isinstance(data, list):
            return [str(x) for x in data]
        return []
    except Exception:
        return []


@api_view(["POST"])
def suggest_peca_titles(request):
    """
    Recebe: { "titulo": "...", "contexto": "..." opcional }
    Retorna: { "suggestions": ["...", "..."] }
    """
    titulo = (request.data.get("titulo") or "").strip()
    contexto = (request.data.get("contexto") or "").strip()

    if not titulo:
        return Response({"error": "Campo 'titulo' é obrigatório."}, status=400)

    # ✅ Pega a chave diretamente do settings.py
    api_key = getattr(settings, "OPENAI_API_KEY", None)

    if not api_key:
        return Response(
            {"error": "OPENAI_API_KEY não configurada no settings.py"},
            status=500,
        )

    client = OpenAI(api_key=api_key)

    prompt = f"""
Gera 3 alternativas para o título acima, sempre em Português de Portugal.
Regras:
- Cada alternativa com MENOS DE 100 caracteres
- Mais apelativa ao clique, clara e curta
- Mantém o sentido original, sem inventar factos
- Evita duplos espaços, emojis e erros ortográficos
- Remove palavras redundantes se fizer sentido
- Devolve APENAS um JSON válido: ["t1","t2","t3"]
Título base: {titulo}
""".strip()

    try:
        resp = client.responses.create(
            model="gpt-4o-mini",
            input=prompt,
            max_output_tokens=120,
        )

        text = getattr(resp, "output_text", "") or ""
        suggestions = _safe_json_list(text)

        # higiene final
        suggestions = [s.strip() for s in suggestions if s]
        suggestions = [s[:99] for s in suggestions]  # garante <100 chars
        suggestions = suggestions[:3]

        return Response({"suggestions": suggestions})

    except Exception as e:
        return Response(
            {
                "error": "Falha ao gerar sugestões de título.",
                "detail": str(e),
            },
            status=500,
        )
