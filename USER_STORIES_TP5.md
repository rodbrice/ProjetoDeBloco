# 📖 HISTÓRIAS DE USUÁRIO - TP5

**Projeto:** MindCare  
**Data:** 31/03/2026  
**Versão:** 2.0.0 (TP5)

---

## 📝 MUDANÇAS EM RELAÇÃO AO TP4

### Feedback do Professor:
1. ✅ **Sistema de autenticação** para acesso às páginas internas
2. ✅ **Uso de recurso do celular** (Câmera) dentro do aplicativo
3. ✅ **Diferenças entre iOS e Android** devem ser tratadas

### Modificações nas Histórias Existentes:

- **História #1-#6:** Agora requerem autenticação para funcionalidades críticas
- **Nova separação:** Funcionalidades públicas vs privadas
- **Perfis diferenciados:** Paciente vs Psicólogo com permissões distintas

---

## 🆕 NOVAS HISTÓRIAS DE USUÁRIO (TP5)

### ✨ História #7: Sistema de Autenticação

**Como** um novo usuário do MindCare,  
**Eu quero** criar uma conta e fazer login de forma segura,  
**Para que** eu possa acessar as funcionalidades personalizadas da plataforma.

**Critérios de Aceitação:**
- [ ] Usuário pode criar conta com email e senha
- [ ] Usuário pode fazer login com email e senha
- [ ] Usuário pode fazer login com Google (OAuth)
- [ ] Usuário pode recuperar senha esquecida
- [ ] Senha deve ter no mínimo 6 caracteres
- [ ] Email deve ser válido e único
- [ ] Sessão persiste após fechar e abrir app
- [ ] Usuário pode fazer logout
- [ ] Mensagens de erro claras (email já existe, senha incorreta, etc)
- [ ] Loading state durante autenticação

**Implementação Técnica:**
- **Firebase Authentication** (email/senha + Google OAuth)
- **AuthContext** para estado global de autenticação
- **Páginas:** `LoginPage.jsx`, `RegisterPage.jsx`, `ForgotPasswordPage.jsx`
- **Hook customizado:** `useAuth()` para acessar contexto
- **Componente:** `PrivateRoute.jsx` para proteger rotas

**Prioridade:** 🔴 Crítica (P0 - Bloqueante para outras features)

---

### 👥 História #8: Perfis Diferenciados (Paciente vs Psicólogo)

**Como** usuário do MindCare,  
**Eu quero** escolher meu tipo de perfil ao me cadastrar,  
**Para que** eu tenha acesso às funcionalidades apropriadas para meu papel.

**Cenário 1: Paciente**
- **Pode:** Buscar psicólogos, favoritar, agendar consultas, ver histórico
- **Não pode:** Gerenciar agenda de outros, aceitar/rejeitar agendamentos
- **Dashboard:** Lista de próximas consultas, psicólogos favoritados

**Cenário 2: Psicólogo**
- **Pode:** Gerenciar agenda, aceitar/rejeitar solicitações, ver histórico de pacientes
- **Não pode:** Agendar consulta com outros psicólogos (conflito de interesse)
- **Dashboard:** Agenda do dia, solicitações pendentes, estatísticas

**Critérios de Aceitação:**
- [ ] No registro, usuário escolhe: "Sou Paciente" ou "Sou Psicólogo"
- [ ] Psicólogos devem enviar documentação (CRP, RG) para verificação
- [ ] Interface adapta baseada no tipo de perfil
- [ ] Rotas específicas por perfil (/patient/dashboard, /psychologist/dashboard)
- [ ] Badge visual indicando tipo de perfil no header
- [ ] Psicólogos têm campos extras (CRP, especialidades, bio, preço)

**Implementação Técnica:**
- **Firestore Collections:**
  - `users` (comum): uid, email, displayName, photoURL, userType
  - `patients`: userId, preferences, medicalHistory
  - `psychologists`: userId, crp, specialties, bio, price, verified
