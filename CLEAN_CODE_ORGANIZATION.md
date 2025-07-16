# Engenhando Mais - Clean Code Organization

Este projeto foi reorganizado seguindo os princípios de **Clean Code** para melhorar a manutenibilidade, legibilidade e escalabilidade do código.

## 🏗️ Estrutura de Pastas

```
src/
├── components/           # Componentes React organizados por categoria
│   ├── common/          # Componentes reutilizáveis (Header, Navigation, etc.)
│   ├── games/           # Componentes específicos dos jogos
│   ├── auth/            # Componentes de autenticação
│   ├── racing/          # Componentes específicos do jogo de corrida
│   └── ui/              # Componentes UI básicos (shadcn/ui)
│
├── pages/               # Páginas da aplicação
│   ├── Home.tsx
│   ├── Biblioteca.tsx
│   ├── Mascote.tsx
│   └── ...
│
├── hooks/               # Hooks customizados
│   ├── useSubjects.ts   # Hook para gerenciamento de disciplinas
│   ├── useResponsiveItems.ts
│   └── use-toast.ts
│
├── types/               # Definições de tipos TypeScript
│   └── index.ts         # Tipos globais da aplicação
│
├── constants/           # Constantes da aplicação
│   └── index.ts         # Configurações, cores, rotas, etc.
│
├── utils/               # Funções utilitárias
│   └── index.ts         # Helpers e funções reutilizáveis
│
├── data/                # Dados mock e configurações
│   └── mockData.ts      # Dados de exemplo para desenvolvimento
│
└── lib/                 # Bibliotecas e configurações
    └── utils.ts         # Utilitários do shadcn/ui
```

## ✨ Princípios Aplicados

### 1. **Single Responsibility Principle (SRP)**
- Cada componente tem uma única responsabilidade
- Hooks customizados para lógica específica
- Separação de componentes UI e lógica de negócio

### 2. **DRY (Don't Repeat Yourself)**
- Dados mock centralizados em `src/data/mockData.ts`
- Utilitários comuns em `src/utils/index.ts`
- Constantes globais em `src/constants/index.ts`

### 3. **Naming Conventions**
- Nomes descritivos e auto-explicativos
- Prefixos consistentes (MOCK_, COLORS, etc.)
- Interfaces e tipos bem definidos

### 4. **Type Safety**
- TypeScript rigoroso com tipos bem definidos
- Eliminação de tipos `any` onde possível
- Interfaces claras para todos os dados

### 5. **Code Organization**
- Componentes organizados por funcionalidade
- Imports organizados (bibliotecas → components → tipos → utils)
- Estrutura de pastas lógica e escalável

## 🔧 Hooks Customizados

### `useSubjects`
Gerencia o estado das disciplinas incluindo:
- Filtragem por categoria
- Busca por texto
- Toggle de favoritos
- Atualização de progresso

```typescript
const {
  filteredSubjects,
  searchTerm,
  setSearchTerm,
  selectedFilter,
  setSelectedFilter,
  toggleFavorite,
} = useSubjects(MOCK_SUBJECTS);
```

## 📊 Tipos Principais

### `Subject`
```typescript
interface Subject {
  id: number | string;
  name: string;
  icon: string;
  progress: number;
  videoCount: number;
  color: string;
  isMine: boolean;
  isFavorite: boolean;
  lastAccessed: Date | null;
}
```

### `RecentVideo` & `PopularVideo`
```typescript
interface RecentVideo {
  id: number | string;
  title: string;
  subject: string;
  progress: number;
  duration: string;
  thumbnail: string;
}
```

## 🎨 Constantes

### Cores
```typescript
export const COLORS = {
  PRIMARY: '#0029ff',
  SECONDARY: '#28b0ff',
  ACCENT: '#ff7a28',
  // ...
} as const;
```

### Configuração de Jogos
```typescript
export const GAME_CONFIG = {
  QUIZ: {
    TIME_PER_QUESTION: 30,
    POINTS_PER_CORRECT: {
      easy: 15,
      medium: 25,
      hard: 40,
    },
  },
  // ...
} as const;
```

## 🛠️ Utilitários

### `filterSubjects`
Filtra disciplinas por categoria e termo de busca.

### `formatDuration`
Converte minutos em formato legível (ex: "1h 30min").

### `debounce`
Implementa debounce para otimizar performance em buscas.

### `safeJSONParse` / `safeJSONStore`
Manipulação segura do localStorage.

## 📈 Melhorias Implementadas

### Antes da Organização:
- ❌ Tipos `any` espalhados pelo código
- ❌ Dados mock repetidos em vários arquivos
- ❌ Componentes misturados sem organização
- ❌ Lógica duplicada entre componentes
- ❌ Imports desorganizados

### Depois da Organização:
- ✅ Types rigorosos e bem definidos
- ✅ Dados centralizados e reutilizáveis
- ✅ Componentes organizados por funcionalidade
- ✅ Hooks customizados para lógica compartilhada
- ✅ Estrutura escalável e manutenível

## 🚀 Próximos Passos

1. **API Integration**: Substituir dados mock por chamadas reais à API
2. **Testing**: Adicionar testes unitários e de integração
3. **Performance**: Implementar lazy loading e code splitting
4. **Accessibility**: Melhorar acessibilidade dos componentes
5. **Documentation**: Expandir documentação dos componentes

## 📝 Como Contribuir

1. Siga a estrutura de pastas estabelecida
2. Use TypeScript rigoroso (evite `any`)
3. Documente funções e componentes complexos
4. Mantenha componentes pequenos e focados
5. Use hooks customizados para lógica reutilizável

---

Esta organização segue as melhores práticas de Clean Code e torna o projeto mais profissional, manutenível e escalável.
