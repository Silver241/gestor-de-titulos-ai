

CREATE TABLE IF NOT EXISTS categoria (
    id          BIGSERIAL PRIMARY KEY,
    nome        TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS orgao (
    id          BIGSERIAL PRIMARY KEY,
    nome        TEXT NOT NULL UNIQUE
);


CREATE TYPE programa_edicao AS ENUM ('bloco', 'peca');

CREATE TABLE IF NOT EXISTS programa (
    id          BIGSERIAL PRIMARY KEY,
    nome        TEXT NOT NULL,
    edicao      programa_edicao NOT NULL,
    orgao_id    BIGINT NOT NULL REFERENCES orgao(id)
                    ON UPDATE CASCADE
                    ON DELETE RESTRICT,
    UNIQUE (nome, orgao_id)
);


CREATE TABLE IF NOT EXISTS utilizador (
    id          BIGSERIAL PRIMARY KEY,
    nome        TEXT NOT NULL,
    password    TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS grupo_pecas (
    id              BIGSERIAL PRIMARY KEY,
    nome            TEXT NOT NULL,
    data_emissao    DATE,
    data_registro   TIMESTAMP WITH TIME ZONE DEFAULT now(),
    programa_id     BIGINT NOT NULL REFERENCES programa(id) ON UPDATE CASCADE ON DELETE RESTRICT,
    UNIQUE (nome, programa_id)
);

CREATE TABLE IF NOT EXISTS peca (
    id              BIGSERIAL PRIMARY KEY,
    titulo          TEXT NOT NULL,
    descricao       TEXT,
    data_emissao    DATE,
    data_registro   TIMESTAMP WITH TIME ZONE DEFAULT now(),

    categoria_id    BIGINT NOT NULL REFERENCES categoria(id)   ON UPDATE CASCADE ON DELETE RESTRICT,
    programa_id     BIGINT NOT NULL REFERENCES programa(id)    ON UPDATE CASCADE ON DELETE RESTRICT,
    grupo_id        BIGINT NOT NULL REFERENCES grupo_pecas(id) ON UPDATE CASCADE ON DELETE RESTRICT,
    utilizador_id   BIGINT NOT NULL REFERENCES utilizador(id)  ON UPDATE CASCADE ON DELETE RESTRICT
);