- **Componentes:** `ProfileSelector.jsx`, `PatientDashboard.jsx`, `PsychologistDashboard.jsx`
- **Guards:** `PatientRoute.jsx`, `PsychologistRoute.jsx`

**Prioridade:** 🔴 Alta (P1 - Necessário após autenticação)

---

### 📸 História #9: Foto de Perfil com Câmera

**Como** usuário autenticado,  
**Eu quero** tirar uma foto com a câmera do celular para usar como foto de perfil,  
**Para que** eu personalize minha conta de forma rápida e fácil.

**Critérios de Aceitação:**
- [ ] Botão "Tirar Foto" na página de perfil
- [ ] Ao clicar, abre câmera do dispositivo
- [ ] Usuário pode tirar foto e revisar antes de salvar
- [ ] Opção de "Usar foto existente" (galeria)
- [ ] Preview da foto antes de enviar
- [ ] Foto é redimensionada para 400x400px (otimização)
- [ ] Foto é salva no Firebase Storage
- [ ] URL da foto é atualizada no perfil do usuário
- [ ] Funciona em iOS e Android com fallbacks apropriados
- [ ] Mensagem de erro se câmera não disponível

**Diferenças Plataforma:**

**📱 iOS (Safari/Chrome iOS):**
- Usar `<input type="file" accept="image/*" capture="user">` (frontal) ou `capture="environment"` (traseira)
- `getUserMedia` tem suporte limitado em Safari iOS < 14.3
- Requer HTTPS mesmo em localhost (usar ngrok ou servir via HTTPS local)

**🤖 Android (Chrome Android):**
- `getUserMedia` funciona bem no Chrome Android 53+
- `<input type="file" capture="camera">` como fallback
- Permissões são solicitadas automaticamente pelo browser

**Desktop:**
- `getUserMedia` funciona em Chrome/Firefox
- Fallback para upload de arquivo se webcam não disponível

**Implementação Técnica:**
- **Componente:** `CameraCapture.jsx` (reutilizável)
- **Utilitário:** `cameraUtils.js` (detecção de plataforma, fallbacks)
- **API:** Navigator.mediaDevices.getUserMedia() (primário)
- **Fallback:** `<input type="file" accept="image/*" capture>` (iOS)
- **Storage:** Firebase Storage (`/profile-photos/{userId}.jpg`)
- **Resize:** Canvas API para redimensionar antes de upload

**Prioridade:** 🟠 Média-Alta (P2 - Feature diferenciadora)

---

### 📄 História #10: Upload de Documentos (Psicólogos)

**Como** psicólogo cadastrando na plataforma,  
**Eu quero** enviar fotos do meu CRP e RG usando a câmera,  
**Para que** minha conta seja verificada e eu possa atender pacientes.

**Critérios de Aceitação:**
- [ ] Fluxo de verificação após registro como psicólogo
- [ ] Solicita foto do CRP (frente)
- [ ] Solicita foto do RG (frente e verso)
- [ ] Pode usar câmera ou selecionar arquivo
- [ ] Preview de cada documento antes de enviar
- [ ] Validação de qualidade (tamanho mínimo, formato aceito)
- [ ] Documentos são enviados para Firebase Storage
- [ ] Admin pode revisar e aprovar/rejeitar
- [ ] Status de verificação visível no perfil ("Pendente", "Aprovado", "Rejeitado")
- [ ] Notificação quando verificação for concluída

**Workflow:**
1. Psicólogo se registra
2. É redirecionado para upload de documentos
3. Tira/seleciona foto do CRP
4. Tira/seleciona foto do RG (frente e verso)
5. Submete para análise
6. Admin recebe notificação
7. Admin aprova/rejeita
8. Psicólogo recebe notificação do resultado

**Implementação Técnica:**
- **Página:** `DocumentUploadPage.jsx`
- **Componente:** `DocumentCapture.jsx` (reutiliza `CameraCapture.jsx`)
- **Storage:** Firebase Storage (`/documents/{userId}/crp.jpg`, `/documents/{userId}/rg_front.jpg`)
- **Firestore:** `psychologists/{userId}/verificationStatus` = "pending" | "approved" | "rejected"
- **Admin Panel:** `AdminVerificationPage.jsx` (futuro)

