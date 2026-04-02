export default function AboutPage() {
  return (
    <div className="stack stack-lg">
      <div className="about-header">
        <h1 className="about-title">Sobre o MindCare</h1>
        <p className="about-subtitle">
          Conectando pessoas a cuidados com a saúde mental
        </p>
      </div>

      <div className="about-section">
        <h2>Nossa Missão</h2>
        <p>
          O MindCare foi criado para simplificar o acesso à terapia online, 
          conectando psicólogos a pacientes em um ambiente seguro e intuitivo. 
          Acreditamos que cuidar da saúde mental deve ser fácil e acessível para todos.
        </p>
      </div>

      <div className="about-section">
        <h2>O que oferecemos</h2>
        <ul className="feature-list">
          <li>🔍 <strong>Busca inteligente</strong> - Encontre profissionais por especialidade, localização e preço</li>
          <li>📅 <strong>Agendamento simples</strong> - Marque suas consultas com poucos cliques</li>
          <li>⭐ <strong>Favoritos</strong> - Salve seus profissionais preferidos</li>
          <li>📱 <strong>Mobile-first</strong> - Acesse de qualquer dispositivo</li>
          <li>🔒 <strong>Privacidade</strong> - Seus dados estão seguros conosco</li>
        </ul>
      </div>

      <div className="about-section">
        <h2>Equipe de Desenvolvimento</h2>
        <div className="team-grid">
          <div className="team-member">
            <div className="team-avatar">👨‍💻</div>
            <div className="team-name">Brice Roduit</div>
            <div className="team-role">Scrum Master & Dev</div>
          </div>
          <div className="team-member">
            <div className="team-avatar">👩‍💻</div>
            <div className="team-name">Karina Freire</div>
            <div className="team-role">Product Owner</div>
          </div>
          <div className="team-member">
            <div className="team-avatar">👩‍💻</div>
            <div className="team-name">Sâmela Magalhães</div>
            <div className="team-role">Developer</div>
          </div>
        </div>
      </div>

      <div className="about-section">
        <h2>Tecnologias Utilizadas</h2>
        <div className="tech-tags">
          <span className="tech-tag">React</span>
          <span className="tech-tag">React Router</span>
          <span className="tech-tag">Vite</span>
          <span className="tech-tag">CSS3</span>
          <span className="tech-tag">LocalStorage API</span>
          <span className="tech-tag">Fetch API</span>
        </div>
      </div>

      <div className="about-footer">
        <p>
          <strong>MindCare</strong> - Projeto de Bloco - Desenvolvimento Front-end com Frameworks
        </p>
        <p className="about-version">Versão 1.5.0 - TP5 (2026)</p>
      </div>
    </div>
  )
}

