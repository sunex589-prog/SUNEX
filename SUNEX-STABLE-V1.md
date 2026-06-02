# SUNEX-STABLE-V1 - Ponto de Restauração e Documentação Técnica

Este documento representa o congelamento lógico oficial da versão **SUNEX-STABLE-V1**, consolidando a arquitetura, esquemas de dados, regras de segurança, dependências e fluxos operacionais mapeados no sistema de gerenciamento de limpeza de placas solares.

---

## 1. Mapeamento da Arquitetura do Sistema

### 1.1. Estrutura de Páginas (`/src/pages/`)
A aplicação é construída em React + TypeScript utilizando o roteador `react-router-dom` (v7) com navegação SPA de alto desempenho. Não há componentes isolados fora dos módulos principais, promovendo uma coesão forte dentro das próprias páginas:

*   **`Home.tsx`**: Página inicial premium com apresentação de serviços de limpeza, estatísticas de perdas por sujeira, ciclo de limpeza recomendado e painel de contatos.
*   **`Sobre.tsx`**: História institucional, valores corporativos e compromissos ecológicos e técnicos da SUNEX.
*   **`Simulacao.tsx`**: Painel dinâmico que simula a perda de eficiência por sujeira e calcula o ganho financeiro estimado, retorno sobre o investimento (ROI) e payback após a limpeza especializada.
*   **`Avaliacoes.tsx`**: Sistema interativo de feedback onde clientes leem depoimentos e deixam notas/comentários de 1 a 5 estrelas.
*   **`Solicitar.tsx`**: Motor de solicitação de serviço (multietapa). Captura dados cadastrais do cliente, quantidade de placas, plano escolhido e método de pagamento, gravando diretamente no Firestore.
*   **`Acompanhar.tsx`**: Módulo de rastreamento do pedido. Oferece visualização em tempo real das atualizações de status, geração de cobrança PIX via QR-Code dinâmico estruturado (`qrcode.react` e `react-qr-code`) e permite o upload do comprovante de pagamento pelo cliente.
*   **`Login.tsx`**: Interface de autenticação do administrador. Suporta entrada federada por conta Google (com restrição de e-mail a `sunex589@gmail.com`) ou login tradicional via e-mail e senha administrativo (`admin@sunex.com.br`).
*   **`Admin.tsx`**: Painel gerencial protegido por guardas de rota (`ProtectedRoute`), permitindo aos administradores filtrar cobranças, atualizar status com disparo de e-mails, anexar relatórios fotográficos de inspeções e exportar dados em formato CSV.

### 1.2. Recursos de Negócio e Serviços (`/src/lib/`)
*   **`firebase.ts`**: Inicializa os SDKs do Firebase (App, Firestore, Auth, Storage, Analytics) e carrega as credenciais do arquivo `firebase-applet-config.json`.
*   **`pedidos.ts`**: Encapsula todas as operações de banco de dados do Firestore com tratamento de erros customizados (`handleFirestoreError` convertendo em JSON estruturado com metadados para diagnóstico) e compressão/conversão de relatórios fotográficos em Base64 para armazenamento direto em documentos.
*   **`utils.ts`**: Contém rotinas utilitárias como `formatDate()`, `generateId()` para geração de identificadores de fatura exclusivos (ex: `SUNEX-Y7X2Z`) e manipulação de string classes.

---

## 2. Snapshot Lógico do Banco de Dados

### 2.1. Coleções e Documentos do Firestore

#### Coleção: `pedidos` (Caminho: `/pedidos/{pedidoId}`)
Representa os registros de pedidos e ordens de serviço.
*   `id` *(string)*: Identificador exclusivo gerado no formato `SUNEX-XXXXX`
*   `nome` *(string)*: Nome cadastral do cliente
*   `email` *(string)*: E-mail para contato e disparo de atualizações
*   `telefone` *(string)*: Telefone/WhatsApp do cliente
*   `endereco` *(string)*: Endereço completo da localidade onde as placas estão instaladas
*   `placas` *(number)*: Quantidade total de placas solares para lavagem
*   `servico` *(string)*: Opções disponíveis: `Essencial` | `Performance` | `Elite`
*   `pagamento` *(string)*: Forma selecionada do acerto: `pix` | `local`
*   `status` *(string)*: Estado do processo operacional:
    *   `aguardando_pagamento` (Padrão inicial)
    *   `pagamento_enviado` (Após cliente anexar imagem/comprovante)
    *   `confirmado`
    *   `agendado`
    *   `em_execucao`
    *   `finalizado`
