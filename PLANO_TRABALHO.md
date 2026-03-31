# 📋 PLANO DE TRABALHO - MELHORIAS TP4 → TP5

**Data:** 31/03/2026  
**Equipe:** Brice, Karina, Sâmela  
**Objetivo:** Melhorar projeto MindCare mantendo "low code" e estilo estudantil

---

## 🎯 VISÃO GERAL

Após análise do feedback do TP3 e do estado atual do TP4, identificamos melhorias essenciais que:
- ✅ Resolvem problemas apontados no feedback
- ✅ Mantêm código simples e apresentável
- ✅ Facilitam a explicação durante apresentação
- ✅ Agregam valor real ao projeto

---

## ✅ FEEDBACK TP3 - STATUS

### ⚠️ Problemas Identificados

1. **Consumo de dados deveria ser via Fetch (não import)** → ✅ RESOLVIDO no TP4
2. **Falta menu de navegação completo** → ✅ RESOLVIDO no TP4 (BottomNav com 4 itens)
3. **Sem gestos mobile específicos** → ✅ RESOLVIDO no TP4 (swipe para favoritar)
4. **Falta tratamento robusto de erros** → ✅ RESOLVIDO no TP4 (try/catch, loading states)

**Conclusão:** Todos os problemas do TP3 já foram endereçados no TP4! 🎉

---

## 📊 ESTADO ATUAL DO PROJETO

### ✅ O que temos (TP4)
- React + Vite + React Router
- 7 páginas funcionais
- Fetch API implementada
- Gestos mobile (swipe)
- Sistema de favoritos (localStorage)
- Sistema de agendamentos (localStorage)
- 3 suítes de testes (80% cobertura)
- Documentação técnica completa
- BottomNav com 4 itens
- Responsivo mobile-first
- ~4.800 linhas de código

### ⚠️ O que pode melhorar
1. **Bug de atualização de badge** (favoritos não atualizam em tempo real)
2. **Falta validação de formulários** (pode agendar em datas passadas)
3. **Experiência de usuário** (loading states podem ser melhores)
4. **Organização de código** (alguns componentes grandes)
5. **Testes poderiam cobrir mais cenários**
6. **Documentação do código** (comentários inline)

---

## 👥 DIVISÃO DE TRABALHO (3 PESSOAS)

Vamos dividir em **3 frentes independentes** que depois serão integradas:

---

## 👤 PESSOA 1: REFATORAÇÃO E BUG FIXES

**Responsabilidade:** Melhorar código existente, corrigir bugs, adicionar validações

### Tarefas (8-10 horas)

#### 1. Corrigir Bug de Badge de Favoritos (2h)
**Problema:** Badge de favoritos no BottomNav não atualiza ao voltar da página

**Solução:**
- Implementar Context API para compartilhar favoritos globalmente
- Criar `FavoritesContext.jsx`
- Migrar lógica de favoritos para o contexto
- Atualizar componentes para usar o contexto

**Arquivos:**
- Criar: `/src/context/FavoritesContext.jsx`
- Modificar: `App.jsx`, `BottomNav.jsx`, `ProfessionalCard.jsx`, `FavoritesPage.jsx`

**Como explicar:** "Implementamos Context API do React para gerenciar favoritos de forma global, resolvendo o problema de sincronização entre páginas"

#### 2. Validações de Formulário (2h)
**O que fazer:**
- Validar data de agendamento (não permitir passado)
- Validar horários (apenas horário comercial 8h-18h)
- Validar campos obrigatórios
- Feedback visual de erros

**Arquivos:**
- Criar: `/src/utils/validators.js`
- Modificar: `NewAppointmentPage.jsx`

**Exemplo:**
```jsx
// validators.js
export function isValidAppointmentDate(date) {
  const selected = new Date(date)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return selected >= today
}

export function isValidTime(time) {
  const [hours] = time.split(':')
  const h = parseInt(hours)
  return h >= 8 && h <= 18
}
```

#### 3. Melhorar Estados de Loading (2h)
**O que fazer:**
- Substituir spinner simples por Skeleton Loading
- Adicionar animação de "shimmer"
- Melhorar feedback visual

**Arquivos:**
- Criar: `/src/components/SkeletonCard.jsx`
- Modificar: `SearchPage.jsx`, `FavoritesPage.jsx`
- Adicionar CSS em `Components.css`

**Por quê:** Skeleton loading dá sensação de app mais rápido e profissional

#### 4. Adicionar Comentários no Código (2h)
**O que fazer:**
- Adicionar JSDoc comments em funções importantes
- Comentar lógica complexa (swipe, filtros)
- Adicionar TODOs para melhorias futuras