**Prioridade:** 🟡 Média (P3 - Necessário para psicólogos, mas não bloqueante)

---

## 📋 HISTÓRIAS EXISTENTES MODIFICADAS

### ✏️ História #1: Busca de Psicólogos (MODIFICADA)

**Mudanças:**
- ✅ **Antes:** Pública, qualquer um pode buscar
- 🔐 **Agora:** Requer autenticação para ver detalhes completos
- **Não autenticado:** Vê lista limitada (3 profissionais, sem contato)
- **Autenticado:** Vê lista completa, pode favoritar e agendar

**Critérios Adicionais:**
- [ ] Botão "Entrar para ver mais" se não autenticado
- [ ] Filtros completos apenas para autenticados
- [ ] Preview limitado de perfis sem autenticação

---

### ✏️ História #2: Gestos Mobile (SEM MUDANÇAS)

**Status:** ✅ Mantém implementação atual
- Swipe para favoritar continua funcionando
- Apenas requer autenticação para salvar favoritos

---

### ✏️ História #3: Gestão de Agenda (MODIFICADA)

**Mudanças:**
- 🔐 **Agora:** Apenas psicólogos autenticados acessam
- **Novo:** Pacientes veem "Minhas Consultas" (visão diferente)
- **Novo:** Psicólogos podem aceitar/rejeitar solicitações

**Critérios Adicionais:**
- [ ] Rota protegida: `/psychologist/appointments`
- [ ] Permissão verificada (userType === 'psychologist')
- [ ] Sincronização em tempo real via Firestore

---

### ✏️ História #4: Novo Agendamento (MODIFICADA)

**Mudanças:**
- 🔐 **Agora:** Apenas pacientes autenticados podem agendar
- **Novo:** Agendamento vai para status "pending" (requer aprovação do psicólogo)
- **Novo:** Notificação para psicólogo quando nova solicitação

**Critérios Adicionais:**
- [ ] Rota protegida: `/appointments/new`
- [ ] Permissão verificada (userType === 'patient')
- [ ] Status inicial: "pending_approval"
- [ ] Psicólogo recebe notificação

---

### ✏️ História #5: Favoritos (MODIFICADA)

**Mudanças:**
- 🔐 **Agora:** Requer autenticação
- **Migração:** localStorage → Firestore
- **Novo:** Sincroniza entre dispositivos

**Critérios Adicionais:**
- [ ] Rota protegida: `/favorites`
- [ ] Favoritos salvos em Firestore: `users/{userId}/favorites`
- [ ] Sincronização em tempo real

---

### ✏️ História #6: Navegação (MODIFICADA)

**Mudanças:**
- **Novo:** BottomNav adapta baseado em autenticação
- **Não autenticado:** 3 itens (Buscar, Sobre, Entrar)
- **Autenticado (Paciente):** 5 itens (Buscar, Favoritos, Consultas, Perfil, Sair)
- **Autenticado (Psicólogo):** 5 itens (Buscar, Agenda, Pacientes, Perfil, Sair)

**Critérios Adicionais:**
- [ ] Badge de avatar no item "Perfil" (foto do usuário)
- [ ] Indicador visual diferente por tipo de perfil
- [ ] Logout acessível facilmente

---

## 🎯 NOVAS HISTÓRIAS FUTURAS (Backlog)

### História #11: Notificações Push (Futuro)
**Como** usuário, **quero** receber notificações de novas mensagens/agendamentos, **para que** eu não perca informações importantes.

### História #12: Chat Paciente-Psicólogo (Futuro)
**Como** paciente, **quero** enviar mensagem ao meu psicólogo entre sessões, **para que** eu esclareça dúvidas urgentes.

