# SUNEX-STABLE-V1-FREEZE - Registro Oficial de Congelamento de Produção

Este documento consolida o **congelamento lógico (Freeze) permanente** da versão atual de produção da plataforma **SUNEX**, estabelecendo uma baseline inviolável de arquitetura, integridade de componentes, segurança, integrações de e-mail e modelagem de persistência.

---

## 1. Informações de Controle do Freeze

*   **Data do Freeze:** 02 de Junho de 2026
*   **Estado de Compilação:** 🟢 Homologado (Build bem-sucedido via `vite build`)
*   **Estado de Tipagem (TypeScript):** 🟢 Homologado (Lint concluído com sucesso via `tsc --noEmit`)
*   **Status de Funcionalidades:** Operacional e estável em todos os módulos produtivos.

---

## 2. Resumo Técnico da Baseline

A plataforma SUNEX-STABLE-V1 é uma SPA (Single Page Application) focada no agenciamento e otimização de pedidos de limpeza para sistemas de geração solar fotovoltaica. A aplicação utiliza uma arquitetura puramente serverless integrada ao ecossistema do **Firebase** e ao **EmailJS**, estruturada sob React 19.x e Vite 6.x, estilizada com a especificação moderna de alto desempenho do **Tailwind CSS v4**.

---

## 3. Inventário Detalhado de Dependências

O painel de dependências declaradas no arquivo de produção `package.json` garante o ciclo de vida do aplicativo com compatibilidade estrita:

### 3.1. Dependências de Execução (`dependencies`)
*   `react`: `^19.0.0` - Biblioteca principal de interfaces.
*   `react-dom`: `^19.0.0` - Renderizador de árvore virtual DOM.
*   `react-router-dom`: `^7.14.2` - Barramento de navegação em SPA e parâmetros dinâmicos.
*   `firebase`: `^12.12.1` - Conector client-side oficial do Firebase (Auth, Firestore, Analytics).
*   `lucide-react`: `^0.546.0` - Conjunto integrado de ícones vetoriais responsivos.
*   `motion`: `^12.38.0` - Motor de animações e micro-transições do fluxo.
*   `qrcode.react` (`^4.2.0`) & `react-qr-code` (`^2.0.18`): Ferramentas de renderização de vetores de cobrança PIX estática e dinâmica.
*   `clsx` (`^2.1.1`) & `tailwind-merge` (`^3.5.0`): Utilitários para concatenação condicional de classes utilitárias de estilo.
*   `date-fns`: `^4.1.0` - Manipulador e formatador resiliente de registros temporais.
*   `express` (`^4.21.2`) & `dotenv` (`^17.2.3`): Servidores auxiliares opcionais e carregamento de ambientes locais.
*   `@tailwindcss/vite`: `^4.1.14` - Módulo de compilação integrada do estilo CSS.
*   `@google/genai` (`^1.29.0`) & `@vercel/analytics` (`^2.0.1`) / `@vercel/speed-insights` (`^2.0.0`): Telemetria e recursos de expansão analítica.

---

## 4. Estrutura de Páginas, Rotas e Componentes

A navegação SPA está centralizada e as interfaces são divididas nos arquivos de escopo único na pasta `/src/pages/`, eliminando redundâncias visuais:

1.  **Página Inicial (`Home.tsx`)**: Apresentação institucional, perdas financeiras geradas por sujidade de placas, fluxos explicativos e cartões de planos acessivos.
2.  **Página Sobre (`Sobre.tsx`)**: Declarações corporativas, valores da marca, metas ecológicas e diferenciais operacionais.
3.  **Página Simulador (`Simulacao.tsx`)**: Calculadora de retornos financeiros, payback, ROI, e aumento projetado na geração solar pós-limpeza.
4.  **Página Avaliações (`Avaliacoes.tsx`)**: Painel interativo de feedbacks onde clientes opinam e deixam notas que persistem localmente via navegador.
5.  **Página Fazer Solicitação (`Solicitar.tsx`)**: Assistente em duas etapas para coleta de dados contratuais, cálculo de placas e escolha do método de pagamento.
6.  **Página Acompanhar Fatura (`Acompanhar.tsx`)**: Painel do cliente para visualização em tempo real de mudanças de status do pedido, detalhes técnicos do plano, QR Code de faturamento PIX e upload integrado de comprovantes de acertos.
7.  **Página de Autenticação (`Login.tsx`)**: Login administrativo seguro com suporte a credenciais manuais organizadas no Firebase Authentication ou Single Sign-On (SSO) do Google para administradores qualificados.
8.  **Painel de Administração (`Admin.tsx`)**: Central de operações de nível gerencial protegida contra acessos anônimos para acompanhamento, emissão de relatórios fotográficos de manutenção, exportação CSV e transições de status com envio automático de e-mails de acompanhamento aos clientes.

