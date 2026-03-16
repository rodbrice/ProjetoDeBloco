import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import userEvent from '@testing-library/user-event'
import AppointmentsPage from './AppointmentsPage'

function renderWithRouter(component) {
  return render(<BrowserRouter>{component}</BrowserRouter>)
}

describe('AppointmentsPage', () => {
  const mockAppointments = [
    {
      id: '1',
      professionalName: 'Dra. Ana Silva',
      date: '2026-03-20',
      time: '14:00',
      status: 'scheduled',
    },
    {
      id: '2',
      professionalName: 'Dr. Carlos Lima',
      date: '2026-03-15',
      time: '10:00',
      status: 'cancelled',
    },
  ]

  it('deve mostrar mensagem quando não há agendamentos', () => {
    const mockOnCancel = vi.fn()
    
    renderWithRouter(
      <AppointmentsPage appointments={[]} onCancel={mockOnCancel} />
    )

    expect(screen.getByText(/nenhum agendamento ainda/i)).toBeInTheDocument()
  })

  it('deve listar todos os agendamentos', () => {
    const mockOnCancel = vi.fn()
    
    renderWithRouter(
      <AppointmentsPage appointments={mockAppointments} onCancel={mockOnCancel} />
    )

    expect(screen.getByText('Dra. Ana Silva')).toBeInTheDocument()
    expect(screen.getByText('Dr. Carlos Lima')).toBeInTheDocument()
  })

  it('deve mostrar status do agendamento', () => {
    const mockOnCancel = vi.fn()
    
    renderWithRouter(
      <AppointmentsPage appointments={mockAppointments} onCancel={mockOnCancel} />
    )

    expect(screen.getByText('Agendado')).toBeInTheDocument()
    expect(screen.getByText('Cancelado')).toBeInTheDocument()
  })

  it('deve permitir cancelar agendamento ativo', async () => {
    const mockOnCancel = vi.fn()
    const user = userEvent.setup()
    
    renderWithRouter(
      <AppointmentsPage appointments={mockAppointments} onCancel={mockOnCancel} />
    )

    // Deve ter apenas 1 botão de cancelar (para o agendamento ativo)
    const cancelButton = screen.getByRole('button', { 
      name: /cancelar agendamento/i 
    })
    
    await user.click(cancelButton)
    
    // Verifica se a função de cancelar foi chamada com o ID correto
    expect(mockOnCancel).toHaveBeenCalledWith('1')
  })

  it('não deve mostrar botão cancelar para agendamentos já cancelados', () => {
    const mockOnCancel = vi.fn()
    
    const cancelledOnly = [mockAppointments[1]]
    
    renderWithRouter(
      <AppointmentsPage appointments={cancelledOnly} onCancel={mockOnCancel} />
    )

    // Não deve ter botão de cancelar
    expect(
      screen.queryByRole('button', { name: /cancelar agendamento/i })
    ).not.toBeInTheDocument()
  })
})

