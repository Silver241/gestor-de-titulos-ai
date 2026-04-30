// ===== API Response Types (match Django serializers) =====
export interface Categoria {
  id: number;
  nome: string;
}

export interface Orgao {
  id: number;
  nome: string;
}

export interface Programa {
  id: number;
  nome: string;
  edicao: "bloco" | "peca";
  orgao: number;
  orgao_nome: string;
}

export interface Utilizador {
  id: number;
  nome: string;
  password?: string;
  tipo: 'admin' | 'editor';
}

export interface GrupoPeca {
  id: number;
  nome: string;
  data_emissao: string | null;
  data_registro: string;
  programa: number;
  programa_nome: string;
  pdf?: string | null;
}

export interface Peca {
  id: number;
  titulo: string;
  descricao: string | null;
  data_emissao: string | null;
  data_registro: string;
  categoria: number;
  categoria_nome: string;
  programa: number;
  programa_nome: string;
  grupo: number;  // Backend sempre retorna grupo (não null)
  grupo_nome: string;
  utilizador: number;
  utilizador_nome: string;
}

// ===== DTO Types (for creating/updating) =====
export interface CreateGrupoPecaDTO {
  nome: string;
  data_emissao: string;
  programa: number;
}

export interface CreatePecaDTO {
  titulo: string;
  descricao?: string;
  data_emissao: string;
  categoria: number;
  programa: number;
  grupo: number;  // Backend requer grupo (não null)
  utilizador: number;
}

// ===== Legacy Types (for backwards compatibility with localStorage) =====
export interface PecaWithDetails extends Peca {
  categoria_nome: string;
  programa_nome: string;
  grupo_nome: string | null;
}