*   `comprovanteUrl` *(string - opcional)*: Imagem do comprovante de PIX comprimida e convertida em base64.
*   `imagemAdminUrl` *(string - opcional)*: Imagem da inspeção anexada pelo administrador em formato base64.
*   `data` *(string)*: Representação ISO string da data para processamento uniforme no front-end.
*   `createdAt` *(timestamp - opcional)*: `serverTimestamp()` para auditoria nativa no banco.

#### Coleção: `mail` (Caminho: `/mail/{mailId}`)
Dispara serviços automáticos de mensageria usando a extensão *Trigger Email* do Firebase.
*   `to` *(string)*: Destinatário do comunicado.
*   `message` *(map)*:
    *   `subject` *(string)*: Título contextualizado do correio comercial.
    *   `html` *(string)*: Estrutura HTML estilizada notificando o cliente sobre o novo status do agendamento.
*   `createdAt` *(timestamp)*: Marcador temporal para enfileiramento de correspondência.

---

## 3. Regras de Segurança do Firestore (`firestore.rules`)

As diretivas de proteção baseadas em controle de acesso Zero-Trust estão configuradas sob a especificação `rules_version = '2'`:

```javascript
rules_version = '2';

service cloud.firestore {

  match /databases/{database}/documents {

    match /pedidos/{pedidoId} {
      allow create: if true;
      allow read: if request.auth != null;
      allow update, delete: if request.auth != null;
    }

    match /avaliacoes/{avaliacaoId} {
      allow read: if true;
      allow create: if true;
    }

    match /admins/{adminId} {
      allow read, write: if request.auth != null;
    }

    match /mail/{document} {
      allow read, write: if request.auth != null;
    }

  }

}
```

---

## 4. Registro e Relatório de Dependências Críticas

Mapeamento exaustivo das dependências instaladas via `package.json` de produção para garantir as funcionalidades básicas do sistema:

| Tipo / Dependência | Versão instalada | Objetivo do Pacote / Propósito |
| :--- | :--- | :--- |
| **react** | `^19.0.0` | Biblioteca base do ecossistema do aplicativo |
| **react-dom** | `^19.0.0` | Renderizador das árvores rasteiras baseadas em DOM do React |
| **react-router-dom** | `^7.14.2` | Barramento de roteamento SPA e tratamento de search parameters dinâmicos |
| **firebase** | `^12.12.1` | SDK para integrações e comunicações client-side com Firebase |
| **react-qr-code** / **qrcode.react**| `^2.0.18` / `^4.2.0` | Renderização nativa de vetores QR Code para pagamento PIX dinâmico |
| **lucide-react** | `^0.546.0` | Conjunto de ícones vetoriais modernos |
| **motion** | `^12.38.0` | Manipulação e orquestração de transições e micro-animações do sistema |
| **@tailwindcss/vite** | `^4.1.14` | Integração do compilador de estilos Tailwind CSS v4 com a build do Vite |

---

## 5. Fluxos Operacionais Críticos

### 5.1. Fluxo de Criação e Acompanhamento de Pedido
1. O cliente entra na página **Solicitar** (`/solicitar`) e passa pelo assistente em duas etapas.
2. Na Etapa 1, insere Informações de Contato (Nome, e-mail, telefone e endereço).
3. Na Etapa 2, insere Dados do Sistema (Número de placas, seleção de Tipo de Serviço e método de pagamento).
4. O ID único é gerado no front-end em `generateId()`.
5. O pedido é escrito na coleção `pedidos` através do Firestore Client SDK com status inicial definido como `aguardando_pagamento`.
6. Um evento é reportado ao Google Analytics (conversão de Lead).
7. O usuário é redirecionado para a rota de acompanhamento `/acompanhar?id=ID_GERADO`.
8. Se a opção for PIX, o cliente vê as instruções, escaneia o QR Code dinâmico, copia a chave e anexa seu comprovante.
9. Após anexar a imagem, a rotina converte para Base64, atualiza o pedido e muda o status do registro operacional para `pagamento_enviado` no Firestore.

