# devpath — frontend

Front-end em React + TypeScript + Tailwind CSS + Vite para a
[Course Platform API](../demo). Identidade visual própria ("devpath"),
inspirada apenas no *espírito geral* de uma plataforma de cursos de
programação (dark, direta, com motivo visual de editor de código) — sem
nenhuma relação de marca, cores, textos ou ativos com a Origamid ou
qualquer outra plataforma existente.

## 1. Stack

| Tecnologia      | Uso                                                |
| ---------------- | ---------------------------------------------------- |
| Vite 8           | build/dev server                                    |
| React 19 + TypeScript 7 | UI, tipado de ponta a ponta                  |
| Tailwind CSS v4  | estilos, via `@tailwindcss/vite` (config em CSS, `src/index.css`) |
| axios            | cliente HTTP, com interceptors                       |
| react-router-dom | rotas, incluindo rotas protegidas                    |
| lucide-react     | ícones                                                |
| Web Crypto API   | criptografia do token em `sessionStorage` (nativo do navegador, sem dependência extra) |

Instalado e **compilado de verdade** neste ambiente (`npm install` +
`npm run build`) para garantir que não há erro de tipo/import — não é
apenas código gerado sem validação.

## 2. Rodando localmente

```bash
cp .env.example .env
# edite VITE_API_URL se a API nao estiver em http://localhost:8080

npm install
npm run dev       # http://localhost:5173
```

Outros scripts:

```bash
npm run build      # type-check (tsc -b) + build de producao em dist/
npm run preview    # serve o build de producao localmente
npm run typecheck  # so o type-check, sem buildar
```

## 3. Estrutura

```text
src/
├── lib/            # env, axios, criptografia, jwt (decode), helpers
├── types/          # tipos espelhando os DTOs da API
├── services/        # uma função por endpoint, por feature (auth, courses, ...)
├── context/          # AuthContext (sessao do aluno)
├── hooks/             # useAuth
├── components/
│   ├── ui/              # Button, Input, Badge, Alert, Spinner
│   ├── layout/            # Header, Footer, Layout, Logo
│   ├── course/             # CourseCard, LessonListItem, levelMeta
│   ├── EditorMockup.tsx     # motivo visual principal (ver secao 5)
│   └── ProtectedRoute.tsx
└── pages/             # uma pagina por rota
```

## 4. Segurança e criptografia no cliente

Esta é a parte que mais merece uma explicação honesta sobre o que
realmente protege:

- **Onde o token fica**: em `sessionStorage` (nunca `localStorage`), como
  **ciphertext AES-GCM 256 bits** gerado pela Web Crypto API
  (`src/lib/crypto.ts` + `src/lib/secureStorage.ts`). A chave de
  criptografia é gerada no navegador e também guardada em
  `sessionStorage`, separada do ciphertext.
- **O que isso protege de fato**: qualquer coisa que leia o
  `sessionStorage` **sem executar JavaScript nesta origem** — uma
  extensão de navegador despejando storage, um log ou crash report que
  capture o conteúdo, uma ferramenta de suporte tirando print — enxerga
  ciphertext, não um token Bearer utilizável.
- **O que isso NÃO protege**: um XSS real nesta aplicação. Qualquer script
  malicioso rodando na página pode chamar a mesma função de decrypt que o
  app chama. Isso não tem solução puramente no cliente — a solução real
  para roubo de token via XSS é um **cookie `httpOnly` + `SameSite`
  emitido pelo backend**, o que esta API REST (por ser uma API Bearer
  "portátil", pensada para ser usada por qualquer cliente, não só este
  frontend) não usa. Trate a criptografia aqui como uma camada a mais
  (defense-in-depth), não como um substituto de:
  - manter dependências atualizadas,
  - nunca usar `dangerouslySetInnerHTML` com conteúdo não confiável (o
    projeto todo evita isso — o React escapa texto por padrão),
  - validar/sanitizar qualquer conteúdo vindo da API antes de renderizar
    como HTML (não fazemos isso em nenhum lugar aqui).
- **Expiração do token**: `src/lib/jwt.ts` decodifica o campo `exp` do JWT
  **só para UX** (mostrar a sessão como expirada mais cedo, sem esperar a
  API responder 401). Isso **não é verificação de assinatura** — um
  cliente nunca pode verificar um JWT assinado com HMAC sem o segredo do
  servidor, e o app não finge que verifica. A API continua sendo a única
  fonte de verdade sobre um token ser válido.
- **401 global**: um interceptor do axios (`src/lib/api.ts`) escuta
  qualquer resposta 401 e limpa a sessão automaticamente, redirecionando
  para `/entrar`.
- **CSP**: `index.html` define uma Content-Security-Policy restritiva via
  meta tag (baseline). Em produção, prefira configurar o mesmo CSP como
  header HTTP real no seu host/CDN (meta tag não cobre `frame-ancestors`
  nem relatórios de violação).
- **CSRF**: não implementado deliberadamente — o token vai num header
  `Authorization: Bearer`, nunca em cookie, e o navegador não anexa esse
  header automaticamente a requisições de terceiros, então o cenário
  clássico de CSRF (o navegador *enviando sozinho* uma credencial) não se
  aplica aqui.
- **HTTPS**: a aplicação assume que, em produção, tanto o frontend quanto
  `VITE_API_URL` estão atrás de HTTPS. Isso protege os dados em trânsito;
  não é coberto por nada no código, é responsabilidade do deploy.

## 5. Design

Identidade "devpath", original para este projeto:

- **Cor**: fundo `#0F1419` (tinta, não preto puro), cartões `#171D26`,
  texto `#E8EAED`, texto apagado `#8B96A5`, acento primário âmbar
  `#F2B84B`, acento secundário teal `#4FD1C5` (status "ativo"/"concluído")
  e coral `#E8674F` (erros, nível avançado).
- **Tipografia**: Space Grotesk para títulos, Inter para corpo de texto,
  JetBrains Mono para rótulos técnicos (nível do curso, duração, código de
  certificado, código de pagamento) — reforça o tema "plataforma para
  quem programa" sem exagerar no monoespaçado em texto longo.
- **Motivo visual**: uma janela de editor de código estilizada
  (`EditorMockup.tsx`), usada só no hero da home e no painel ao lado dos
  formulários de login/cadastro — não repetida em todo canto.
- **Estrutura**: nível do curso é indicado por uma borda superior colorida
  no card (não um badge genérico igual em todos); aulas são numeradas
  porque são, de fato, uma sequência; o plano vitalício tem destaque visual
  diferente dos outros dois (não há três cards idênticos com sombra igual).

## 6. O que depende de endpoints que a API ainda não tem

Para ser honesto sobre os limites do que dá pra construir só com o
backend atual:

- Não há uma tela de "meus certificados" (lista), porque a API só expõe
  `GET /certificates/{code}` e `GET /certificates/{code}/validate` — não
  existe um endpoint que liste os certificados de um aluno autenticado.
  A tela de conta aponta para a validação manual por código.
- A lista de aulas concluídas por curso não é exibida individualmente
  (só o percentual agregado), porque `GET /progress/courses/{slug}` no
  backend retorna apenas contagem/percentual, não os IDs das aulas
  concluídas.

Ambos são extensões diretas de implementar no backend se fizerem falta -
o frontend já está desenhado para receber esses dados quando existirem.
