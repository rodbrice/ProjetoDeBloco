# 🚀 COMO TESTAR O TP5 - Guia Rápido

## ⚡ Início Rápido

### 1. Iniciar o servidor:
```bash
npm run dev
```

### 2. Abrir no navegador:
```
http://localhost:5173
```

### 3. Testar Login:
- Clique em "Entrar" no menu inferior
- Digite qualquer email (ex: `maria@test.com`)
- Digite qualquer senha (mínimo 6 caracteres)
- Clique "Entrar"

**💡 Dica:** Email com "psi" vira Psicólogo (ex: `psi@test.com`)

### 4. Testar Câmera:
- Clique no avatar no canto superior direito
- Ou clique em "Perfil" no menu inferior
- Clique "📷 Adicionar Foto"
- Tire/selecione uma foto
- Clique "Usar esta foto"

### 5. Testar no Celular:
```bash
# Descubra seu IP:
ipconfig
# Procure IPv4 Address (ex: 192.168.1.100)

# No celular, acesse:
http://192.168.1.100:5173
```

---

## ✅ O que testar

- [ ] Login com qualquer email/senha funciona
- [ ] Após login, avatar aparece no header
- [ ] Menu inferior muda (mostra Perfil ao invés de Entrar)
- [ ] Clicar em Perfil mostra informações do usuário
- [ ] Botão de câmera funciona
- [ ] Foto aparece no perfil após captura
- [ ] Foto aparece no header (avatar)
- [ ] Logout funciona
- [ ] Tentar acessar /favorites sem login → redireciona para /login
- [ ] Login novamente → rotas ficam acessíveis

---

## 📱 Testar Câmera (Importante!)

### No Celular (iOS/Android):
1. Acesse pelo IP local (ex: `http://192.168.1.100:5173`)
2. Faça login
3. Vá em Perfil
4. Clique "📷 Adicionar Foto"
5. **Câmera abre automaticamente!** 📸
6. Tire uma foto
7. Clique "Usar esta foto"
8. Foto aparece no perfil e no header

### No Desktop:
1. Botão abre seletor de arquivo
2. Escolha uma imagem
3. Preview aparece
4. Clique "Usar esta foto"
5. Foto aparece no perfil e header

---

## 🎓 Para Apresentação

### Demonstração ao Professor:

1. **Mostrar Login:**
   - "Aqui temos a tela de login"
   - "Usamos autenticação fake para demonstração"
   - Digite `psi@test.com` e mostre que vira Psicólogo

2. **Mostrar Rotas Protegidas:**
   - "Sem login, não consigo acessar Favoritos"
   - Tenta acessar → redireciona
   - "Após login, todas as rotas ficam acessíveis"

3. **Mostrar Câmera (NO CELULAR!):**
   - "Implementamos captura de foto com câmera"
   - "Usamos HTML5 File API com atributo capture"
   - "Funciona em iOS e Android"
   - Demonstre tirando foto real

4. **Mostrar Avatar:**
   - "A foto aparece no perfil"
   - "E também aparece no header como avatar"
   - "Salva no localStorage como base64"

5. **Explicar Decisões Técnicas:**
   - "Context API para gerenciar estado"
   - "localStorage para persistência"
   - "Input file capture para câmera"
   - "Solução simples mas funcional"

---

## 💬 Respostas para Perguntas Comuns

**P: Por que autenticação fake?**
> R: "Para projeto acadêmico, é suficiente demonstrar os conceitos. O foco é entender como funciona autenticação, proteção de rotas e gerenciamento de estado. Em produção usaríamos Firebase ou backend real."

**P: Por que localStorage?**
> R: "É simples, funcional e não requer servidor. Perfeito para MVP e demonstração de conceitos. Em produção usaríamos banco de dados real."

**P: Como funciona a câmera?**
> R: "Usamos input file com atributo capture='user'. O browser mobile abre a câmera automaticamente. É a solução mais compatível entre iOS e Android."

**P: E as diferenças iOS vs Android?**
> R: "O input file com capture funciona em ambos! Testamos e funciona perfeitamente. É um recurso padrão HTML5 bem suportado."

---

## 🐛 Troubleshooting

### Servidor não inicia:
```bash
npm install
npm run dev
```

### Erro ao fazer login:
- Verifique se digitou email e senha (mínimo 6 caracteres)
- Console do browser (F12) mostra algum erro?

### Câmera não abre no celular:
- Está acessando via IP local? (ex: 192.168.1.100:5173)
- Celular está na mesma rede Wi-Fi?
- Em alguns navegadores, pode abrir seletor de arquivo - escolha "Câmera"

### Foto não aparece:
- Verifique se clicou "Usar esta foto"
- Console do browser mostra erro?
- Tente fazer login novamente

---

## 📚 Documentação Completa

Para mais detalhes, veja:
- `IMPLEMENTACAO_CONCLUIDA.md` - Guia completo de teste e apresentação
- `TP5_VERSAO_SIMPLES.md` - Explicação da implementação
- `USER_STORIES_TP5.md` - Histórias de usuário completas

---

## ✨ Dicas Finais

1. **Teste TUDO antes da apresentação!**
2. **Especialmente a câmera no celular!**
3. **Prepare respostas para perguntas técnicas**
4. **Tenha o código aberto para mostrar**
5. **Demonstre confiança - vocês entendem o código!**

**Boa sorte! 🚀**

