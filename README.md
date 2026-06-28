# LookSpace

Um jogo de exploração espacial futurista desenvolvido com Next.js 14+, TypeScript, Tailwind CSS e Supabase.

## Stack Tecnológico

- **Framework**: Next.js 14+ (App Router)
- **Linguagem**: TypeScript (strict mode)
- **Styling**: Tailwind CSS
- **Backend**: Supabase (PostgreSQL)
- **Deploy**: Vercel

## Estrutura de Pastas

```
src/
├── app/              # Rotas e layouts do Next.js (App Router)
├── components/       # Componentes reutilizáveis
├── modules/          # Módulos de funcionalidades (auth, game, etc)
├── lib/              # Utilitários e clientes (Supabase)
├── services/         # Serviços de API e dados
├── hooks/            # Custom hooks do React
├── stores/           # Gerenciamento de estado global
├── types/            # Tipos TypeScript
├── utils/            # Funções utilitárias
├── config/           # Constantes de configuração
├── styles/           # Estilos globais e variáveis CSS
├── assets/           # Imagens, ícones, fontes, áudio
└── i18n/             # Internacionalização
```

## Configuração Inicial

### Pré-requisitos

- Node.js 18+
- npm ou yarn

### Instalação

1. Clone o repositório:
```bash
git clone https://github.com/mrdigitalvip-maker/lookspacex.git
cd lookspacex
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env.local
```

Preencha as variáveis com suas credenciais do Supabase:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

### Desenvolvimento

```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:3000`

### Build para Produção

```bash
npm run build
npm start
```

## Variáveis de Ambiente

| Variável | Descrição | Obrigatória |
|----------|-----------|------------|
| `NEXT_PUBLIC_APP_URL` | URL da aplicação | Sim |
| `NEXT_PUBLIC_SUPABASE_URL` | URL do projeto Supabase | Sim |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Chave anônima do Supabase | Sim |
| `SUPABASE_SERVICE_ROLE_KEY` | Chave de serviço do Supabase | Sim |

## Módulos

Veja [docs/MODULES.md](docs/MODULES.md) para uma descrição completa de cada módulo.

## Convenções

Veja [docs/CONVENTIONS.md](docs/CONVENTIONS.md) para as convenções de código do projeto.

## Arquitetura

Veja [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) para detalhes sobre a arquitetura do projeto.

## Roadmap

Veja [docs/ROADMAP.md](docs/ROADMAP.md) para o plano de desenvolvimento.

## Contribuindo

(Guia de contribuição será adicionado aqui)

## Licença

MIT