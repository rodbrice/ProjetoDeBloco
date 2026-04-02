# 🩺 Separação de Contas: Psicólogo vs Paciente

## 📋 Resumo das Implementações

Este documento descreve as mudanças realizadas para diferenciar a experiência de **psicólogos** e **pacientes** no sistema MindCare.

---

## 🎯 Objetivos

1. ✅ Criar visualização separada para psicólogos verem suas consultas
2. ✅ Mock de consultas pré-agendadas para cada psicólogo
3. ✅ Navegação diferenciada (pacientes têm Favoritos, psicólogos não)
4. ✅ Manter simplicidade - sem backend complexo

---

## 📁 Arquivos Criados

### 1. `src/data/mockPsychologistAppointments.js`

**Propósito:** Armazena consultas fictícias para demonstração do fluxo de psicólogos.

**Estrutura:**
```javascript
{
  'ana-souza': [
    {
      id: 'psy-apt-1',
      patientName: 'Maria Silva',
      date: '2026-04-05',
      time: '14:00',
      status: 'scheduled',
      type: 'Primeira consulta',
      createdAt: '2026-03-28T10:00:00Z'
    },
    // ... mais consultas
  ],
  'bruno-lima': [ /* ... */ ],
  // ... outros psicólogos
}
```

**Funções:**
- `getPsychologistAppointments(professionalId)` - Retorna consultas de um psicólogo
- `mapEmailToProfessionalId(email)` - Mapeia email para ID do profissional

**Exemplo:**
```javascript
// Email: ana.psi@email.com → ID: 'ana-souza'
// Email: bruno.psi@email.com → ID: 'bruno-lima'
```

---

### 2. `src/pages/PsychologistAppointmentsPage.jsx`

**Propósito:** Página exclusiva para psicólogos visualizarem consultas agendadas com eles.

**Características:**
- ✅ Verifica se usuário é psicólogo (`user.userType === 'psychologist'`)
- ✅ Mapeia email do usuário para ID do profissional
- ✅ Carrega consultas do mock
- ✅ Exibe nome do **paciente** (ao invés do psicólogo)
- ✅ Mostra tipo de consulta (Primeira consulta, Retorno)
- ✅ Badge de status (Agendado, Cancelado)
- ✅ Mensagem informativa sobre demonstração

**Layout:**
```
┌─────────────────────────────────────┐
│ Minhas Consultas    🩺 Psicólogo   │
│ Acompanhe os agendamentos...        │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ 👤 Maria Silva      [Agendado]      │
│ Primeira consulta                   │
│ 📅 05/04/2026 • 🕒 14:00            │
│ ─────────────────────────────────── │
│ 💡 Esta é uma consulta de           │
│    demonstração...                  │
└─────────────────────────────────────┘
```

---

## 🔄 Arquivos Modificados

### 1. `src/routes/AppRoutes.jsx`

**Mudanças:**
- Importa `PsychologistAppointmentsPage` e `useAuth`
- Rota `/appointments` agora é **condicional**:
  - Se `user.userType === 'psychologist'` → `PsychologistAppointmentsPage`
  - Caso contrário → `AppointmentsPage` (página de paciente)

**Código:**
```jsx
<Route
  path="/appointments"
  element={
    user?.userType === 'psychologist' ? (
      <PsychologistAppointmentsPage />
    ) : (
      <AppointmentsPage
        appointments={appointments}
        onCancel={appointmentActions.cancelAppointment}
      />
    )
  }
/>
```

---

### 2. `src/components/BottomNav.jsx`

**Mudanças:**
- **Pacientes** veem: `[Buscar, Favoritos, Agenda, Perfil]` (4 itens)
- **Psicólogos** veem: `[Buscar, Pacientes, Perfil]` (3 itens - sem Favoritos)

**Navegação do Psicólogo:**
```jsx
{user.userType === 'patient' && (
  <NavLink to="/favorites">⭐ Favoritos</NavLink>
)}

<NavLink to="/appointments">
  📅 {user.userType === 'psychologist' ? 'Pacientes' : 'Agenda'}
</NavLink>
```

**Justificativa:**
- Psicólogos não precisam favoritar outros profissionais
- Label "Pacientes" deixa mais claro que são consultas agendadas COM ele

---

### 3. `src/styles/Components.css`

**Novos estilos:**

```css
.appointment-type {
  font-size: var(--text-sm);
  color: var(--text-muted);
  margin-top: var(--space-1);
  font-style: italic;
}

.appointment-info {
  margin-top: var(--space-3);
  padding-top: var(--space-3);
  border-top: 1px solid var(--border);
}

.info-note {
  font-size: var(--text-xs);
  color: var(--text-muted);
  line-height: 1.5;
  margin: 0;
}
```

**Uso:**
- `.appointment-type` - Exibe "Primeira consulta" ou "Retorno"
- `.appointment-info` - Container para notas informativas
- `.info-note` - Texto de nota/observação pequena

---

## 🎭 Como Testar

### 1. Login como Paciente

```
Email: paciente@email.com
Senha: qualquer senha
```

**Resultado:**
- Navegação mostra: Buscar | Favoritos | Agenda | Perfil
- Ao clicar em "Agenda", vê suas próprias consultas agendadas

---

### 2. Login como Psicólogo (Ana)

```
Email: ana.psi@email.com
Senha: qualquer senha
```

**Resultado:**
- Navegação mostra: Buscar | Pacientes | Perfil (sem Favoritos)
- Ao clicar em "Pacientes", vê 3 consultas:
  - Maria Silva - 05/04/2026 14:00
  - João Santos - 07/04/2026 16:00
  - Carlos Oliveira - 30/03/2026 (Cancelado)

---

### 3. Login como Psicólogo (Bruno)

