# Manual do Front-end - Escola Desafio

## Introdução

Este documento detalha a estrutura, configuração e uso do frontend desenvolvido para interagir com a API da Escola Desafio.

---

## 1. Configuração Inicial

### Base URL.

- **Backend em execução:**
  ```
  http://localhost:3001/
  ```

### Requisitos.

- Conexão HTTPS.

## Instalação

### Clone o repositório:

```bash
git clone https://github.com/vmarin/frontend-escoladesafio-tc3.git
```

### Instale as dependências:

```bash
npm install

```

## Inicialize o backend

```bash
cd backend/
npm run start:dev
```

## Inicialize o frontend

```bash
cd frontend/
npm run dev
```

A aplicação estará disponível em:

```bash
http://localhost:3000
```

---

## 2. Arquitetura da Aplicação

### Estrutura de Pastas (Next.js App Router)

```plaintext
src/
├── app/                   # Páginas da aplicação (Roteamento do Next.js)
│   ├── login/             # Rotas de autenticação
│   ├── new-post/          # Página de criação de posts
│   ├── posts/
│   │   ├──[postId]        # Rota dinâmica de acesso aos posts pelo id
│   │      └── edit/       # Rota dinâmica de edição de post
│   ├── layout.tsx         # Layout principal
│   └── page.tsx           # Página principal
├── components/            # Componentes reutilizáveis
└── contexts/              # Contextos do React

```

---

## Tecnologias Utilizadas

### Frontend

- **Framework**: Next.js 15 (App Router)
- **Estilização**: Tailwind CSS
- **Ícones**: Lucide React
- **Formulários**: React Hook Form
- **Notificações**: React Toastify

### Ferramentas

- TypeScript para tipagem
- ESLint para padronização

### Padrões

- Componentização (Header, Modal)
- Responsividade Mobile First
- Paginação client-side

### Mapeamento de Rotas

| Rota                   | Arquivo Correspondente             | Tipo     | Autenticação | Descrição                            |
| ---------------------- | ---------------------------------- | -------- | ------------ | ------------------------------------ |
| `/`                    | `app/page.tsx`                     | Estática | Pública      | Página inicial (home)                |
| `/login`               | `app/login/page.tsx`               | Estática | Pública      | Autenticação de usuários             |
| `/new-post`            | `app/new-post/page.tsx`            | Estática | Privada      | Formulário de criação de posts       |
| `/posts/[postId]`      | `app/posts/[postId]/page.tsx`      | Dinâmica | Pública      | Detalhes de um post específico       |
| `/posts/[postId]/edit` | `app/posts/[postId]/edit/page.tsx` | Dinâmica | Privada      | Edição de post (requer autenticação) |
