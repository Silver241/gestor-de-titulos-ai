import { Utilizador, Orgao, Programa, Categoria, GrupoPeca, Peca } from "@/types";

export const utilizadores: Utilizador[] = [
  { id: 1, nome: "Administrator", password: "admin123", tipo: "admin" },
  { id: 2, nome: "Content Editor", password: "editor123", tipo: "editor" },
  { id: 3, nome: "TV Producer", password: "prod123", tipo: "editor" },
];

export const orgaos: Orgao[] = [
  { id: 1, nome: "TCV" },
  { id: 2, nome: "RCV" },
];

export const programas: Programa[] = [
  { id: 1, nome: "Jornal da Noite", edicao: "bloco", orgao: 1, orgao_nome: "TCV" },
  { id: 2, nome: "Jornal da Tarde", edicao: "bloco", orgao: 1, orgao_nome: "TCV" },
  { id: 3, nome: "Show da Manhã", edicao: "peca", orgao: 1, orgao_nome: "TCV" },
  { id: 4, nome: "Desporto em Foco", edicao: "bloco", orgao: 2, orgao_nome: "RCV" },
  { id: 5, nome: "Cultura Viva", edicao: "peca", orgao: 2, orgao_nome: "RCV" },
  { id: 6, nome: "Entrevista Exclusiva", edicao: "bloco", orgao: 1, orgao_nome: "TCV" },
];

export const categorias: Categoria[] = [
  { id: 1, nome: "Notícias" },
  { id: 2, nome: "Desporto" },
  { id: 3, nome: "Cultura" },
  { id: 4, nome: "Economia" },
  { id: 5, nome: "Política" },
  { id: 6, nome: "Sociedade" },
  { id: 7, nome: "Internacional" },
  { id: 8, nome: "Entretenimento" },
  { id: 9, nome: "Saúde" },
  { id: 10, nome: "Tecnologia" },
];

export const gruposPecaInitial: GrupoPeca[] = [
  {
    id: 1,
    nome: "Show da Manhã - 15 Jan",
    data_emissao: "2025-01-15",
    data_registro: "2025-01-10T10:00:00Z",
    programa: 3,
    programa_nome: "Show da Manhã",
  },
  {
    id: 2,
    nome: "Cultura Viva - 20 Jan",
    data_emissao: "2025-01-20",
    data_registro: "2025-01-15T14:30:00Z",
    programa: 5,
    programa_nome: "Cultura Viva",
  },
];

export const pecasInitial: Peca[] = [
  {
    id: 1,
    titulo: "Inauguração do Novo Hospital Nacional",
    descricao: "Cerimónia oficial marca abertura de modernas instalações de saúde em Praia",
    data_emissao: "2025-01-28",
    data_registro: "2025-01-27T10:00:00Z",
    categoria: 6,
    categoria_nome: "Sociedade",
    programa: 1,
    programa_nome: "Jornal da Noite",
    grupo: null,
    grupo_nome: null,
    utilizador: 1,
    utilizador_nome: "Administrator",
  },
  {
    id: 2,
    titulo: "Vitória da Seleção Nacional no AFCON",
    descricao: "Cabo Verde vence jogo decisivo por 2-1 contra Senegal",
    data_emissao: "2025-01-27",
    data_registro: "2025-01-27T14:30:00Z",
    categoria: 2,
    categoria_nome: "Desporto",
    programa: 4,
    programa_nome: "Desporto em Foco",
    grupo: null,
    grupo_nome: null,
    utilizador: 2,
    utilizador_nome: "Content Editor",
  },
  {
    id: 3,
    titulo: "Festival de Música Tradicional Atrai Milhares",
    descricao: "Evento cultural celebra patrimônio musical cabo-verdiano com artistas locais",
    data_emissao: "2025-01-20",
    data_registro: "2025-01-19T16:00:00Z",
    categoria: 3,
    categoria_nome: "Cultura",
    programa: 5,
    programa_nome: "Cultura Viva",
    grupo: 2,
    grupo_nome: "Cultura Viva - 20 Jan",
    utilizador: 3,
    utilizador_nome: "TV Producer",
  },
  {
    id: 4,
    titulo: "Crescimento Económico Supera Previsões",
    descricao: "PIB de Cabo Verde cresce 5.2% no último trimestre segundo dados oficiais",
    data_emissao: "2025-01-26",
    data_registro: "2025-01-26T09:15:00Z",
    categoria: 4,
    categoria_nome: "Economia",
    programa: 2,
    programa_nome: "Jornal da Tarde",
    grupo: null,
    grupo_nome: null,
    utilizador: 1,
    utilizador_nome: "Administrator",
  },
  {
    id: 5,
    titulo: "Entrevista com Chef Internacional",
    descricao: "Conversa exclusiva sobre gastronomia cabo-verdiana no cenário mundial",
    data_emissao: "2025-01-15",
    data_registro: "2025-01-14T11:45:00Z",
    categoria: 8,
    categoria_nome: "Entretenimento",
    programa: 3,
    programa_nome: "Show da Manhã",
    grupo: 1,
    grupo_nome: "Show da Manhã - 15 Jan",
    utilizador: 2,
    utilizador_nome: "Content Editor",
  },
];
