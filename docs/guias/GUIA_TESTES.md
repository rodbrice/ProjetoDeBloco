# 🧪 GUIA DE TESTES - MindCare

**Respondendo:** "Esses arquivos .test precisam?"

---

## ✅ RESPOSTA CURTA

**SIM, os testes são importantes e devem ser mantidos!**

Mas não precisa testar TUDO - apenas o que importa.

---

## 📊 SITUAÇÃO ATUAL

### Testes Existentes (TP4)

| Arquivo | LOC | Casos | Cobertura | Status |
|---------|-----|-------|-----------|--------|
| `ProfessionalCard.test.jsx` | ~100 | 5 | 85% | ✅ Excelente |
| `SearchPage.test.jsx` | ~150 | 6 | 75% | ✅ Muito bom |
| `AppointmentsPage.test.jsx` | ~120 | 4 | 80% | ✅ Muito bom |
| **TOTAL** | ~370 | **15** | **80%** | ✅ Acima da meta |

**Meta do projeto:** 70% de cobertura  
**Alcançado:** 80% ✅

---

## 🤔 POR QUE TESTES SÃO IMPORTANTES?

### 1. **Confiança para Mudar Código**

**Sem testes:**
```
Você: "Vou refatorar esse código..."
Também você: "E se eu quebrar algo? 😰"
Resultado: Não muda nada, código fica ruim
```

**Com testes:**
```
Você: "Vou refatorar esse código..."
Testes: "Se você quebrar algo, eu te aviso! ✅"
Resultado: Código melhora sem medo
```

### 2. **Documentação Viva**

Testes mostram **como** o código deve funcionar:

```jsx
it('filtra profissionais por cidade', () => {
  // Aqui você vê EXATAMENTE como o filtro funciona
  const result = filterByCity(professionals, 'São Paulo')
  expect(result).toHaveLength(2)
})
```

Melhor que comentário! Comentário pode ficar desatualizado, teste não.

### 3. **Profissionalismo**

**Projeto sem testes:**
> "É só um projeto estudantil..."

**Projeto com testes:**
> "Somos estudantes, mas fazemos código profissional! 💪"

Na entrevista de emprego, você pode falar:
> "Implementamos testes automatizados com 80% de cobertura usando Vitest e React Testing Library"

Isso **impressiona**.

### 4. **Evita Regressões**

**Cenário real:**
```
Semana 1: Implementa funcionalidade X
Semana 2: Implementa funcionalidade Y
Semana 3: Descobre que Y quebrou X! 😱
```

**Com testes:**
```
Semana 2: Implementa Y
Testes: "ERRO! Y quebrou X!"
Você: Corrige antes de commitar
```

---

## ❓ O QUE TESTAR? (Prioridades)

### ✅ ALTA PRIORIDADE (Testar sempre)

**1. Lógica de Negócio**
- Filtros de busca
- Cálculos de preço
- Validações de formulário
- Regras de agendamento

**2. Componentes Complexos**
- ProfessionalCard (tem swipe, favoritos)
- SearchPage (fetch, filtros, estados)
- AppointmentsPage (CRUD de agendamentos)

**3. Fluxos Críticos**
- Criar agendamento
- Favoritar/desfavoritar
- Buscar profissionais

### ⚠️ MÉDIA PRIORIDADE (Testar se tiver tempo)

**4. Integrações**
- Fetch de dados
- localStorage
- Navegação entre páginas

**5. Estados de UI**
- Loading
- Error
- Empty state

### ❌ BAIXA PRIORIDADE (Pode pular)

**6. Componentes Muito Simples**
- Header (só exibe título)
- Badge (só mostra número)
- Botões básicos

**7. Páginas Estáticas**
- AboutPage (só texto)
- NotFoundPage (só mensagem)

**8. Configurações**
- vite.config.js
- eslint.config.js

---

## 📋 DECISÃO: QUAIS TESTES MANTER?

### ✅ MANTER (obrigatório)

1. **ProfessionalCard.test.jsx**
   - Por quê? Componente complexo (swipe, favoritos, navegação)
   - Testes: renderização, links, favoritar, swipe
   - LOC: ~100

2. **SearchPage.test.jsx**
   - Por quê? Página principal, fetch, filtros
   - Testes: loading, erro, busca, filtros
   - LOC: ~150

3. **AppointmentsPage.test.jsx**
   - Por quê? Lógica de negócio (CRUD de agendamentos)
   - Testes: lista, criar, cancelar, estados
   - LOC: ~120

