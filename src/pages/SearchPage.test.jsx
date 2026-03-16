/* eslint-env node */
/* global global */
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import userEvent from '@testing-library/user-event'
import SearchPage from './SearchPage'

// Mock do fetch global
global.fetch = vi.fn()

function renderWithRouter(component) {
  return render(<BrowserRouter>{component}</BrowserRouter>)
}

describe('SearchPage', () => {
  const mockProfessionals = {
    professionals: [
      {
        id: 'prof-1',
        name: 'Dra. Ana Silva',
        location: 'Centro',
        price: 120,
        specialties: ['Ansiedade', 'TCC'],
      },
      {
        id: 'prof-2',
        name: 'Dr. Carlos Lima',
        location: 'Zona Sul',
        price: 180,
        specialties: ['Depressão'],
      },
    ],
  }

  beforeEach(() => {
    // Reset do mock antes de cada teste
    fetch.mockReset()
  })

  it('deve mostrar loading inicialmente', () => {
    fetch.mockImplementation(() => new Promise(() => {}))
    
    renderWithRouter(<SearchPage />)
    
    expect(screen.getByText(/carregando profissionais/i)).toBeInTheDocument()
  })

  it('deve carregar e exibir profissionais', async () => {
    fetch.mockResolvedValue({
      ok: true,
      json: async () => mockProfessionals,
    })

    renderWithRouter(<SearchPage />)

    // Espera os dados carregarem
    await waitFor(() => {
      expect(screen.getByText('Dra. Ana Silva')).toBeInTheDocument()
    })

    expect(screen.getByText('Dr. Carlos Lima')).toBeInTheDocument()
  })

  it('deve mostrar mensagem de erro quando falha ao carregar', async () => {
    fetch.mockRejectedValue(new Error('Erro de rede'))

    renderWithRouter(<SearchPage />)

    await waitFor(() => {
      expect(screen.getByText(/não conseguimos carregar/i)).toBeInTheDocument()
    })
  })

  it('deve filtrar profissionais por nome/especialidade', async () => {
    fetch.mockResolvedValue({
      ok: true,
      json: async () => mockProfessionals,
    })

    const user = userEvent.setup()
    renderWithRouter(<SearchPage />)

    // Espera carregar
    await waitFor(() => {
      expect(screen.getByText('Dra. Ana Silva')).toBeInTheDocument()
    })

    // Digita no campo de busca
    const searchInput = screen.getByLabelText(/o que você procura/i)
    await user.type(searchInput, 'ansiedade')

    // Deve mostrar apenas a Dra. Ana (que tem Ansiedade)
    expect(screen.getByText('Dra. Ana Silva')).toBeInTheDocument()
    expect(screen.queryByText('Dr. Carlos Lima')).not.toBeInTheDocument()
  })

  it('deve limpar filtros ao clicar em "Limpar filtros"', async () => {
    fetch.mockResolvedValue({
      ok: true,
      json: async () => mockProfessionals,
    })

    const user = userEvent.setup()
    renderWithRouter(<SearchPage />)

    await waitFor(() => {
      expect(screen.getByText('Dra. Ana Silva')).toBeInTheDocument()
    })

    // Preenche os filtros
    const searchInput = screen.getByLabelText(/o que você procura/i)
    await user.type(searchInput, 'teste')

    // Clica em limpar
    const clearButton = screen.getByRole('button', { name: /limpar filtros/i })
    await user.click(clearButton)

    // Verifica se o input foi limpo
    expect(searchInput).toHaveValue('')
  })
})