---

## 5. Estrutura de Informação Firestore (Esquemas Lógicos)

O banco de dados nos ambientes do Cloud Firestore está estruturado sob as seguintes premissas lógicas de dados:

### 5.1. Coleção `pedidos` (Caminho `/pedidos/{pedidoId}`)
Contém os pedidos gerados pelos clientes. Cada documento possui a seguinte modelagem de campos:
*   `id` *(string)*: Código identificador estruturado (Ex: `SUNEX-XXXXX`) gerado deterministicamente no cliente para facilitar a busca rápida.
*   `nome` *(string)*: Nome completo do cliente solicitante.
*   `email` *(string)*: Endereço eletrônico de contato do cliente.
*   `telefone` *(string)*: Celular/WhatsApp do cliente.
*   `endereco` *(string)*: Endereço estruturado no formato `"Rua, Número, Bairro, Cidade - Estado"`.
*   `placas` *(number)*: Quantidade total de placas solares registradas para manutenção.
*   `servico` / `plano` *(string)*: Plano operacional escolhido pelo usuário (`Essencial`, `Performance` ou `Elite`).
*   `pagamento` *(string)*: Modalidade de intermediação financeira selecionada (`pix` ou `local`).
*   `status` *(string)*: Estado do ciclo de vida operacional:
    *   `aguardando_pagamento` - Estado padrão após o envio inicial do formulário.
    *   `pagamento_enviado` - Estado quando o cliente anexa o comprovante de pagamento.
    *   `confirmado` - Atualizado pelo administrador após verificação do recebimento de valores.
    *   `agendado` - Definido quando a data operacional técnica de visita está confirmada.
    *   `em_execucao` - Equipes técnicas em atividade no local.
    *   `finalizado` - Serviço executado e entregue com sucesso técnico.
*   `comprovanteUrl` *(string - opcional)*: Imagem do comprovante de acerto financeiro, convertida para string comprimida Base64 no cliente para upload resiliente e rápido sem infraestrutura complementar.
*   `imagemAdminUrl` *(string - opcional)*: Imagem da ordem de serviço com relatório fotográfico do antes/depois ou inspeção técnica, convertida para Base64 no painel administrativo.
*   `data` *(string)*: Data e fuso horário ISO da solicitação.
*   `createdAt` *(timestamp - opcional)*: Marcador nativo do Firestore.

### 5.2. Coleção `mail` (Caminho `/mail/{mailId}`)
Disparador de mensagens em segundo plano integrado à extensão *Trigger Email* instalada no Firebase:
*   `to` *(string)*: E-mail de destino do cliente correspondente.
*   `message` *(map)*:
    *   `subject` *(string)*: Assunto corporativo personalizado do correio virtual.
    *   `html` *(string)*: Modelo HTML totalmente estilizado contendo detalhes gráficos sobre a modificação do agendamento de lavagem.

---

## 6. Configurações de Integração de Notificações Excluidas / Isoladas

### 6.1. EmailJS (Mapeamento Permanente)
Instalado de forma 100% isolada e protegida, o motor de notificação do EmailJS sinaliza novos leads diretamente para a área gerencial administrativa sem comprometer o salvamento do pedido:

*   **Service ID:** `service_sunex2136`
*   **Template ID:** `template_sunex2026`
*   **Destinatário Administrador Padrão:** `sunex589@gmail.com`
*   **Nome do Arquivo de Escopo:** `/src/lib/emailService.ts`
*   **Método de Ativação:** Chamado assincronamente no arquivo `/src/pages/Solicitar.tsx` imediatamente após a confirmação de escrita bem-sucedida do documento do pedido no Firestore.
*   **Política de Resiliência:** Caso ocorra indisponibilidade técnica, cota excedida, ou ausência de chaves de ambiente, a falha é meramente logada no console do sistema. O pedido do cliente é mantido gravado e o fluxo de checkout ocorre normalmente.

