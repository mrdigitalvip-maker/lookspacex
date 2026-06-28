# Convenções de Código

## Nomenclatura

### Arquivos e Pastas

- **Pastas**: `kebab-case` (ex: `photo-mode`)
- **Componentes**: `PascalCase` (ex: `Button.tsx`)
- **Utilitários e hooks**: `camelCase` (ex: `useMediaQuery.ts`)
- **Tipos e constantes**: `PascalCase` (ex: `ButtonProps`, `ROUTES`)

### Exports

- **Componentes**: Export default nomeado com `displayName`
- **Tipos**: Prefixo com nome do componente (ex: `ButtonProps`)
- **Utilitários**: Export nomeado
- **Barrel exports**: Em arquivos `index.ts`

### Variáveis

```typescript
// ✅ Bom
const userName = 'João'
const isLoading = false
const itemCount = 5

// ❌ Ruim
const user_name = 'João'
const ISLOADING = false
const qty = 5
```

## Componentes

### Estrutura de Arquivo

```typescript
import { forwardRef } from 'react'
import { cn } from '@/utils/cn'
import type { ComponentProps } from './Component.types'

const Component = forwardRef<HTMLElement, ComponentProps>(
  ({ className, ...props }, ref) => (
    <element ref={ref} className={cn(className)} {...props} />
  )
)

Component.displayName = 'Component'

export { Component }
```

### Padrões

1. **Sempre tipado**: Interface para props obrigatória
2. **Sem hardcoded strings**: Use config ou i18n
3. **Sem lógica de negócio**: Apenas UI
4. **Sem chamadas diretas à API**: Use hooks/services
5. **Máximo 80 linhas**: Um componente = uma responsabilidade

## Imports

### Ordem de Imports

```typescript
// 1. React
import { useState } from 'react'

// 2. Next.js
import type { Metadata } from 'next'

// 3. Terceiros
import clsx from 'clsx'

// 4. Internos (absolutos com aliases)
import { Button } from '@components/ui'
import { useAuth } from '@modules/auth/hooks'

// 5. Tipos
import type { ButtonProps } from '@components/ui'
```

### Path Aliases

Sempre use aliases para imports internos:

```typescript
// ✅ Bom
import { Button } from '@components/ui'
import { fetcher } from '@services/api'

// ❌ Ruim
import { Button } from '../../../components/ui'
import { fetcher } from '../../../services/api'
```

## TypeScript

### Regras Estritas

1. **Sem `any`**: Use `unknown` com type guards
2. **Tipos explícitos**: Sempre declare o tipo de retorno
3. **Interfaces vs Types**: Prefira `interface` para objetos
4. **Genéricos**: Use quando necessário para reutilização

```typescript
// ✅ Bom
function handleData(data: unknown): string {
  if (typeof data === 'string') {
    return data
  }
  return ''
}

// ❌ Ruim
function handleData(data: any): string {
  return data.toString()
}
```

## Formatação

### ESLint + Prettier

- **Semi-colons**: Desativados
- **Single quotes**: Ativadas
- **Tab width**: 2 espaços
- **Trailing comma**: ES5
- **Print width**: 100 caracteres

```typescript
// ✅ Bom
const handleClick = () => {
  console.log('clicado')
}

// ❌ Ruim
const handleClick = () => {
  console.log("clicado");
};
```

## Estrutura de Diretórios

### Regra: Um tipo, um arquivo

- Uma interface por arquivo de tipos
- Um componente por arquivo de componente
- Um hook per arquivo

### Barrel Exports

Sempre exporte via `index.ts`:

```typescript
// src/components/ui/Button/index.ts
export { Button } from './Button'
export type { ButtonProps } from './Button.types'
```

## Comentários

- Evite comentários óbvios
- Documente decisões não-triviais
- Use JSDoc para funções públicas

```typescript
// ✅ Bom
/**
 * Formata um número para a moeda especificada
 * @param amount - O valor a ser formatado
 * @param currency - Código ISO da moeda (ex: 'USD')
 */
export function formatCurrency(amount: number, currency = 'USD'): string {
  // ...
}

// ❌ Ruim
// Retorna uma string formatada
export function formatCurrency(amount, currency) {
  // ...
}
```

## Testes (Futuro)

Quando testes forem implementados:

- Arquivos de teste: `*.test.ts` ou `*.spec.ts`
- Colocados junto ao arquivo testado
- Mínimo 80% de cobertura