### História #13: Videoconferência (Futuro)
**Como** usuário, **quero** realizar consultas por vídeo na plataforma, **para que** eu não precise usar apps externos.

### História #14: App Mobile Nativo (Futuro)
**Como** usuário mobile, **quero** instalar o app pela App Store/Play Store, **para que** eu tenha experiência nativa.

---

## 📊 MATRIZ DE PRIORIDADES TP5

| História | Prioridade | Esforço | Valor | Ordem |
|----------|-----------|---------|-------|-------|
| #7 - Autenticação | 🔴 Crítica | 16h | Alto | 1 |
| #8 - Perfis Diferenciados | 🔴 Alta | 12h | Alto | 2 |
| #9 - Foto de Perfil (Câmera) | 🟠 Média-Alta | 8h | Médio | 3 |
| #10 - Upload Documentos | 🟡 Média | 6h | Médio | 4 |
| #1-#6 - Adaptações | 🟡 Média | 8h | Alto | 5 |

**Total Estimado:** ~50 horas de desenvolvimento

---

## ✅ CRITÉRIOS DE ACEITAÇÃO GLOBAIS (TP5)

Todos os itens abaixo devem ser atendidos para considerar TP5 completo:

### Autenticação
- [ ] Sistema de login/registro funcional
- [ ] Proteção de rotas implementada
- [ ] Persistência de sessão funcionando
- [ ] Logout limpa dados corretamente

### Perfis
- [ ] Paciente e Psicólogo têm interfaces diferentes
- [ ] Permissões por tipo de usuário funcionam
- [ ] Dados específicos de cada perfil salvos corretamente

### Câmera
- [ ] Captura de foto funciona em iOS e Android
- [ ] Fallbacks implementados para browsers sem suporte
- [ ] Upload de foto de perfil funcional
- [ ] Upload de documentos funcional

### Mobile
- [ ] App funciona em iOS (Safari)
- [ ] App funciona em Android (Chrome)
- [ ] Diferenças de plataforma tratadas
- [ ] PWA instalável (manifest.json)

### Qualidade
- [ ] Testes de autenticação (mock Firebase)
- [ ] Testes de upload (mock Storage)
- [ ] Testes de permissões
- [ ] Cobertura ≥ 85%

### Documentação
- [ ] README atualizado com setup Firebase
- [ ] Guia de implementação completo
- [ ] Skills de autenticação e câmera criadas
- [ ] Diferenças iOS/Android documentadas

---

## 📱 CONSIDERAÇÕES MOBILE (iOS vs Android)

### Camera API

**iOS (Safari):**
```javascript
// Fallback obrigatório
<input type="file" accept="image/*" capture="user" />
```
- `getUserMedia` limitado em Safari < 14.3
- Requer HTTPS (mesmo localhost)
- Permissão solicitada automaticamente

**Android (Chrome):**
```javascript
// Funciona bem
navigator.mediaDevices.getUserMedia({ video: true })
```
- Suporte completo desde Chrome 53+
- Fallback também recomendado

### Detecção de Plataforma
```javascript
const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
const isAndroid = /Android/.test(navigator.userAgent)
const isMobile = isIOS || isAndroid
```

### Storage e Performance
- **iOS:** Limite de 50MB para localStorage (usar Firestore)
- **Android:** Limite de 100MB para localStorage
- **Ambos:** Compressão de imagens obrigatória antes de upload

---

## 🎓 APRENDIZADOS PARA APRESENTAÇÃO

Cada membro deve saber explicar:

1. **Autenticação:** Como implementamos, por que Firebase, fluxo de login
2. **Context API:** Como gerenciamos estado global de auth
3. **Câmera:** Diferenças iOS/Android, fallbacks, desafios
4. **Permissões:** Como diferenciamos Paciente vs Psicólogo
5. **Firebase:** Authentication, Firestore, Storage - quando usar cada um

---

**Criado em:** 31/03/2026  
**Para TP5 - Entrega Final:** Maio 2026  
**Status:** 📋 Pronto para desenvolvimento

