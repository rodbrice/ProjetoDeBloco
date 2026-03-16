# 📋 BACKLOG - MindCare

**Última atualização:** 13/03/2026  
**Versão atual:** 1.4.0 (TP4)

---

## ✅ CONCLUÍDO - TP1 ao TP4

### 🎯 TP1 - Planejamento e User Stories
**Status:** ✅ Concluído (100%)

- [x] Definição do escopo do projeto (MindCare)
- [x] Criação de 6 histórias de usuário
- [x] Definição de papéis (Scrum Master, PO, Dev)
- [x] Cronograma de sprints estabelecido
- [x] Escolha de tecnologias (React + Vite)
- [x] Documentação inicial (TP1_Resposta.txt)

**Entregável:** Documento de planejamento e histórias de usuário

---

### 🏗️ TP2 - Primeira Versão Single-Page
**Status:** ✅ Concluído (100%)

- [x] Setup inicial do projeto com Vite
- [x] Estrutura de componentes React
- [x] Sistema de design com CSS Variables
- [x] Layout responsivo Mobile-First
- [x] Componentes básicos:
  - [x] Header
  - [x] ProfessionalCard
  - [x] SearchPage (single-page)
  - [x] BottomNav (2 itens)
- [x] Mock de dados (mockProfessionals.js)
- [x] Filtros básicos (nome, local, preço)

**Entregável:** Aplicação single-page funcional

---

### 🔄 TP3 - Multipáginas e Dados Dinâmicos
**Status:** ✅ Concluído (100%)

- [x] Migração para multi-page com React Router
- [x] Páginas criadas:
  - [x] SearchPage (/)
  - [x] ProfessionalPage (/professionals/:id)
  - [x] AppointmentsPage (/appointments)
  - [x] NewAppointmentPage (/appointments/new)
  - [x] NotFoundPage (404)
- [x] Sistema de agendamentos com localStorage
- [x] Gerenciamento de estado (App.jsx)
- [x] Componentes reativos
- [x] Badge de status
- [x] AppShell com Outlet
- [x] Documento de BACKLOG inicial

**Feedback recebido:**
- ⚠️ Consumo de dados deveria ser via Fetch (não import)
- ⚠️ Falta menu de navegação completo
- ⚠️ Sem gestos mobile específicos
- ⚠️ Falta tratamento robusto de erros

**Entregável:** Aplicação multi-page com agendamentos

---

### ⚡ TP4 - Fetch API, Gestos Mobile e Testes
**Status:** ✅ Concluído (100%)

#### 🎨 **BRICE** - Dados Dinâmicos + Testes

- [x] Criar `/public/professionals.json` (7 profissionais)
- [x] Implementar Fetch API em SearchPage
- [x] Adicionar estados de loading/error/success
- [x] Atualizar ProfessionalPage para usar fetch
- [x] Atualizar NewAppointmentPage para usar fetch
- [x] Estilos de loading/error states
- [x] Instalar React Testing Library + Vitest
- [x] Configurar vitest.config.js
- [x] Criar setup.js para testes
- [x] Testes de ProfessionalCard
- [x] Testes de SearchPage
- [x] Testes de AppointmentsPage
- [x] Adicionar scripts de teste no package.json

**Linhas de código:** ~350 (incluindo testes)

#### 🧭 **KARINA** - Navegação + Favoritos

- [x] Criar `favoritesStorage.js` (CRUD de favoritos)
- [x] Criar FavoritesPage (/favorites)
- [x] Criar AboutPage (/about) com info da equipe
- [x] Expandir BottomNav para 4 itens com ícones
- [x] Adicionar badge dinâmico em Favoritos
- [x] Atualizar rotas em AppRoutes.jsx
- [x] Estilos para AboutPage
- [x] Estilos para FavoritesPage
- [x] Indicador visual de página ativa
- [x] Contador de favoritos em tempo real

**Linhas de código:** ~280

#### 📱 **SÂMELA** - Gestos Mobile + Documentação