```
Email: bruno.psi@email.com
Senha: qualquer senha
```

**Resultado:**
- Vê 2 consultas:
  - Ana Paula Costa - 03/04/2026 15:00
  - Pedro Henrique - 08/04/2026 09:00

---

### 4. Login como Psicólogo (Carla)

```
Email: carla.psi@email.com
Senha: qualquer senha
```

**Resultado:**
- Vê 3 consultas:
  - Fernanda Lima - 04/04/2026 11:00
  - Roberto Alves - 06/04/2026 14:00
  - Julia Martins - 09/04/2026 16:00

---

## 🧩 Lógica de Mapeamento

### Email → ID do Profissional

A função `mapEmailToProfessionalId()` usa uma convenção simples:

| Email contém | Mapeia para |
|--------------|-------------|
| `ana` | `ana-souza` |
| `bruno` | `bruno-lima` |
| `carla` | `carla-mendes` |
| `daniel` | `daniel-costa` |
| `elisa` | `elisa-rocha` |
| **Qualquer outro** | `ana-souza` (padrão) |

**Exemplos:**
- `ana.psi@email.com` → `ana-souza`
- `ana@gmail.com` → `ana-souza`
- `bruno123@test.com` → `bruno-lima`
- `psi.generico@email.com` → `ana-souza` (fallback)

---

## 📊 Dados do Mock

### Total de Consultas por Psicólogo

| Psicólogo | ID | Consultas | Agendadas | Canceladas |
|-----------|----|-----------|-----------|-----------| 
| Ana Souza | `ana-souza` | 3 | 2 | 1 |
| Bruno Lima | `bruno-lima` | 2 | 2 | 0 |
| Carla Mendes | `carla-mendes` | 3 | 3 | 0 |
| Daniel Costa | `daniel-costa` | 1 | 1 | 0 |
| Elisa Rocha | `elisa-rocha` | 2 | 2 | 0 |

**Total:** 11 consultas de demonstração

---

## 🔐 Diferenças: Psicólogo vs Paciente

| Aspecto | Paciente | Psicólogo |
|---------|----------|-----------|
| **Navegação** | Buscar, Favoritos, Agenda, Perfil | Buscar, Pacientes, Perfil |
| **Página /appointments** | Vê suas consultas agendadas | Vê consultas marcadas com ele |
| **Card de consulta** | Mostra nome do psicólogo | Mostra nome do paciente |
| **Fonte de dados** | localStorage (criadas pelo user) | Mock estático (fictício) |
| **Ações disponíveis** | Cancelar agendamento | Apenas visualização |
| **Favoritar** | ✅ Pode favoritar psicólogos | ❌ Não tem acesso a Favoritos |
| **Badge no perfil** | 👤 Paciente | 🩺 Psicólogo |

---

## 🚀 Melhorias Futuras (Fora do Escopo)

Estas funcionalidades **não foram implementadas** para manter a simplicidade:

### 1. Ações do Psicólogo
- [ ] Confirmar consulta pendente
- [ ] Remarcar consulta
- [ ] Cancelar consulta

### 2. Sincronização de Dados
- [ ] Consultas criadas por pacientes aparecem automaticamente para o psicólogo
- [ ] Atualização em tempo real (Firebase Firestore)

### 3. Detalhes do Paciente
- [ ] Ver perfil completo do paciente
- [ ] Histórico de consultas anteriores
- [ ] Notas da sessão

### 4. Calendário Visual
- [ ] View mensal/semanal
- [ ] Horários bloqueados
- [ ] Disponibilidade configurável

---

## 📝 Notas Importantes

### 1. **Demonstração Simples**
Este sistema usa **dados fictícios (mock)** para ilustrar o conceito. Em produção, seria necessário:
- Backend real (Firebase, Node.js, etc.)
- Sincronização de dados
- Autenticação robusta

### 2. **Convenção de Email**
O mapeamento de email é **simplificado**. Em produção:
- User teria campo `professionalId` no banco de dados
- Ou seria feito match por CRP/CNPJ
- Ou psicólogo se vincularia ao perfil público dele

### 3. **Dados Isolados**
As consultas no mock são **independentes** das consultas criadas por pacientes no localStorage. Para unificar, seria necessário:
- Migrar para Firestore
- Criar collection `appointments` compartilhada
- Queries por `patientId` ou `psychologistId`

---

## ✅ Checklist de Implementação

- [x] Criar mock de consultas (`mockPsychologistAppointments.js`)
- [x] Criar página para psicólogos (`PsychologistAppointmentsPage.jsx`)
- [x] Atualizar rotas para renderizar página condicional
- [x] Atualizar navegação (BottomNav) para diferir por tipo de usuário
- [x] Adicionar estilos necessários (`.appointment-type`, `.info-note`)
- [x] Mapear email do psicólogo para ID do profissional
- [x] Exibir badge de tipo de usuário no header
- [x] Mensagem informativa sobre demonstração
- [x] Testar com múltiplos emails de psicólogos
- [x] Documentar funcionalidade

---

## 🎓 Conceitos Aprendidos

Esta implementação demonstra:

1. **Renderização Condicional** - Componentes diferentes baseados no estado
2. **Separação de Dados** - Mock isolado por tipo de usuário
3. **Mapeamento de Dados** - Função utilitária para vincular entidades
4. **UI/UX Diferenciada** - Adaptação de interface por papel do usuário
5. **Mock de Dados Realista** - Estrutura próxima ao que seria em produção

---

## 📧 Contato

**Dúvidas sobre esta feature?**
- Desenvolvido para TP5 - MindCare
- Implementação simples e didática
- Focado em demonstração para estudantes

---

**Última atualização:** 01/04/2026  
**Versão:** 1.0 - Implementação Inicial

