# Integração com API Django REST

Este documento descreve como o frontend foi preparado para consumir a API Django REST.

## Estrutura de Arquivos

### Serviços da API
- **`src/services/api.ts`**: Configuração base do Axios com interceptors para autenticação e tratamento de erros
- **`src/services/endpoints.ts`**: Funções para todos os endpoints da API (categorias, órgãos, programas, utilizadores, grupos, peças)

### Hooks React Query
- **`src/hooks/useApi.ts`**: Hooks personalizados usando React Query para:
  - Buscar dados (`useCategorias`, `useOrgaos`, `useProgramas`, `useGrupos`, `usePecas`)
  - Criar registros (`useCreateGrupo`, `useCreatePeca`)
  - Atualizar registros (`useUpdatePeca`)
  - Excluir registros (`useDeleteGrupo`, `useDeletePeca`)

### Tipos TypeScript
- **`src/types/index.ts`**: Tipos atualizados para corresponder aos serializers Django:
  - `Categoria`, `Orgao`, `Programa`, `Utilizador`, `GrupoPeca`, `Peca`
  - DTOs para criar/atualizar: `CreateGrupoPecaDTO`, `CreatePecaDTO`

## Configuração

### 1. Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
VITE_API_BASE_URL=http://localhost:8000/api
```

Substitua `http://localhost:8000` pela URL do seu backend Django em produção.

### 2. Dependências

O projeto já inclui:
- `axios` - Cliente HTTP
- `@tanstack/react-query` - Gerenciamento de estado assíncrono

## Uso

### Exemplo: Buscar Peças

```typescript
import { usePecas } from '@/hooks/useApi';

function MinhasComponent() {
  const { data: pecas, isLoading, error } = usePecas();

  if (isLoading) return <div>Carregando...</div>;
  if (error) return <div>Erro ao carregar peças</div>;

  return (
    <div>
      {pecas?.map(peca => (
        <div key={peca.id}>{peca.titulo}</div>
      ))}
    </div>
  );
}
```

### Exemplo: Criar Grupo

```typescript
import { useCreateGrupo } from '@/hooks/useApi';

function MeuForm() {
  const createGrupo = useCreateGrupo();

  const handleSubmit = async (data: CreateGrupoPecaDTO) => {
    const result = await createGrupo.mutateAsync(data);
    console.log('Grupo criado:', result.data);
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* campos do formulário */}
    </form>
  );
}
```

## Endpoints Disponíveis

### Categorias
- `GET /categorias/` - Listar todas
- `POST /categorias/create/` - Criar nova
- `PUT /categorias/update/:id/` - Atualizar
- `DELETE /categorias/delete/:id/` - Excluir

### Órgãos
- `GET /orgaos/` - Listar todas
- `POST /orgaos/create/` - Criar nova
- `PUT /orgaos/update/:id/` - Atualizar
- `DELETE /orgaos/delete/:id/` - Excluir

### Programas
- `GET /programas/` - Listar todos
- `POST /programas/create/` - Criar novo
- `PUT /programas/update/:id/` - Atualizar
- `DELETE /programas/delete/:id/` - Excluir

### Utilizadores
- `GET /utilizadores/` - Listar todos
- `POST /utilizadores/create/` - Criar novo
- `PUT /utilizadores/update/:id/` - Atualizar
- `DELETE /utilizadores/delete/:id/` - Excluir

### Grupos de Peças
- `GET /grupo_pecas/` - Listar todos
- `POST /grupo_pecas/create/` - Criar novo
- `PUT /grupo_pecas/update/:id/` - Atualizar
- `DELETE /grupo_pecas/delete/:id/` - Excluir

### Peças
- `GET /pecas/` - Listar todas (paginado)
- `POST /pecas/create/` - Criar nova
- `PUT /pecas/update/:id/` - Atualizar
- `DELETE /pecas/delete/:id/` - Excluir

## Autenticação

O sistema está preparado para autenticação via token Bearer. Os tokens são:
- Armazenados em `localStorage` com a chave `auth_token`
- Adicionados automaticamente em todos os requests via interceptor Axios
- Removidos e redirecionam para login em caso de erro 401

## Próximos Passos

1. **Migrar do localStorage para API**: Atualizar os componentes para usar os hooks da API em vez das funções `localStorage`
2. **Implementar autenticação**: Adicionar endpoint de login e gerenciamento de tokens
3. **Tratamento de erros**: Melhorar feedback visual para erros da API
4. **Otimização**: Implementar cache strategies no React Query
5. **Testes**: Adicionar testes unitários para os serviços da API

## Estado Atual

✅ Estrutura de serviços criada
✅ Hooks React Query implementados
✅ Tipos TypeScript atualizados
✅ Configuração do Axios com interceptors
⏳ Componentes ainda usam localStorage (próxima etapa de migração)