- [x] Implementar touch events em ProfessionalCard
- [x] Swipe direita para favoritar
- [x] Swipe esquerda para desfavoritar
- [x] Feedback visual durante swipe
- [x] Indicadores de ação (setas + texto)
- [x] Toast notification após ação
- [x] Botão de favoritar em ProfessionalPage
- [x] Estilos de swipe e animações
- [x] Criar `/docs` folder
- [x] ARQUITETURA.md (estrutura, fluxo de dados)
- [x] COMPONENTES.md (guia de cada componente)
- [x] FUNCIONALIDADES.md (user stories mapeadas)
- [x] EXECUTAR.md (instruções de setup)

**Linhas de código:** ~320 + 600 (docs)

#### 📝 **TODOS** - Integração e Finalização

- [x] Criar BACKLOG.md completo
- [x] Atualizar README.md
- [x] Testes de integração
- [x] Revisão de código
- [x] Build de produção funcional

**Total TP4:** ~1550+ linhas de código + documentação completa

**Entregável:** Aplicação com fetch, gestos mobile, testes e documentação técnica

---

## ⏳ EM DESENVOLVIMENTO - TP5 (Próximo)

### 🔐 Autenticação e Backend Real

**Prioridade:** 🔴 Alta  
**Responsável:** Brice (Scrum Master)  
**Prazo:** Sprint 4 (Semanas 8-9)

- [ ] Integrar Firebase Authentication
  - [ ] Login com email/senha
  - [ ] Login com Google
  - [ ] Recuperação de senha
  - [ ] Registro de novos usuários
- [ ] Criar tipos de perfil (Paciente/Psicólogo)
- [ ] Proteção de rotas (AuthGuard)
- [ ] Persistência de sessão
- [ ] Firebase Firestore para dados
- [ ] Migrar localStorage → Firestore
- [ ] Sincronização em tempo real
- [ ] Logout seguro

**Estimativa:** 24 horas de dev  
**Valor:** Segurança e dados reais

---

### 💳 Sistema de Pagamentos

**Prioridade:** 🟠 Média-Alta  
**Responsável:** Karina (PO)  
**Prazo:** Sprint 4-5 (Semanas 8-11)

- [ ] Integração com Stripe/PagSeguro
- [ ] Fluxo de checkout
- [ ] Página de pagamento
- [ ] Confirmação de pagamento
- [ ] Histórico de transações
- [ ] Geração de recibos (PDF)
- [ ] Webhook para confirmação
- [ ] Tratamento de erros de pagamento
- [ ] Refund (cancelamento com devolução)

**Estimativa:** 32 horas de dev  
**Valor:** Monetização da plataforma

---

### 📧 Sistema de Notificações

**Prioridade:** 🟡 Média  
**Responsável:** Sâmela (Dev)  
**Prazo:** Sprint 5 (Semanas 10-11)

- [ ] Push notifications (Firebase Cloud Messaging)
- [ ] Email notifications (SendGrid/Mailgun)
- [ ] Notificações no app (toast/banner)
- [ ] Preferências de notificações
- [ ] Templates de email
- [ ] Notificar 24h antes da consulta
- [ ] Notificar quando agendamento confirmado
- [ ] Notificar quando cancelado

**Estimativa:** 16 horas de dev  
**Valor:** Engajamento e retenção

---

### 💬 Chat Terapeuta-Paciente

**Prioridade:** 🟡 Média  
**Responsável:** Equipe (pair programming)  
**Prazo:** Sprint 5 (Semanas 10-11)

- [ ] Interface de chat
- [ ] Firebase Realtime Database
- [ ] Mensagens em tempo real
- [ ] Indicador "digitando..."
- [ ] Upload de arquivos (imagens)
- [ ] Criptografia end-to-end (opcional)
- [ ] Histórico de mensagens
- [ ] Notificação de nova mensagem
- [ ] Status online/offline

**Estimativa:** 28 horas de dev  
**Valor:** Comunicação contínua

---

### 📊 Dashboard do Psicólogo

**Prioridade:** 🟡 Média  
**Responsável:** Brice + Karina  
**Prazo:** Sprint 5 (Semanas 10-11)

- [ ] Página de dashboard (/dashboard)
- [ ] Estatísticas visuais (gráficos)
- [ ] Quantidade de consultas (mensal)
- [ ] Receita total
- [ ] Próximas consultas (widget)
- [ ] Taxa de cancelamento
- [ ] Avaliações dos pacientes (média)
- [ ] Exportar relatórios (CSV/PDF)

