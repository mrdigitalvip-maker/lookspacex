# Arquitetura do LookSpace

## Visão Geral

O LookSpace é construído seguindo uma arquitetura modular e escalável, organizada em camadas bem definidas:

- **App Layer**: Rotas e layouts do Next.js (App Router)
- **Components Layer**: Componentes reutilizáveis de UI
- **Modules Layer**: Lógica de negócio separada por domínio
- **Services Layer**: Integração com APIs e externos
- **Data Layer**: Supabase e gerenciamento de estado

## Padrão de Módulos

Cada módulo (`auth`, `game`, `ship`, etc.) segue a mesma estrutura:

```
modules/
└── [module-name]/
    ├── components/      # Componentes específicos do módulo
    ├── hooks/           # Custom hooks do módulo
    ├── services/        # Lógica de negócio e API
    ├── types/           # Tipos TypeScript do módulo
    └── index.ts         # Barrel export
```

### Separação de Responsabilidades

1. **Components**: Apenas UI, recebem dados via props
2. **Hooks**: Lógica reutilizável e estado local
3. **Services**: Chamadas à API, transformação de dados
4. **Types**: Contatos TypeScript e interfaces

## Decisões de Arquitetura

### 1. App Router (Next.js)

- Rotas convencionais baseadas em arquivos
- Layout nesting automático
- Server Components por padrão

### 2. TypeScript Strict

- Máxima segurança de tipos
- Sem uso de `any`
- Configuração: `strict: true`, `exactOptionalPropertyTypes: true`

### 3. Tailwind CSS

- Utility-first CSS
- Variáveis CSS para paleta de cores espacial
- Nenhum CSS-in-JS, apenas classes

### 4. Supabase

- PostgreSQL como banco de dados
- Autenticação com JWT
- Real-time subscriptions (futuro)
- Storage para assets (futuro)

### 5. Ausência de State Management Global Inicial

- Armazenamento a nível de módulo
- Preparação para Zustand ou Jotai quando necessário
- Evita over-engineering no início

## Aliases de Importação

Para melhor legibilidade e refatoração:

```typescript
import { Button } from '@components/ui'
import { useAuth } from '@modules/auth/hooks'
import { cn } from '@utils/cn'
import { ROUTES } from '@config/routes'
import type { Database } from '@types/supabase'
```

## Camada de Serviços

A função `fetcher` fornece:

- Tipagem genérica completa
- Tratamento de erros centralizado
- Headers automáticos
- Classe `ApiError` customizada

## Boas Práticas Implementadas

1. **Não há duplicação de código**
   - Utilitários e tipos centralizados
   - Barrel exports para organização

2. **Separação clara de responsabilidades**
   - UI components não contêm lógica
   - Serviços não retornam JSX

3. **Segurança de Tipos Total**
   - Supabase tipado com Database
   - Sem `any` em lugar nenhum

4. **Performance First**
   - Server Components por padrão
   - Code splitting automático

5. **Escalabilidade**
   - Fácil adicionar novos módulos
   - Estrutura consistente
   - Documentação clara