**Exemplo:**
```jsx
/**
 * Filtra lista de profissionais baseado nos critérios de busca
 * @param {Array} professionals - Lista completa de profissionais
 * @param {Object} filters - Objeto com filtros (name, city, specialty, maxPrice)
 * @returns {Array} Lista filtrada
 */
function filterProfessionals(professionals, filters) {
  // ...
}
```

---

## 👤 PESSOA 2: NOVAS FUNCIONALIDADES

**Responsabilidade:** Adicionar features pequenas mas úteis

### Tarefas (8-10 horas)

#### 1. Histórico de Buscas Recentes (3h)
**O que fazer:**
- Salvar últimas 5 buscas no localStorage
- Exibir em SearchPage como chips clicáveis
- Permitir limpar histórico

**Arquivos:**
- Criar: `/src/data/searchHistoryStorage.js`
- Modificar: `SearchPage.jsx`
- Adicionar CSS

**Como funciona:**
```jsx
// Ao pesquisar, salvar no histórico
const handleSearch = (term) => {
  saveSearchTerm(term)
  // ... lógica de busca
}

// Exibir histórico
{searchHistory.length > 0 && (
  <div className="search-history">
    <h4>Buscas recentes:</h4>
    {searchHistory.map(term => (
      <button key={term} onClick={() => setSearchTerm(term)}>
        {term}
      </button>
    ))}
  </div>
)}
```

#### 2. Sistema de Filtros Avançados (3h)
**O que fazer:**
- Adicionar filtro por faixa de preço (slider)
- Adicionar filtro por avaliação mínima
- Adicionar filtro "Disponível hoje"
- Botão "Limpar filtros"

**Arquivos:**
- Criar: `/src/components/FilterPanel.jsx`
- Modificar: `SearchPage.jsx`, `SearchPage.css`

**UI:**
```
┌─────────────────────────┐
│ Filtros                  │
├─────────────────────────┤
│ Preço: R$ 100 - R$ 300   │
│ ━━━●━━━━━━━━━━━━━━━━   │
│                          │
│ Avaliação mínima: ⭐⭐⭐⭐  │
│                          │
│ □ Disponível hoje        │
│                          │
│ [Limpar filtros]         │
└─────────────────────────┘
```

#### 3. Confirmação de Ações Críticas (2h)
**O que fazer:**
- Modal de confirmação ao cancelar agendamento
- Modal de confirmação ao remover favorito (swipe ou botão)
- Criar componente reutilizável `ConfirmModal.jsx`

**Arquivos:**
- Criar: `/src/components/ConfirmModal.jsx`
- Modificar: `AppointmentsPage.jsx`, `ProfessionalCard.jsx`

**Exemplo:**
```jsx
<ConfirmModal
  isOpen={showConfirm}
  title="Cancelar agendamento?"
  message="Esta ação não pode ser desfeita."
  onConfirm={handleCancelAppointment}
  onCancel={() => setShowConfirm(false)}
/>
```

---

## 👤 PESSOA 3: TESTES E DOCUMENTAÇÃO

**Responsabilidade:** Aumentar cobertura de testes, melhorar docs

### Tarefas (8-10 horas)

#### 1. Adicionar Mais Testes (5h)
**O que fazer:**
- Testes para FavoritesPage (2 cenários)
- Testes para ProfessionalPage (3 cenários)
- Testes para validadores (5 cenários)
- Testes end-to-end simples (fluxo completo)

**Arquivos:**
- Criar: `FavoritesPage.test.jsx`
- Criar: `ProfessionalPage.test.jsx`
- Criar: `/src/utils/validators.test.jsx`

**Meta:** Aumentar cobertura de 80% para 90%+

**Exemplo de teste:**
```jsx
describe('FavoritesPage', () => {
  it('exibe mensagem quando não há favoritos', async () => {
    localStorage.clear()
    render(<BrowserRouter><FavoritesPage /></BrowserRouter>)
    
    expect(screen.getByText(/Você ainda não tem favoritos/i)).toBeInTheDocument()
  })
  
  it('exibe lista de profissionais favoritados', async () => {
    localStorage.setItem('mindcare_favorites', JSON.stringify([1, 2]))
    
    render(<BrowserRouter><FavoritesPage /></BrowserRouter>)
    
    expect(await screen.findByText(/Dra. Maria/i)).toBeInTheDocument()
  })
})
```

#### 2. Guia de Contribuição (2h)
**O que fazer:**
- Criar `CONTRIBUTING.md` explicando como contribuir
- Incluir guia de setup
- Incluir guia de estrutura de commits
- Incluir checklist de pull request