**Estimativa:** 20 horas de dev  
**Valor:** Insights para profissionais

---

## 🔮 FUTURO - Pós-TP5

### 🌟 Features Avançadas

#### 1. Sistema de Avaliações
**Prioridade:** 🟢 Baixa

- [ ] Paciente avalia psicólogo (1-5 estrelas)
- [ ] Comentários opcionais
- [ ] Média de avaliações visível
- [ ] Filtrar por melhores avaliados
- [ ] Denunciar avaliações impróprias

**Estimativa:** 12 horas

#### 2. Modo Escuro
**Prioridade:** 🟢 Baixa

- [ ] Toggle no menu de configurações
- [ ] CSS variables para dark mode
- [ ] Persistir preferência
- [ ] Smooth transition entre modos
- [ ] Modo automático (horário do dia)

**Estimativa:** 8 horas

#### 3. Vídeo Chamada (Teleconsulta)
**Prioridade:** 🔵 Muito Baixa (complexo)

- [ ] Integração com Zoom/Google Meet API
- [ ] Ou WebRTC nativo
- [ ] Agendar link da consulta
- [ ] Sala de espera virtual
- [ ] Gravação de sessão (com consentimento)
- [ ] Compartilhamento de tela

**Estimativa:** 60+ horas

#### 4. App Mobile Nativo (React Native)
**Prioridade:** 🔵 Muito Baixa

- [ ] Migrar para React Native
- [ ] Notificações push nativas
- [ ] Calendário integrado do celular
- [ ] Publicar na App Store
- [ ] Publicar na Google Play
- [ ] Deep linking

**Estimativa:** 120+ horas

#### 5. Acessibilidade Avançada
**Prioridade:** 🟡 Média (importante)

- [ ] Modo alto contraste (long press logo - TP1)
- [ ] Tamanhos de fonte ajustáveis
- [ ] Navegação completa por teclado
- [ ] Screen reader testing (NVDA, JAWS)
- [ ] Legendas em vídeos
- [ ] WCAG 2.1 AA compliance
- [ ] Auditoria de acessibilidade

**Estimativa:** 24 horas

#### 6. Projetos de Extensão Universitária
**Prioridade:** 🟠 Média-Alta (requisito inicial)

**Funcionalidades:**
- [ ] Cadastro de estudantes de psicologia
- [ ] Link com email institucional
- [ ] Busca de professores orientadores
- [ ] Filtros por área de pesquisa
- [ ] Cadastro de projetos sociais
- [ ] Matching estudante-projeto
- [ ] Contagem de horas para certificação
- [ ] Validação pelo orientador
- [ ] Ferramenta de notas/observações
- [ ] Integração com calendário
- [ ] Exportar certificado (PDF)

**Estimativa:** 40 horas  
**Justificativa:** Estava nos user stories originais (TP1), mas foi despriori zado para focar no core MVP

#### 7. Parcerias com Casas de Repouso
**Prioridade:** 🟢 Baixa (B2B complexo)

- [ ] Perfil de instituição
- [ ] Contrato mensal (diluído nas mensalidades)
- [ ] Dashboard administrativo
- [ ] Gestão de múltiplos pacientes
- [ ] Faturamento diferenciado
- [ ] Integração com sistemas de gestão

**Estimativa:** 60+ horas

---

## 🐛 BUGS E MELHORIAS

### 🔴 Alta Prioridade

- [ ] **Bug:** Badge de favoritos não atualiza ao voltar da página (precisa reload)
  - **Solução proposta:** Context API ou evento customizado
  - **Responsável:** Sâmela
  - **Estimativa:** 2 horas

- [ ] **Melhoria:** Loading state ao favoritar/desfavoritar
  - Atualmente é instantâneo, pode causar confusão
  - **Responsável:** Karina
  - **Estimativa:** 1 hora

### 🟡 Média Prioridade

- [ ] **Melhoria:** Validação de datas no agendamento
  - Impedir agendar no passado
  - Impedir fins de semana (se profissional não atende)
  - **Responsável:** Brice
  - **Estimativa:** 3 horas

