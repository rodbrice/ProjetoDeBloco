import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import ProfessionalCard from './ProfessionalCard'

// Helper para renderizar componentes com Router
function renderWithRouter(component) {
  return render(<BrowserRouter>{component}</BrowserRouter>)
}

describe('ProfessionalCard', () => {
  const mockProfessional = {
    id: 'test-prof',
    name: 'Dr. Teste Silva',
    location: 'Centro',
    price: 150,
    specialties: ['Ansiedade', 'TCC', 'Depressão'],
  }

  it('deve renderizar o nome do profissional', () => {
    renderWithRouter(<ProfessionalCard professional={mockProfessional} />)
    
    // Verifica se o nome aparece na tela
    expect(screen.getByText('Dr. Teste Silva')).toBeInTheDocument()
  })

  it('deve mostrar localização e preço', () => {
    renderWithRouter(<ProfessionalCard professional={mockProfessional} />)
    
    expect(screen.getByText('Centro')).toBeInTheDocument()
    expect(screen.getByText(/R\$ 150/)).toBeInTheDocument()
  })

  it('deve exibir no máximo 3 especialidades', () => {
    renderWithRouter(<ProfessionalCard professional={mockProfessional} />)
    
    // Verifica se as 3 primeiras especialidades estão presentes
    expect(screen.getByText('Ansiedade')).toBeInTheDocument()
    expect(screen.getByText('TCC')).toBeInTheDocument()
    expect(screen.getByText('Depressão')).toBeInTheDocument()
  })

  it('deve ter link para o perfil do profissional', () => {
    renderWithRouter(<ProfessionalCard professional={mockProfessional} />)
    
    const link = screen.getByRole('link', { name: /ver perfil/i })
    expect(link).toHaveAttribute('href', '/professionals/test-prof')
  })

  it('deve ter botão de favoritar', () => {
    renderWithRouter(<ProfessionalCard professional={mockProfessional} />)
    
    const favoriteButton = screen.getByRole('button', { 
      name: /adicionar aos favoritos|remover dos favoritos/i 
    })
    expect(favoriteButton).toBeInTheDocument()
  })
})