**Total:** 3 arquivos, ~370 linhas, 15 casos de teste

---

### ➕ ADICIONAR (recomendado para TP5)

4. **FavoritesPage.test.jsx** (NOVO)
   - Por quê? Testa integração com localStorage e fetch
   - Testes: empty state, lista, remover favorito
   - LOC estimado: ~80
   - Tempo: 1.5h

5. **ProfessionalPage.test.jsx** (NOVO)
   - Por quê? Testa roteamento com parâmetro + fetch
   - Testes: carrega profissional, 404, favoritar
   - LOC estimado: ~100
   - Tempo: 2h

6. **validators.test.jsx** (NOVO)
   - Por quê? Funções utilitárias (fácil de testar)
   - Testes: validação de data, hora, campos
   - LOC estimado: ~60
   - Tempo: 1h

**Total adicional:** 3 arquivos, ~240 linhas, ~12 casos de teste

---

### ❌ NÃO PRECISA TESTAR

- ❌ Header.test.jsx (muito simples)
- ❌ Badge.test.jsx (muito simples)
- ❌ BottomNav.test.jsx (já testado indiretamente)
- ❌ AboutPage.test.jsx (página estática)
- ❌ NotFoundPage.test.jsx (página estática)
- ❌ AppShell.test.jsx (wrapper simples)

---

## 📊 RESULTADO FINAL

### Antes (TP4)
- 3 arquivos de teste
- ~370 linhas
- 15 casos de teste
- 80% de cobertura

### Depois (TP5 - proposta)
- 6 arquivos de teste (+3)
- ~610 linhas (+240)
- 27 casos de teste (+12)
- 90%+ de cobertura (+10%)

---

## 🎯 MÉTRICAS DE QUALIDADE

### O que é Cobertura de Testes?

**Cobertura** = % de linhas de código executadas pelos testes

```bash
npm run test:coverage
```

**Saída:**
```
-----------------------------------
File                  | % Stmts | % Branch | % Funcs | % Lines
-----------------------------------
ProfessionalCard.jsx  |  85.71  |  80.00   |  83.33  |  85.71
SearchPage.jsx        |  75.00  |  70.00   |  80.00  |  75.00
AppointmentsPage.jsx  |  80.00  |  75.00   |  77.78  |  80.00
-----------------------------------
All files             |  80.24  |  75.00   |  80.37  |  80.24
-----------------------------------
```

**Interpretação:**
- < 50% = 🔴 Ruim (código não confiável)
- 50-70% = 🟡 Aceitável (básico)
- 70-90% = 🟢 Bom (projeto estudantil excelente)
- > 90% = 🌟 Excelente (nível profissional)

**MindCare:** 80% = 🟢 **Muito bom!**

---

## 💰 CUSTO x BENEFÍCIO

### Investimento de Tempo

| Atividade | Tempo | Benefício |
|-----------|-------|-----------|
| Escrever testes iniciais | 5-8h | Alto (base sólida) |
| Manter testes atualizados | 10-20% do tempo de dev | Alto (evita bugs) |
| Debugar sem testes | 50%+ do tempo de dev | Nenhum (só dor de cabeça) |

**Conclusão:** Testes **economizam** tempo no médio/longo prazo!

### ROI (Retorno sobre Investimento)

**Sem testes:**
```
Semana 1: Desenvolve feature A (5h)
Semana 2: Desenvolve feature B (5h)
Semana 3: Bug em A! Debug (3h) + Fix (2h) = 5h
Semana 4: Feature B quebrou A de novo! (4h)
TOTAL: 19h
```

**Com testes:**
```
Semana 1: Feature A + testes (6h)
Semana 2: Feature B + testes (6h)
  Testes de A falham! Fix imediato (0.5h)
Semana 3: Nova feature C + testes (6h)
  Todos os testes passam!
TOTAL: 18.5h
```

**Testes economizam tempo E aumentam qualidade! 📈**

---

## 🎓 PARA APRESENTAÇÃO

### Como Explicar os Testes

**Pergunta do professor:**
> "Por que vocês fizeram testes?"

**Resposta:**
> "Implementamos testes automatizados para garantir que o código funciona corretamente 
> e que mudanças futuras não quebram funcionalidades existentes. Usamos Vitest com 
> React Testing Library, seguindo boas práticas de teste de componentes React. 
> Alcançamos 80% de cobertura, acima da meta de 70%, testando principalmente lógica 
> de negócio e componentes complexos."

