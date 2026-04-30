import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  categoriasApi,
  orgaosApi,
  programasApi,
  utilizadoresApi,
  gruposApi,
  pecasApi,
} from '@/services/endpoints';
import { Peca } from '@/types';

// ===== Categorias =====
export const useCategorias = () => {
  return useQuery({
    queryKey: ["categorias"],
    queryFn: async () => {
      const response = await categoriasApi.getAll();
      return response.data; // ✅ agora é array direto
    },
  });
};

export const useCreateCategoria = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: categoriasApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categorias'] });
      toast.success('Categoria criada com sucesso!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Erro ao criar categoria');
    },
  });
};

export const useUpdateCategoria = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => categoriasApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categorias'] });
      toast.success('Categoria atualizada com sucesso!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Erro ao atualizar categoria');
    },
  });
};

export const useDeleteCategoria = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => categoriasApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categorias'] });
      toast.success('Categoria excluída com sucesso!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Erro ao excluir categoria');
    },
  });
};

// ===== Órgãos =====
export const useOrgaos = () => {
  return useQuery({
    queryKey: ['orgaos'],
    queryFn: async () => {
      const response = await orgaosApi.getAll();
      // Backend retorna paginado: { count, next, previous, results }
      return response.data.results;
    },
  });
};

export const useCreateOrgao = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: orgaosApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orgaos'] });
      toast.success('Órgão criado com sucesso!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Erro ao criar órgão');
    },
  });
};

export const useUpdateOrgao = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => orgaosApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orgaos'] });
      toast.success('Órgão atualizado com sucesso!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Erro ao atualizar órgão');
    },
  });
};

export const useDeleteOrgao = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => orgaosApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orgaos'] });
      toast.success('Órgão excluído com sucesso!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Erro ao excluir órgão');
    },
  });
};

// ===== Programas =====
export const useProgramas = () => {
  return useQuery({
    queryKey: ["programas"],
    queryFn: async () => {
      const response = await programasApi.getAll();
      return response.data; // ✅ agora é array direto
    },
  });
};


export const useCreatePrograma = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: programasApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['programas'] });
      toast.success('Programa criado com sucesso!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Erro ao criar programa');
    },
  });
};

export const useUpdatePrograma = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => programasApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['programas'] });
      toast.success('Programa atualizado com sucesso!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Erro ao atualizar programa');
    },
  });
};

export const useDeletePrograma = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => programasApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['programas'] });
      toast.success('Programa excluído com sucesso!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Erro ao excluir programa');
    },
  });
};

// ===== Utilizadores =====
export const useUtilizadores = () => {
  return useQuery({
    queryKey: ['utilizadores'],
    queryFn: async () => {
      const response = await utilizadoresApi.getAll();
      return response.data.results;
    },
  });
};

export const useCreateUtilizador = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: utilizadoresApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['utilizadores'] });
      toast.success('Utilizador criado com sucesso!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Erro ao criar utilizador');
    },
  });
};

export const useUpdateUtilizador = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => utilizadoresApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['utilizadores'] });
      toast.success('Utilizador atualizado com sucesso!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Erro ao atualizar utilizador');
    },
  });
};

export const useDeleteUtilizador = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => utilizadoresApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['utilizadores'] });
      toast.success('Utilizador excluído com sucesso!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Erro ao excluir utilizador');
    },
  });
};

// ===== Grupos =====
export const useGrupos = (programaId?: number, page: number = 1) => {
  return useQuery({
    queryKey: ["grupos", programaId, page],
    enabled: !!programaId, // só busca quando já temos programaId
    queryFn: async () => {
      const response = await gruposApi.getAll({
        page,
        programa: programaId,
      });
      // response.data: { count, next, previous, results }
      return response.data;
    },
  });
};


export const useCreateGrupo = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: gruposApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['grupos'] });
      toast.success('Grupo criado com sucesso!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Erro ao criar grupo');
    },
  });
};

export const useDeleteGrupo = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => gruposApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['grupos'] });
      toast.success('Grupo excluído com sucesso!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Erro ao excluir grupo');
    },
  });
};

interface PaginatedResult<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export const usePecas = (
  programaId?: number,
  grupoId?: number | null,
  page: number = 1
) => {
  return useQuery({
    queryKey: ["pecas", programaId, grupoId, page],
    queryFn: async () => {
      const params: Record<string, any> = { page };

      if (programaId) {
        params.programa = programaId;
      }

      if (grupoId !== undefined && grupoId !== null) {
        params.grupo = grupoId;
      }

      const response = await pecasApi.getAll(params);
      return response.data as PaginatedResult<Peca>;
    },
  });
};


export const useAllPecasByPrograma = (programaId?: number) => {
  return useQuery({
    queryKey: ["pecas-all-programa", programaId],
    enabled: !!programaId,
    queryFn: async () => {
      let page = 1;
      let allPecas: Peca[] = [];
      let hasNext = true;

      while (hasNext) {
        // 👇 AQUI: passa um objeto, não o número direto
        const response = await pecasApi.getAll({ page });

        const data = response.data as {
          results: Peca[];
          next: string | null;
        };

        let pageResults = data.results ?? [];

        if (programaId) {
          pageResults = pageResults.filter(
            (p) => p.programa === programaId
          );
        }

        allPecas = allPecas.concat(pageResults);

        if (data.next) {
          page += 1;
        } else {
          hasNext = false;
        }
      }

      return allPecas.sort(
        (a, b) =>
          new Date(b.data_registro).getTime() -
          new Date(a.data_registro).getTime()
      );
    },
  });
};


export const useCreatePeca = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: pecasApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pecas'] });
      toast.success('Peça criada com sucesso!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Erro ao criar peça');
    },
  });
};

export const useUpdatePeca = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => pecasApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pecas'] });
      toast.success('Peça atualizada com sucesso!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Erro ao atualizar peça');
    },
  });
};

export const useDeletePeca = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => pecasApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pecas'] });
      toast.success('Peça excluída com sucesso!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Erro ao excluir peça');
    },
  });
};

export const useUploadGrupoPdf = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, file }: { id: number; file: File }) => {
      const formData = new FormData();
      formData.append("pdf", file);
      return gruposApi.uploadPdf(id, formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["grupos"] });
      toast.success("Pré-alinhamento (PDF) atualizado com sucesso!");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.error ||
          "Erro ao enviar o pré-alinhamento (PDF)"
      );
    },
  });
};