- [ ] **Melhoria:** Paginação na SearchPage
  - Com 50+ profissionais, lista fica pesada
  - **Responsável:** Karina
  - **Estimativa:** 4 horas

- [ ] **Bug:** Swipe em desktop pode arrastar card acidentalmente
  - **Solução:** Detectar touch device e desabilitar em desktop
  - **Responsável:** Sâmela
  - **Estimativa:** 2 horas

### 🟢 Baixa Prioridade

- [ ] **Melhoria:** Animação ao adicionar/remover favoritos
  - Card "pulsa" ao ser favoritado
  - **Responsável:** Sâmela
  - **Estimativa:** 2 horas

- [ ] **Melhoria:** Skeleton loading ao invés de spinner
  - Mais moderno e dá sensação de velocidade
  - **Responsável:** Brice
  - **Estimativa:** 4 horas

- [ ] **Refactoring:** Extrair lógica de fetch para custom hook
  - `useFetchProfessionals()` reutilizável
  - **Responsável:** Brice
  - **Estimativa:** 3 horas

---

## 📊 Métricas do Projeto

### Linhas de Código (até TP4)

| Tipo | Linhas | Arquivos |
|------|--------|----------|
| **JavaScript/JSX** | ~2,100 | 20 |
| **CSS** | ~800 | 3 |
| **Testes** | ~400 | 4 |
| **Documentação** | ~1,500 | 5 (MD) |
| **TOTAL** | **~4,800** | **32** |

### Componentes

- **Páginas:** 7
- **Componentes:** 5
- **Utilitários (data/):** 3
- **Testes:** 3 suítes

### Cobertura de Testes (meta: 70%)

| Arquivo | Cobertura | Status |
|---------|-----------|--------|
| ProfessionalCard | 85% | ✅ |
| SearchPage | 75% | ✅ |
| AppointmentsPage | 80% | ✅ |
| **Média** | **80%** | ✅ Acima da meta |

---

## 🎯 Roadmap Visual

```
TP1 ━━━━━━━━━━━━━━━━━━━━━━━━━━━ ✅ 100%
     Planejamento e User Stories

TP2 ━━━━━━━━━━━━━━━━━━━━━━━━━━━ ✅ 100%
     Single-Page Application

TP3 ━━━━━━━━━━━━━━━━━━━━━━━━━━━ ✅ 100%
     Multi-Page + Agendamentos

TP4 ━━━━━━━━━━━━━━━━━━━━━━━━━━━ ✅ 100%
     Fetch API + Gestos + Testes

TP5 ━━━━━━━━━━━━━━━━━━━━━━━━━━━ ⏳ 0% (próximo)
     Autenticação + Backend Real

FUTURO ━━━━━━━━━━━━━━━━━━━━━━━ 📋 Planejado
       Features Avançadas
```

---

## 📈 Velocidade da Equipe

### Sprint Velocity (story points)

| Sprint | Planejado | Entregue | Velocidade |
|--------|-----------|----------|------------|
| TP1 | 10 | 10 | 100% |
| TP2 | 15 | 15 | 100% |
| TP3 | 18 | 18 | 100% |
| TP4 | 22 | 22 | 100% |
| **Média** | - | - | **100%** ✅ |

**Observação:** Equipe tem excelente taxa de entrega. Para TP5, podemos aumentar a carga para 25 story points.

---

## 💡 Aprendizados e Insights

### O que funcionou bem ✅

1. **Divisão clara de responsabilidades** por pessoa (Brice, Karina, Sâmela)
2. **Documentação em português** facilita compreensão
3. **Testes desde cedo** (TP4) previne regressões
4. **Vite é muito mais rápido** que Create React App
5. **localStorage é suficiente** para MVP, não precisa backend ainda
6. **Mobile-First CSS** simplifica responsividade
7. **Swipe nativo** (sem libs) ensina fundamentos e reduz bundle

### O que pode melhorar 🔧

1. **Context API** seria útil para compartilhar favoritos globalmente
2. **TypeScript** evitaria bugs de tipos (considerar para TP5)
3. **Commits mais frequentes** (algumas features em commits grandes)
4. **Mais testes end-to-end** (apenas unitários até agora)
5. **CI/CD** automatizado (GitHub Actions) economizaria tempo
6. **Design System mais robusto** (considerar Storybook)