**Pergunta:**
> "Quanto tempo levou para fazer testes?"

**Resposta:**
> "Aproximadamente 5 horas no total para os 3 arquivos de teste atuais. 
> Isso representa cerca de 15% do tempo total de desenvolvimento, mas economiza 
> tempo de debugging e dá confiança para refatorar código."

**Pergunta:**
> "Mostre um exemplo de teste."

**Resposta:**
```jsx
it('filtra profissionais por cidade', async () => {
  const user = userEvent.setup()
  render(<BrowserRouter><SearchPage /></BrowserRouter>)
  
  await screen.findByText('Dra. Maria') // Aguarda dados carregarem
  
  const cityFilter = screen.getByLabelText('Cidade')
  await user.selectOptions(cityFilter, 'São Paulo')
  
  // Verifica que apenas profissionais de SP aparecem
  expect(screen.getByText('Dra. Maria')).toBeInTheDocument()
  expect(screen.queryByText('Dr. João - RJ')).not.toBeInTheDocument()
})
```

**Explicação:**
> "Este teste simula um usuário selecionando uma cidade no filtro e verifica 
> que apenas profissionais daquela cidade aparecem. Usamos `userEvent` para 
> simular interação real e `waitFor`/`findBy` para lidar com operações assíncronas."

---

## 🚀 COMEÇANDO COM TESTES (Guia Rápido)

### 1. Rodar Testes

```bash
# Modo watch (re-executa ao salvar arquivo)
npm test

# Interface visual
npm run test:ui

# Com relatório de cobertura
npm run test:coverage
```

### 2. Estrutura de um Teste

```jsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import MeuComponente from './MeuComponente.jsx'

describe('MeuComponente', () => {
  it('renderiza corretamente', () => {
    // ARRANGE - Preparar
    render(<MeuComponente nome="João" />)
    
    // ACT - Agir (não necessário neste caso)
    
    // ASSERT - Verificar
    expect(screen.getByText('João')).toBeInTheDocument()
  })
})
```

### 3. Padrão AAA (Arrange, Act, Assert)

```jsx
it('soma dois números', () => {
  // ARRANGE - Preparar dados
  const a = 2
  const b = 3
  
  // ACT - Executar ação
  const result = soma(a, b)
  
  // ASSERT - Verificar resultado
  expect(result).toBe(5)
})
```

---

## 📚 RECURSOS DE APRENDIZADO

### Documentação Oficial
- [Vitest](https://vitest.dev) - Framework de testes
- [React Testing Library](https://testing-library.com/react) - Testar componentes React
- [Jest-DOM](https://github.com/testing-library/jest-dom) - Matchers customizados

### Skill Criada
- `.github/skills/vitest-testing/SKILL.md` - Guia completo do projeto

### Exemplos no Projeto
- `src/components/ProfessionalCard.test.jsx`
- `src/pages/SearchPage.test.jsx`
- `src/pages/AppointmentsPage.test.jsx`

---

## ✅ DECISÃO FINAL

### MANTER os 3 testes existentes:
- ✅ ProfessionalCard.test.jsx
- ✅ SearchPage.test.jsx
- ✅ AppointmentsPage.test.jsx

### ADICIONAR (Pessoa 3 - TP5):
- ➕ FavoritesPage.test.jsx
- ➕ ProfessionalPage.test.jsx
- ➕ validators.test.jsx

### Meta: 90%+ de cobertura

**Por quê?**
1. ✅ Confiança para refatorar
2. ✅ Evita regressões
3. ✅ Documentação viva
4. ✅ Profissionalismo
5. ✅ Facilita manutenção
6. ✅ Diferencial no currículo

---

## 🎯 CONCLUSÃO

**Sim, os testes são necessários e devem ser mantidos!**

Eles:
- ✅ Aumentam qualidade do código
- ✅ Economizam tempo no longo prazo
- ✅ Dão confiança para fazer mudanças
- ✅ Impressionam em apresentações
- ✅ São diferencial profissional

**Investimento:** 5-8h (15% do tempo)  
**Retorno:** Código robusto, sem regressões, fácil de manter

**Vale muito a pena! 💯**

---

**Criado em:** 31/03/2026  
**Para mais detalhes:** Ver `.github/skills/vitest-testing/SKILL.md`

