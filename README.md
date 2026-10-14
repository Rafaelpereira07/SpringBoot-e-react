# DevPath

Projeto com frontend em React/Vite e backend em Spring Boot.

## Rodando com Docker

### Requisitos

- Docker Desktop ou Docker Engine em execução
- Git

### Subir o ambiente de desenvolvimento

```bash
docker compose up --build
```

Isso inicia:

- API no endereço: http://localhost:8080
- Frontend no endereço: http://localhost:5173
- MySQL na porta: 3307

### Reiniciar e acompanhar logs

```bash
docker compose logs -f
```

### Parar os containers

```bash
docker compose down
```

### Persistência do banco

O volume nomeado `mysql-data` preserva os dados do MySQL mesmo após `docker compose down` e `docker compose up`.

### Hot reload

O arquivo `compose.yaml` monta os diretórios do backend e do frontend dentro dos containers para que mudanças no código reflitam automaticamente.

Se o ambiente estiver em Windows/macOS e a detecção de alterações não funcionar como esperado, use:

```bash
docker compose watch
```

### Observações importantes

- O backend usa MySQL e a URL de conexão fica em `backend/.env`.
- O frontend usa a variável `VITE_API_URL=http://localhost:8080`.
- A origem do frontend no CORS do backend deve incluir `http://localhost:5173`.