**Arquivo:**
- Criar: `/CONTRIBUTING.md`

**Conteúdo:**
```markdown
# Como Contribuir

## Setup do Projeto
1. Clone o repositório
2. `npm install`
3. `npm run dev`

## Padrões de Código
- Componentes em PascalCase
- CSS em kebab-case
- Sempre adicionar testes
- Sempre validar com `npm run lint`

## Commits
Usar formato: `tipo: descrição`

Tipos:
- feat: Nova funcionalidade
- fix: Correção de bug
- docs: Documentação
- test: Testes
- refactor: Refatoração

Exemplos:
- `feat: adiciona filtro de preço`
- `fix: corrige bug de badge de favoritos`
- `docs: atualiza README com instruções`
```

#### 3. Documentação Inline e README (3h)
**O que fazer:**
- Adicionar comentários JSDoc em todos os componentes principais
- Atualizar README.md com screenshots
- Criar CHANGELOG.md com histórico de versões
- Adicionar badges no README (testes, cobertura)

**Arquivos:**
- Modificar: `README.md`
- Criar: `CHANGELOG.md`
- Adicionar comentários em: todos os componentes principais

**README melhorado:**
```markdown
# MindCare 🧠💙

> Plataforma de agendamento de consultas com psicólogos

[![Tests](https://img.shields.io/badge/tests-passing-brightgreen)]()
[![Coverage](https://img.shields.io/badge/coverage-90%25-brightgreen)]()
[![React](https://img.shields.io/badge/React-19.2.0-blue)]()

## ✨ Features

- 🔍 Busca e filtros avançados
- ⭐ Sistema de favoritos
- 📅 Agendamento de consultas
- 📱 Gestos mobile (swipe)
- 🎨 Design responsivo
- ✅ 90%+ de cobertura de testes

## 📸 Screenshots

[Adicionar screenshots aqui]

## 🚀 Quick Start

\`\`\`bash
npm install
npm run dev
\`\`\`

Acesse: http://localhost:5173
```

---

## 📅 CRONOGRAMA SUGERIDO

### Semana 1 (5 dias úteis)
- **Dias 1-2:** Desenvolvimento individual (cada pessoa em sua frente)
- **Dia 3:** Code review cruzado (todos revisam código uns dos outros)
- **Dia 4:** Integração e resolução de conflitos
- **Dia 5:** Testes finais e ajustes

### Comunicação
- Daily standup de 10 minutos (pode ser assíncrono):
  - O que fiz ontem?
  - O que vou fazer hoje?
  - Tenho algum bloqueio?

---

## 🔀 INTEGRAÇÃO

Após todos terminarem suas tarefas:

1. **Code Review:**
   - Cada pessoa revisa o código de outra
   - Usar checklist:
     - ✅ Código funciona sem erros
     - ✅ Segue padrões do projeto
     - ✅ Tem testes (quando aplicável)
     - ✅ Tem comentários explicativos
     - ✅ CSS usa variables

2. **Merge:**
   - Pessoa 1 → main (primeiro)
   - Pessoa 2 → main (resolver conflitos se houver)
   - Pessoa 3 → main (última)

3. **Teste Integrado:**
   - Rodar `npm test` (todos os testes)
   - Rodar `npm run build` (build de produção)
   - Testar app manualmente em Chrome e Safari
   - Testar em mobile (DevTools)

4. **Deploy:**
   - Deploy no Vercel/Netlify
   - Testar em produção
   - Compartilhar link

---

## 📚 DOCUMENTAÇÃO DAS SKILLS

Foi criada uma pasta `.github/skills/` com 4 skills personalizadas para GitHub Copilot:

1. **react-component** - Como criar componentes seguindo padrões
2. **add-page** - Como adicionar novas páginas/rotas
3. **vitest-testing** - Como criar testes
4. **fetch-api** - Como implementar fetch de dados

**Como usar:**
- Simplesmente peça ao Copilot: "Crie um componente de filtro"
- Ele automaticamente seguirá os padrões do projeto!

Leia `.github/skills/README.md` para mais detalhes.

---

## 🎯 DEFINIÇÃO DE PRONTO

Uma tarefa está **PRONTA** quando:

- ✅ Código implementado e testado
- ✅ Funciona em mobile e desktop
- ✅ Não tem warnings do ESLint
- ✅ Tem testes (quando aplicável)
- ✅ Tem comentários explicativos
- ✅ Build de produção funciona
- ✅ Documentação atualizada (se necessário)
- ✅ Revisado por pelo menos 1 pessoa

