import { describe, it, expect } from 'vitest'

describe('Basic Test Suite', () => {
  it('should run basic test', () => {
    expect(1 + 1).toBe(2)
  })

  it('should verify Vue is available', async () => {
    const { createApp } = await import('vue')
    expect(createApp).toBeDefined()
  })
})
