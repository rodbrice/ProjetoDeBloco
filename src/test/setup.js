import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'
import '@testing-library/jest-dom'

// Executa cleanup após cada teste para limpar o DOM
afterEach(() => {
  cleanup()
})