---

## 7. Variáveis de Ambiente e Segredos (`.env.example`)

Os segredos da SUNEX operados com segurança pelo ecossistema do AI Studio ou provedores de nuvem para compilação incluem:

*   `VITE_ADMIN_PASSWORD`: Senha estática de back-up para acesso administrativo ao console em `/login`. Default: `"sunex2026"`.
*   `VITE_EMAILJS_PUBLIC_KEY`: Chave de autenticação pública corporativa usada no fetch REST da API do EmailJS para despacho seguro das mensagens pré-carregadas.

---

## 8. Fluxos Operacionais Críticos de Produção

### 8.1. Criação, Execução de Pedido e Disparo de Alerta Administrativo
1.  O usuário entra em `/solicitar`, preenche os formulários multietapa e realiza o envio do pedido.
2.  O sistema gera o ID sequencial estruturado, define o status operacional inicial como `aguardando_pagamento` e dispara a gravação assíncrona no Firestore.
3.  A transação é confirmada e, em segundo plano, a função `notificarNovoPedido()` processa os dados do pedido (extrapolando o município a partir do endereço completo, e formatando valores de placas e plano selecionado) e realiza a requisição POST para os endpoints REST seguros do EmailJS.
4.  O fluxo redireciona o usuário de imediato para `/acompanhar?id=ID_GERADO`, iniciando a experiência sem filas de atraso.

### 8.2. Autenticação de Administradores
*   **Login Google**: Fluxo SSO federado. O sistema recupera os detalhes do perfil e concede acesso ao painel gerencial em `/admin` e preenche a chave de consentimento local `sunex_admin_auth` quando o e-mail retornado é estritamente `sunex589@gmail.com`.
*   **Login por E-mail**: Permite a autenticação pela credencial dedicada institucional `admin@sunex.com.br` por meio do Firebase Authentication.

---

## 9. Procedimento de Rollback de Produção

Caso o ambiente entre em estado instável ou degradação devido a atualizações inadvertidas, as etapas de rollback documentadas para o administrador do projeto consistem em:

1.  **Reversão de Código Local**
    *   Restaurar do histórico de commits do repositório Git o identificador desta baseline congelada e estável em 02 de Junho de 2026:
        ```bash
        git reset --hard <id_commit_freeze>
        ```
2.  **Expurgo de Módulos e Depuração**
    *   Limpar pastas de builds compiladas e arquivos redundantes que causam concorrência ou reconfiguração indesejada:
        ```bash
        npm run clean && rm -rf node_modules package-lock.json && npm install
        ```
3.  **Deploy Direto**
    *   Certificar-se de que a configuração de credenciais Firebase está preenchida exatamente de acordo com o arquivo estável presente no diretório raiz: `firebase-applet-config.json`.
    *   Disparar a geração estática segura:
        ```bash
        npm run build
        ```
    *   Efetuar a publicação nas ferramentas homologadas (Vercel, Cloud Run ou Firebase Hosting).

---

## 10. Regras de Compliance para Desenvolvimentos Futuros

Qualquer alteração, modificação de lógica ou acréscimo de novas features no sistema SUNEX deverá seguir estritamente as regras de compliance:

1.  **Preservação Total de Retrocompatibilidade**: Novas atualizações de código ou adições de bibliotecas não podem quebrar ou inutilizar as coleções e campos consolidados no Firestore ou o disparo de e-mails EmailJS/extension de status.
2.  **Implementação Isolada (Sandboxed)**: Alterações complexas de lógica devem ocorrer em arquivos temporários separados, extensões de rota ou branches de laboratório, sendo integrados apenas após aprovações completas e testes em ambiente sandboxed.
3.  **Auditorias Estritas e Testes de Build Estáticos**: O pipeline de homologação exige que, em qualquer nova versão, os comandos `npm run lint` e `npm run build` rodem e finalizem completamente zerados (sem erros de transpilação, tipagem TypeScript ou caminhos inválidos).
4.  **Plano de Rollback Integrado**: Nenhuma entrega de funcionalidade nova de escala crítica do negócio é autorizada sem o desenvolvimento e validação de um plano de contingência ou versão secundária ativa para reverter o app para a baseline documentada neste arquivo.

---
**SUNEX-STABLE-V1 congelada e carimbada com sucesso para evolução controlada.**
