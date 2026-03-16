# 💙 MindCare - Plataforma de Saúde Mental

**Versão:** 1.4.0 (TP4)
**Status:** ✅ Em desenvolvimento ativo

> Conectando pessoas a cuidados com a saúde mental através de uma plataforma web intuitiva e segura.

---

## 🎯 Sobre o Projeto

O **MindCare** é uma plataforma desenvolvida em React que simplifica o acesso à terapia online, conectando psicólogos a pacientes em um ambiente digital seguro e empático.

### Principais Funcionalidades

- 🔍 **Busca Inteligente** - Encontre profissionais por especialidade, localização e preço
- ⭐ **Favoritos** - Salve seus psicólogos preferidos com gestos intuitivos
- 📅 **Agendamento** - Marque consultas de forma simples e rápida
- 📱 **Mobile-First** - Experiência otimizada para dispositivos móveis
- 🎨 **Design Empático** - Interface que transmite tranquilidade e profissionalismo

---

## 🚀 Quick Start

### Pré-requisitos

- Node.js 18+
- npm 9+

### Instalação

```bash
# Clone o repositório
git clone [URL_DO_REPO]
cd ProjetoDeBloco

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

Acesse: [http://localhost:5173](http://localhost:5173)

### Scripts Disponíveis

```bash
npm run dev          # Inicia servidor de desenvolvimento
npm run build        # Build para produção
npm run preview      # Preview do build
npm test             # Executa testes
npm run test:ui      # Interface visual dos testes
npm run lint         # Verifica código com ESLint
```

---

## 📦 Tecnologias Utilizadas

- **React** 19.2.0 - Biblioteca UI
- **React Router** 7.13.0 - Roteamento
- **Vite** 7.2.4 - Build tool ultra-rápido
- **Vitest** - Testes unitários
- **React Testing Library** - Testes de componentes
- **CSS3** - Estilos com design system próprio

---

## 🏗️ Estrutura do Projeto

```
src/
├── components/        # Componentes reutilizáveis
│   ├── AppShell.jsx
│   ├── BottomNav.jsx
│   ├── Header.jsx
│   ├── ProfessionalCard.jsx
│   └── Badge.jsx
├── pages/             # Páginas da aplicação
│   ├── SearchPage.jsx
│   ├── ProfessionalPage.jsx
│   ├── AppointmentsPage.jsx
│   ├── FavoritesPage.jsx
│   └── AboutPage.jsx
├── data/              # Gerenciamento de dados
│   ├── appointmentsStorage.js
│   └── favoritesStorage.js
├── routes/            # Configuração de rotas
│   └── AppRoutes.jsx
└── styles/            # Estilos CSS
    ├── index.css
    ├── Components.css
    └── SearchPage.css
```

---

## 📱 Funcionalidades Principais

### 1. Busca de Profissionais

- Filtros dinâmicos (especialidade, localização, preço)
- Busca em tempo real
- Cards informativos
- Tratamento de loading/error

### 2. Gestos Mobile

- **Swipe direita** → Adicionar aos favoritos ⭐
- **Swipe esquerda** → Remover dos favoritos ✖️
- Feedback visual durante interação
- Alternativa por botão (desktop)

### 3. Sistema de Agendamentos

- Criar novos agendamentos
- Visualizar agenda
- Cancelar consultas
- Persistência local (localStorage)

### 4. Favoritos

- Salvar profissionais preferidos
- Página dedicada
- Badge com contador
- Sincronização em tempo real

---

## 🧪 Testes

O projeto possui cobertura de testes de ~80%.

```bash
# Executar testes
npm test

# Com interface visual
npm run test:ui

# Cobertura de código
npm run test:coverage
```

**Testes implementados:**
- ✅ Renderização de componentes
- ✅ Filtros de busca
- ✅ Fetch de dados
- ✅ Interações do usuário
- ✅ Estados de loading/error

---

## 📚 Documentação

Documentação técnica completa disponível em `/docs`:

- **[ARQUITETURA.md](./docs/ARQUITETURA.md)** - Estrutura e fluxo de dados
- **[COMPONENTES.md](./docs/COMPONENTES.md)** - Guia de componentes
- **[FUNCIONALIDADES.md](./docs/FUNCIONALIDADES.md)** - User stories e features
- **[EXECUTAR.md](./docs/EXECUTAR.md)** - Instruções detalhadas de setup
- **[BACKLOG.md](./BACKLOG.md)** - Roadmap e próximas features

---

## 👥 Equipe

| Nome | Papel | Responsabilidades |
|------|-------|-------------------|
| **Brice** | Scrum Master | Coordenação, dados dinâmicos, testes |
| **Karina** | Product Owner | Requisitos, navegação, favoritos |
| **Sâmela** | Developer | Gestos mobile, documentação |

---

## 📈 Progresso do Projeto

- ✅ **TP1** - Planejamento e User Stories
- ✅ **TP2** - Single-Page Application
- ✅ **TP3** - Multi-Page + Agendamentos
- ✅ **TP4** - Fetch API + Gestos Mobile + Testes
- ⏳ **TP5** - Autenticação + Backend Real (próximo)

Ver [BACKLOG.md](./BACKLOG.md) para roadmap completo.

---

## 🎨 Design System

### Cores Principais

```css
--primary: #5E81AC    /* Azul sereno */
--secondary: #88C0D0  /* Verde menta */
--success: #A3BE8C    /* Verde aprovado */
--error: #BF616A      /* Vermelho erro */
```

### Breakpoints

- Mobile: 320px - 767px
- Tablet: 768px - 1023px
- Desktop: 1024px+

---

## 🔒 Privacidade

Atualmente, todos os dados são armazenados localmente no navegador do usuário (localStorage). Nenhuma informação é enviada para servidores externos.

**TP5 incluirá:**
- Autenticação segura (Firebase)
- Criptografia de dados sensíveis
- Conformidade com LGPD

---

## 🐛 Reportar Bugs

Encontrou um problema? Abra uma issue ou entre em contato com a equipe.

---

## 📄 Licença

Este projeto é parte do Projeto de Bloco - Desenvolvimento Front-end com Frameworks.

---

## 🌟 Próximos Passos (TP5)

- 🔐 Autenticação Firebase
- 📊 Backend real com Firestore
- 💳 Sistema de pagamentos
- 📧 Notificações push
- 💬 Chat terapeuta-paciente

---

**Desenvolvido com 💙 pela equipe MindCare**

---

## 📸 Screenshots

(Adicionar screenshots após deploy)

---

**Para mais informações, consulte a [documentação completa](./docs/).**
