import { apiClient } from './api';
import type {
  Categoria,
  Orgao,
  Programa,
  Utilizador,
  GrupoPeca,
  Peca,
  CreateGrupoPecaDTO,
  CreatePecaDTO,
} from '@/types';

// ===============================
// Paginação Genérica
// ===============================
export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// ===============================
// Categorias (agora paginado)
// ===============================
export const categoriasApi = {
  getAll: () => apiClient.get<Categoria[]>("/categorias/"),
  create: (data: { nome: string }) =>
    apiClient.post<Categoria>("/categorias/create/", data),
  update: (id: number, data: { nome: string }) =>
    apiClient.put<Categoria>(`/categorias/update/${id}/`, data),
  delete: (id: number) => apiClient.delete(`/categorias/delete/${id}/`),
};

// ===============================
// Órgãos
// ===============================
export const orgaosApi = {
  getAll: () => apiClient.get<PaginatedResponse<Orgao>>('/orgaos/'),
  create: (data: { nome: string }) =>
    apiClient.post<Orgao>('/orgaos/create/', data),
  update: (id: number, data: { nome: string }) =>
    apiClient.put<Orgao>(`/orgaos/update/${id}/`, data),
  delete: (id: number) => apiClient.delete(`/orgaos/delete/${id}/`),
};

// ===============================
// Programas
// ===============================
export const programasApi = {
  getAll: () => apiClient.get<Programa[]>("/programas/"),
  create: (data: { nome: string; edicao: "bloco" | "peca"; orgao: number }) =>
    apiClient.post<Programa>("/programas/create/", data),
  update: (id: number, data: { nome: string; edicao: "bloco" | "peca"; orgao: number }) =>
    apiClient.put<Programa>(`/programas/update/${id}/`, data),
  delete: (id: number) => apiClient.delete(`/programas/delete/${id}/`),
};


// ===============================
// Auth
// ===============================
export const authApi = {
  login: (credentials: { nome: string; password: string }) =>
    apiClient.post('/utilizadores/login/', credentials),
};

// ===============================
// Utilizadores (com paginação)
// ===============================
export const utilizadoresApi = {
  getAll: () => apiClient.get<PaginatedResponse<Utilizador>>('/utilizadores/'),
  create: (data: { nome: string; password: string; tipo: string }) =>
    apiClient.post<Utilizador>('/utilizadores/create/', data),
  update: (id: number, data: { nome: string; password?: string; tipo?: string }) =>
    apiClient.put<Utilizador>(`/utilizadores/update/${id}/`, data),
  delete: (id: number) => apiClient.delete(`/utilizadores/delete/${id}/`),
};

// ===============================
// Grupo de Peças (paginado)
// ===============================
// services/endpoints.ts
export const gruposApi = {
  // 👇 AGORA ACEITA params
  getAll: (params?: { page?: number; programa?: number }) =>
    apiClient.get("/grupo_pecas/", { params }),

  create: (data: any) =>
    apiClient.post("/grupo_pecas/create/", data),

  update: (id: number, data: any) =>
    apiClient.put(`/grupo_pecas/update/${id}/`, data),

  delete: (id: number) =>
    apiClient.delete(`/grupo_pecas/delete/${id}/`),

  uploadPdf: (id: number, formData: FormData) =>
    apiClient.patch(`/grupo_pecas/${id}/upload-pdf/`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
};


// ===============================
// Peças (paginado)
// ===============================
export const pecasApi = {
  getAll: (params?: Record<string, any>) =>
    apiClient.get<PaginatedResponse<Peca>>("/pecas/", { params }),
  create: (data: CreatePecaDTO) =>
    apiClient.post<Peca>('/pecas/create/', data),
  update: (id: number, data: CreatePecaDTO) =>
    apiClient.put<Peca>(`/pecas/update/${id}/`, data),
  delete: (id: number) => apiClient.delete(`/pecas/delete/${id}/`),
};

export const aiApi = {
  suggestPecaTitles: (data: { titulo: string; contexto?: string }) =>
    apiClient.post<{ suggestions: string[] }>("/ai/suggest-peca-titles/", data),
};