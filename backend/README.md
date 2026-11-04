# SpringBoot

## Projeto

-- API de Curso Online

## Funcionalidades

***Alunos***
    
- Cadastro e gerenciamento de contas
- Login/autenticação
    
***Assinatura***

- Plano
- Controle de validade da assinatura
- Verificação de acesso aos cursos

***Cursos***

- Criar e gerenciar cursos
- Título, descrição, linguagem e nível
- Listagem e busca de cursos

***Aulas***

- Criar aulas dentro dos cursos
- Ordenação das aulas
- Conteúdo das aulas
- Controle de acesso

***Progresso***

- Registrar aulas concluídas
- Acompanhar percentual do curso
- Identificar conclusão do curso

***Certificados***

- Gerar certificado após conclusão
- Associar certificado ao aluno e ao curso
- Código único para validação

## Docker

### Desenvolvimento

```bash
cd backend
cp .env.example .env
docker compose up --build
```

A aplicação ficará disponível em `http://localhost:8080` e o contêiner de desenvolvimento reinicia automaticamente após alterações no código.

### Produção

```bash
docker build --target prod -t demo-backend:prod .
docker run --rm -p 8080:8080 --env-file .env demo-backend:prod
```

### Logs e parada

```bash
docker compose logs -f backend
docker compose down
```