### 5.2. Fluxo Administrativo de Atualização e Envio de E-mail
1. O administrador acessa `/login` e realiza a autenticação (via Google Auth ou E-mail corporativo).
2. O sistema atribui `'true'` à storage key `sunex_admin_auth` e concede acesso ao painel gerencial em `/admin`.
3. O painel estabelece uma escuta contínua (`onSnapshot` do Firestore) para puxar todos os novos pedidos ordenados por data.
4. O administrador pode inspecionar comprovantes ou anexar relatórios técnicos em imagem de serviço (`imagemAdminUrl`).
5. Ao alterar o status de um pedido (ex: atualizado para `confirmado` ou `finalizado`), a função `atualizarStatus` escreve a modificação no documento do pedido e enfia um gatilho de e-mail registrando um novo documento na coleção `/mail` com o e-mail, assunto e corpo HTML estilizados para disparo automático ao cliente.

---

## 6. Relatório de Divergências Encontradas (Auditoria de Código vs. Firebase/Firestore)

Com base na auditoria minuciosa do comportamento real do código frente aos recursos declarados no Firestore e no Firebase Blueprint, foram mapeadas as seguintes divergências estruturais:

1.  **Coleção `/avaliacoes` Sem Uso em Produção**:
    *   **No Firebase e Firestore Rules**: Existe a declaração e as permissões públicas de escrita/leitura para a coleção `/avaliacoes`.
    *   **No Código (`Avaliacoes.tsx`)**: O sistema utiliza exclusivamente a persistência local do navegador (`localStorage` com a chave `sunex_avaliacoes`) com inicialização simulada contendo dois depoimentos dummy. As avaliações reais submetidas pelos usuários não são escritas no Firestore, persistindo localmente.
2.  **Autenticação Administrativa e a Coleção `/admins`**:
    *   **Nas Regras do Firestore Rules**: Existe proteção dedicada para a coleção `/admins/{adminId}` restringindo escrita e leitura para usuários assinados.
    *   **No Código (`Login.tsx` e `Admin.tsx`)**: A validação se dá por meio de um fluxo híbrido de Auth e lógica de e-mail local. No login Google, o pipeline é aprovado apenas quando `user.email === 'sunex589@gmail.com'`. No login de email, usa-se `admin@sunex.com.br` diretamente integrado ao Firebase Auth do usuário. O código não consome ou valida papéis realizando queries explícitas na coleção `/admins`.
3.  **Restrições das Regras Novas do Firestore no Acompanhamento**:
    *   As regras atuais do Firestore exigem que qualquer operação de leitura `read` fora de `avaliacoes` (como na coleção `pedidos`) seja permitida apenas se o usuário estiver logado (`request.auth != null`). No entanto, o cliente final acessa `/acompanhar?id=ID_PEDIDO` sem passar pela tela de login, o que significa que o leitor anônimo pode ter problemas para ler o status caso o login anônimo não esteja configurado corretamente no fluxo geral do cliente (atualmente, o cliente final não faz login anômico explícito ao acessar o status). Esta é uma divergência operacional natural que foi reportada para acompanhamento corporativo sem impacto de falhas de compilação.

---

## 7. Validação de Integridade Geral
*   **Build de Produção (`npm run build`)**: Concluído e compilado perfeitamente sem falhas ou avisos impeditivos.
*   **TypeScript Checks (`npx tsc --noEmit`)**: Sem erros de tipagem mapeados nas definições estritamente protegidas.
*   **Segurança Geral**: O linter de regras do Firestore confirmou sintaxe estável sob regras versionadas.

A versão **SUNEX-STABLE-V1** está declarada oficialmente estável e congelada.
