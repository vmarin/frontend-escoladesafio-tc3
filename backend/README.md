# Manual de Uso da API Escola Desafio

## Introdução

Este manual oferece uma visão geral de como usar os endpoints disponíveis, incluindo detalhes de autenticação, exemplos de requisições e respostas, e tratamento de erros.

---

## 1. Configuração Inicial

### Base URL.

- **Ambiente de testes:**
  ```
  http://localhost:3333/
  ```
- **Documentação Rotas:**
  ```
  http://localhost:3333/api
  ```

### Requisitos.

- Conexão HTTPS.

---

## 2. Endpoints

### Posts

- **GET /posts**: Retorna a lista de posts.
- **GET /posts/:id**: Retorna um post específico.
- **GET /posts/search**: Busca post por palavra-chave.
  ```query params
  {
   "term": "string"
  }
  ```
- **POST /posts**: Cria um novo post.
  - **Parâmetros esperados:**
    ```json
    {
      "title": "string (obrigatório)",
      "description": "string (obrigatório)"
    }
    ```
- **PUT /posts/:id**: Atualiza um post.
  ```json
  {
    "title": "string (opcional)",
    "description": "string (opcional)"
  }
  ```
- **DELETE /posts/:id**: Atualiza um post.

---

## 3. Tratamento de Erros

Erros comuns incluem:

| Código | Descrição                                            |
| ------ | ---------------------------------------------------- |
| 400    | Bad Request: Dados inválidos enviados na requisição. |
| 401    | Unauthorized: Token ausente ou inválido.             |
| 404    | Not Found: Recurso não encontrado.                   |
| 500    | Internal Server Error: Erro inesperado no servidor.  |

---