---

## ⚠️ OBSERVAÇÕES IMPORTANTES

### Manter "Low Code" e Estilo Estudantil

**FAZER ✅:**
- Código simples e legível
- Comentários em português
- Vanilla JS/CSS (sem bibliotecas extras)
- Explicações didáticas
- Soluções diretas

**NÃO FAZER ❌:**
- Over-engineering
- Padrões muito sofisticados
- Abstrações desnecessárias
- Código que parece muito "IA"
- Adicionar bibliotecas sem necessidade

### Durante Apresentação

Cada pessoa deve ser capaz de explicar:
1. **O que fez** (resumo em 2 minutos)
2. **Por que escolheu essa abordagem** (decisões técnicas)
3. **Desafios enfrentados** (1-2 exemplos)
4. **O que aprendeu** (reflexão)

**Exemplo:**
> "Implementei Context API para resolver o bug de sincronização de favoritos. 
> Escolhi essa abordagem porque é nativa do React e evita prop drilling. 
> O desafio foi migrar a lógica existente sem quebrar os testes. 
> Aprendi como Context funciona por baixo dos panos e quando usar."

---

## 📊 MÉTRICAS DE SUCESSO

Ao final, teremos:

| Métrica | Antes (TP4) | Meta (TP5) | Melhoria |
|---------|-------------|------------|----------|
| **Cobertura de testes** | 80% | 90%+ | +10% |
| **Bugs conhecidos** | 3 | 0 | -3 |
| **Funcionalidades** | 12 | 18 | +6 |
| **Linhas documentadas** | 30% | 80%+ | +50% |
| **User Stories completas** | 4/6 | 6/6 | 100% |

---

## 🚀 ALÉM DO TP5

Se sobrarem tempo e motivação:

**Quick Wins (1-2h cada):**
- [ ] Dark mode (toggle no AboutPage)
- [ ] Animações de transição entre páginas
- [ ] Toast notifications (biblioteca react-hot-toast)
- [ ] Export de agendamentos para .ics (Google Calendar)
- [ ] PWA básico (manifest.json + service worker)

**Features Médias (3-5h cada):**
- [ ] Sistema de notificações no app
- [ ] Chat simulado (mensagens pré-programadas)
- [ ] Onboarding tutorial (primeira vez)
- [ ] Busca por voz (Web Speech API)

**Não fazer agora (muito complexo):**
- ❌ Autenticação real (deixar para depois)
- ❌ Backend real (deixar para depois)
- ❌ Pagamentos (deixar para depois)
- ❌ Video chamada (muito complexo)

---

## 📞 CONTATO E RESPONSABILIDADES

| Pessoa | Frente | Responsável por |
|--------|--------|-----------------|
| **Pessoa 1** | Refatoração | Bug fixes, validações, loading, comentários |
| **Pessoa 2** | Features | Histórico, filtros, confirmações |
| **Pessoa 3** | Qualidade | Testes, docs, CONTRIBUTING, README |

**Comunicação:**
- Daily standup (assíncrono ok)
- Code review obrigatório
- Dúvidas: perguntar no grupo
- Bloqueios: avisar imediatamente

---

## ✅ CHECKLIST FINAL

Antes de considerar **PRONTO**:

### Código
- [ ] Todos os testes passando (`npm test`)
- [ ] Build sem erros (`npm run build`)
- [ ] Sem warnings do ESLint (`npm run lint`)
- [ ] App funciona em Chrome e Safari
- [ ] App funciona em mobile (testado)

### Qualidade
- [ ] Cobertura de testes ≥ 90%
- [ ] Bugs conhecidos resolvidos
- [ ] Código comentado (funções complexas)
- [ ] Validações implementadas
- [ ] Estados de loading/error em todas as páginas

### Documentação
- [ ] README.md atualizado
- [ ] CONTRIBUTING.md criado
- [ ] CHANGELOG.md criado
- [ ] Skills criadas e documentadas
- [ ] Comentários JSDoc adicionados

### Deploy
- [ ] Deploy em produção (Vercel/Netlify)
- [ ] Link testado e funcionando
- [ ] Sem erros no console
- [ ] Performance aceitável (< 3s para carregar)

---

**🎉 BOA SORTE EQUIPE! 🎉**

Lembrem-se: **código simples e bem explicado > código complexo e confuso**

Foco em qualidade, não quantidade. O objetivo é um projeto apresentável e fácil de explicar!

---

**Criado em:** 31/03/2026  
**Próxima revisão:** Após integração (Semana 1, Dia 4)