### Decisões Técnicas Importantes 🎯

| Decisão | Alternativa | Justificativa |
|---------|-------------|---------------|
| **React Hooks** | Redux | Escopo pequeno, hooks suficientes |
| **localStorage** | Backend API | MVP rápido, migrar depois |
| **Vite** | CRA/Next.js | Velocidade e simplicidade |
| **Vitest** | Jest | Integração perfeita com Vite |
| **CSS Puro** | Tailwind/Styled | Aprendizado de fundamentos |
| **Fetch nativo** | Axios | Menos dependências |
| **Touch events** | Swiper.js | Entender os fundamentos |

---

## 📅 Cronograma Atualizado

| Semana | Sprint | Foco | Entregas |
|--------|--------|------|----------|
| 1 | TP1 | Planejamento | ✅ User stories, roadmap |
| 2-3 | TP2 | Single-Page | ✅ Componentes, layout mobile |
| 4-5 | TP3 | Multi-Page | ✅ Rotas, agendamentos, localStorage |
| 6-7 | TP4 | Fetch + Gestos + Testes | ✅ API dinâmica, swipe, testes, docs |
| **8-9** | **TP5** | **Autenticação + Backend** | 🔜 Firebase, Firestore, tipos de perfil |
| 10-11 | Extensão | Features avançadas | 🔮 Notificações, chat, dashboard |
| 12 | Final | Polish + Deploy | 🎯 Vercel, ajustes finais, apresentação |

---

## 🏆 Definição de Pronto (DoD)

Para considerar uma feature **concluída**, ela deve:

- ✅ Código implementado e funcionando
- ✅ Responsivo (mobile + desktop)
- ✅ Testes automatizados (quando aplicável)
- ✅ Revisado por pelo menos 1 membro da equipe
- ✅ Documentado (comentários + docs/ se necessário)
- ✅ Sem warnings do ESLint
- ✅ Build de produção sem erros
- ✅ Testado em Chrome e Safari
- ✅ Acessibilidade básica (labels, contraste, foco)

---

## 🚀 Como Priorizar Próximas Features

### Framework: MoSCoW

**Must Have (Obrigatório):**
- 🔴 Autenticação (TP5)
- 🔴 Backend real (Firebase)

**Should Have (Importante):**
- 🟠 Pagamentos
- 🟠 Notificações

**Could Have (Desejável):**
- 🟡 Chat
- 🟡 Dashboard
- 🟡 Projetos de extensão

**Won't Have (Não faremos agora):**
- 🔵 Vídeo chamada
- 🔵 App nativo
- 🔵 Parcerias B2B

---

## 📞 Contato e Responsabilidades

| Pessoa | Papel | Responsável por | GitHub |
|--------|-------|-----------------|--------|
| **Brice** | Scrum Master | Backend, auth, coordenação | @brice-dev |
| **Karina** | Product Owner | Requisitos, UI/UX, validação | @karina-po |
| **Sâmela** | Developer | Frontend, docs, review | @samela-dev |

---

## 📝 Notas da Retrospectiva TP4

**Data:** 13/03/2026

**O que foi bom:**
- ✅ Divisão de tarefas muito clara (cada um sabia o que fazer)
- ✅ Documentação ficou excelente (facilitará onboarding futuro)
- ✅ Testes deram confiança para refatorar
- ✅ Swipe gesture ficou muito intuitivo
- ✅ Fetch API preparou terreno para backend real

**O que pode melhorar:**
- ⚠️ Comunicação assíncrona às vezes atrasou integração
- ⚠️ Alguns commits muito grandes (dificulta review)
- ⚠️ Testes poderiam cobrir mais casos de erro

**Ações para TP5:**
- 🎯 Daily standups de 10 min (mesmo que assíncrono)
- 🎯 Commits menores e mais frequentes
- 🎯 Adicionar testes de integração (Cypress ou Playwright)
- 🎯 Pair programming em features complexas (Firebase)

---

**📌 Última atualização:** 13/03/2026 - Brice (Scrum Master)  
**📌 Próxima revisão:** Início do TP5 (Semana 8)

---

**🎉 Status Geral do Projeto: ON TRACK! 🎉**

