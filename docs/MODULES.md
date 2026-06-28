# Módulos do LookSpace

## Visão Geral

Os módulos representam domínios de negócio independentes e reutilizáveis do LookSpace. Cada módulo contém sua própria lógica, componentes, tipos e serviços.

## Lista de Módulos

### 1. **Auth**
Autenticação e autorização de usuários. Integração com Supabase Auth.

**Responsabilidades:**
- Login/Logout
- Registro de usuários
- Refresh de sessão
- Controle de permissões

**Estrutura:**
```
auth/
├── components/    # Formulários de login/registro
├── hooks/         # useAuth, useSession
├── services/      # Integração com Supabase Auth
├── types/         # User, Session, AuthState
└── index.ts
```

---

### 2. **Profile**
Gerenciamento de perfil do jogador. Dados pessoais e preferências.

**Responsabilidades:**
- Edição de perfil
- Avatar e personalizações
- Preferências de jogo
- Histórico de conquistas

---

### 3. **Game**
Mecânicas principais do jogo. Loop de gameplay.

**Responsabilidades:**
- Estado do jogo (em andamento, pausado, etc)
- Lógica de turn-based (se aplicável)
- Eventos de jogo
- Comunicação entre módulos

---

### 4. **Ship**
Sistema de navios. Controle, upgrade e gerenciamento.

**Responsabilidades:**
- Propriedades do navio (velocidade, armadura, etc)
- Upgrade de componentes
- Combustível e recursos
- Movimento e navegação

---

### 5. **Exploration**
Sistema de exploração espacial. Descoberta de planetas e anomalias.

**Responsabilidades:**
- Geração procedural de sistemas
- Dados de planetas descobertos
- Anomalias e pontos de interesse
- Análise de terreno

---

### 6. **Mission**
Sistema de missões e objetivos.

**Responsabilidades:**
- Criação e listagem de missões
- Progresso de missão
- Recompensas
- Histórico completado

---

### 7. **Starbase**
Estações espaciais e bases. Comércio, reparo e pesquisa.

**Responsabilidades:**
- Compra/venda de itens
- Reparo de navios
- Pesquisa de tecnologias
- Docking de navios

---

### 8. **Inventory**
Sistema de inventário. Gerenciamento de itens.

**Responsabilidades:**
- Adição/remoção de itens
- Limite de espaço
- Categorização de itens
- Equipamento

---

### 9. **Audio**
Sistema de áudio. Música, sons e feedback.

**Responsabilidades:**
- Reprodução de música
- Efeitos sonoros
- Controle de volume
- Configurações de áudio

---

### 10. **Photo Mode**
Modo fotografia para capturar momentos.

**Responsabilidades:**
- Câmera livre
- Filtros e efeitos
- Captura de screenshots
- Compartilhamento (futuro)

---

## Fluxo de Dados Entre Módulos

```
App (Game State)
    ├── Auth (Usuário autenticado?)
    ├── Game (Estado do jogo)
    │   ├── Ship (Navio ativo)
    │   ├── Exploration (Localização)
    │   ├── Mission (Missão ativa)
    │   └── Audio (Feedback sonoro)
    ├── Inventory (Itens do jogador)
    ├── Profile (Dados do jogador)
    └── Starbase (Estação próxima)
```

## Princípios de Design

1. **Independência**: Módulos minimamente acoplados
2. **Responsabilidade Única**: Um domínio por módulo
3. **Reusabilidade**: Exportação clara de hooks e componentes
4. **Testabilidade**: Lógica separada de UI
5. **Escalabilidade**: Fácil adicionar novos módulos

## Adicionando um Novo Módulo

1. Crie a pasta em `src/modules/[nome-módulo]`
2. Crie subpastas: `components/`, `hooks/`, `services/`, `types/`
3. Adicione `index.ts` com barrel exports
4. Documente responsabilidades
5. Siga convenções em [CONVENTIONS.md](CONVENTIONS.md)
