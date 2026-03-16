# Como Executar o MindCare

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** versão 18+ ([Download aqui](https://nodejs.org/))
- **npm** (vem junto com Node.js)
- **Git** (opcional, para clonar o repositório)

**Verificar instalação:**
```bash
node --version  # Deve mostrar v18.0.0 ou superior
npm --version   # Deve mostrar 9.0.0 ou superior
```

---

## 🚀 Instalação

### 1. Baixar o Projeto

**Opção A: Via ZIP**
1. Baixe o arquivo `nome_sobrenome_PB_TP4.zip`
2. Extraia para uma pasta de sua escolha
3. Abra o terminal nessa pasta

**Opção B: Via Git (se disponível)**
```bash
git clone [URL_DO_REPOSITORIO]
cd ProjetoDeBloco
```

### 2. Instalar Dependências

```bash
npm install
```

**Aguarde** enquanto o npm baixa todas as bibliotecas necessárias (~2 minutos).

**O que será instalado:**
- React 19.2.0
- React Router Dom 7.13.0
- Vite 7.2.4
- Vitest + Testing Library (dev)
- ESLint (dev)

---

## ▶️ Executar o Projeto

### Modo Desenvolvimento

```bash
npm run dev
```

**O que acontece:**
1. Vite inicia o servidor de desenvolvimento
2. Abre automaticamente em `http://localhost:5173`
3. Hot Module Replacement (HMR) ativado - mudanças refletem instantaneamente

**Console deve mostrar:**
```
VITE v7.2.4  ready in 234 ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
➜  press h + enter to show help
```

**Acesse:** Abra seu navegador em [http://localhost:5173](http://localhost:5173)

---

## 🧪 Executar Testes

### Modo Watch (recomendado durante desenvolvimento)

```bash
npm test
```

Testes executam automaticamente quando você salva um arquivo.

### Executar uma vez

```bash
npm test -- --run
```

### Interface Visual dos Testes

```bash
npm run test:ui
```

Abre uma interface web bonita para ver os testes.

### Relatório de Cobertura

```bash
npm run test:coverage
```

Gera relatório mostrando % de código testado.

---

## 📦 Build para Produção

```bash
npm run build
```

**O que acontece:**
1. Vite otimiza o código
2. Minifica JS e CSS
3. Gera arquivos na pasta `/dist`

**Para testar o build localmente:**
```bash
npm run preview
```

Abre o site em `http://localhost:4173` simulando produção.

---

## 🗂️ Estrutura do Projeto

```
ProjetoDeBloco/
├── public/                      # Arquivos públicos
│   └── professionals.json       # ⚠️ IMPORTANTE: Dados dos profissionais
├── src/
│   ├── components/              # Componentes reutilizáveis
│   ├── pages/                   # Páginas da aplicação
│   ├── routes/                  # Configuração de rotas
│   ├── data/                    # Gerenciamento de dados (localStorage)
│   ├── styles/                  # Arquivos CSS
│   ├── test/                    # Setup de testes
│   ├── App.jsx                  # Componente raiz
│   └── main.jsx                 # Entry point
├── docs/                        # 📚 Documentação técnica
│   ├── ARQUITETURA.md
│   ├── COMPONENTES.md
│   ├── FUNCIONALIDADES.md
│   └── EXECUTAR.md (este arquivo)
├── package.json                 # Dependências
├── vite.config.js               # Configuração do Vite
├── vitest.config.js             # Configuração dos testes
└── README.md                    # Leia-me básico
```

---

## 🔧 Scripts Disponíveis

| Script | Comando | Descrição |
|--------|---------|-----------|
| **Desenvolvimento** | `npm run dev` | Inicia servidor local com HMR |
| **Build** | `npm run build` | Compila para produção |
| **Preview** | `npm run preview` | Testa build de produção |
| **Lint** | `npm run lint` | Verifica erros de código (ESLint) |
| **Testes** | `npm test` | Executa testes em modo watch |
| **Testes UI** | `npm run test:ui` | Interface visual dos testes |
| **Cobertura** | `npm run test:coverage` | Relatório de cobertura |

---

## 🌐 Acessar as Páginas

Após rodar `npm run dev`, navegue para:

| Página | URL | Descrição |
|--------|-----|-----------|
| **Home** | `/` | Busca de profissionais |
| **Favoritos** | `/favorites` | Profissionais salvos |
| **Agendamentos** | `/appointments` | Minhas consultas |
| **Sobre** | `/about` | Info do MindCare |
| **Perfil Profissional** | `/professionals/ana-souza` | Detalhes (exemplo) |
| **Novo Agendamento** | `/appointments/new?professionalId=ana-souza` | Formulário |

---

## 🐛 Solução de Problemas

### Erro: "Cannot find module"

**Problema:** Dependências não instaladas.

**Solução:**
```bash
rm -rf node_modules package-lock.json
npm install
```

### Erro: "Port 5173 already in use"

**Problema:** Porta já está sendo usada.

**Solução:**
```bash
# Windows
netstat -ano | findstr :5173
taskkill /PID [NUMERO_DO_PID] /F

# Mac/Linux
lsof -ti:5173 | xargs kill -9
```

Ou especifique outra porta:
```bash
npm run dev -- --port 3000
```

### Página em Branco

**Problema:** JavaScript não carregou.

**Verificar:**
1. Console do navegador (F12) tem erros?
2. Arquivo `professionals.json` existe em `/public`?
3. Terminal mostra erros?

**Solução:**
```bash
# Limpa cache e reinicia
rm -rf .vite
npm run dev
```

### Testes Falhando

**Problema:** Ambiente de teste não configurado.

**Solução:**
```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom vitest jsdom
```

Certifique-se que `vitest.config.js` existe na raiz.

---

## 📱 Testar em Dispositivo Mobile

### Opção 1: Chrome DevTools

1. Abra o site em `http://localhost:5173`
2. Pressione `F12` para abrir DevTools
3. Clique no ícone de celular (Ctrl+Shift+M)
4. Escolha dispositivo (iPhone 12, Galaxy S21, etc.)

### Opção 2: Dispositivo Físico (mesma rede Wi-Fi)

1. Descubra seu IP local:
   ```bash
   # Windows
   ipconfig
   
   # Mac/Linux
   ifconfig
   ```

2. Inicie o servidor expondo o host:
   ```bash
   npm run dev -- --host
   ```

3. No celular, acesse:
   ```
   http://[SEU_IP]:5173
   ```
   Exemplo: `http://192.168.1.100:5173`

**⚠️ Importante:** Celular e computador devem estar na **mesma rede Wi-Fi**.

---

## 🎯 Funcionalidades para Testar

### 1. Busca de Profissionais
- [ ] Filtrar por nome/especialidade
- [ ] Filtrar por região
- [ ] Filtrar por preço máximo
- [ ] Limpar filtros

### 2. Gestos Mobile (use celular ou DevTools)
- [ ] Swipe direita para favoritar
- [ ] Swipe esquerda para desfavoritar
- [ ] Ver feedback visual durante swipe
- [ ] Verificar toast de confirmação

### 3. Favoritos
- [ ] Adicionar profissional aos favoritos
- [ ] Ver contador no menu inferior
- [ ] Abrir página de favoritos
- [ ] Remover da lista

### 4. Agendamentos
- [ ] Criar novo agendamento
- [ ] Ver lista de agendamentos
- [ ] Cancelar agendamento ativo
- [ ] Ver status (Agendado/Cancelado)

### 5. Navegação
- [ ] Usar menu inferior (mobile)
- [ ] Indicador de página ativa
- [ ] Todas as 4 seções acessíveis
- [ ] Links funcionando

### 6. Tratamento de Erros
Para testar, renomeie temporariamente `professionals.json`:
- [ ] Ver loading spinner
- [ ] Ver mensagem de erro
- [ ] Clicar "Tentar novamente"

---

## 💾 Dados Persistentes

**Os dados são salvos no navegador (localStorage).**

### Ver dados salvos:

1. Abra DevTools (F12)
2. Vá para **Application** > **Local Storage**
3. Procure por:
   - `mindcare.appointments.v1`
   - `mindcare.favorites.v1`

### Limpar dados:

**Navegador:**
```javascript
// Cole no Console do DevTools
localStorage.clear()
location.reload()
```

**Ou manualmente:**
1. DevTools > Application > Local Storage
2. Right-click > Clear

---

## 📊 Performance

### Métricas Esperadas (localhost):

- **First Paint:** < 200ms
- **Time to Interactive:** < 500ms
- **Bundle Size:** ~150KB (gzipped)

### Auditar Performance:

1. DevTools > Lighthouse
2. Clique "Generate report"
3. Verifique scores:
   - Performance: 90+
   - Accessibility: 85+
   - Best Practices: 90+

---

## 🆘 Precisa de Ajuda?

### Documentação Adicional

- **Arquitetura:** Leia `docs/ARQUITETURA.md`
- **Componentes:** Leia `docs/COMPONENTES.md`
- **Funcionalidades:** Leia `docs/FUNCIONALIDADES.md`

### Contato da Equipe

- **Brice** (Scrum Master) - [email]
- **Karina** (Product Owner) - [email]
- **Sâmela** (Developer) - [email]

### Links Úteis

- [React Docs](https://react.dev/)
- [Vite Docs](https://vitejs.dev/)
- [React Router Docs](https://reactrouter.com/)
- [Vitest Docs](https://vitest.dev/)

---

## ✅ Checklist de Entrega

Antes de entregar o TP4, verifique:

- [ ] `npm install` executa sem erros
- [ ] `npm run dev` inicia o servidor
- [ ] `npm test` passa todos os testes
- [ ] `npm run build` gera build de produção
- [ ] Todas as rotas funcionam
- [ ] Gestos mobile funcionam (testar em celular)
- [ ] Favoritos persistem após reload
- [ ] Agendamentos persistem após reload
- [ ] Fetch API carrega dados corretamente
- [ ] Documentação completa em `/docs`
- [ ] BACKLOG.md criado
- [ ] README.md atualizado

---

**🎉 Pronto! Agora você pode explorar o MindCare.**

Se encontrar problemas, revise esta documentação ou consulte a equipe.

**Bom uso! 💙**

