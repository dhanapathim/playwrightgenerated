import { expect } from '@playwright/test'
import { test } from '../fixtures/apiWithAllure'

// -------------------- 1. GET → JSON --------------------
test.describe('/objects - GET → JSON', () => {
  test('200 - A list of objects', async ({ request, baseURL }) => {
    const response = await request.get(`${baseURL}/objects`, {
      headers: {
        'Accept': 'application/json',
      }
    })

    const body = await response.json()
    console.log('200 GET→JSON:', body)
    expect(response.status()).toBe(200)
    expect(Array.isArray(body)).toBe(true)
    if (body.length > 0) {
      expect(body[0]).toHaveProperty('id')
      expect(typeof body[0].id).toBe('string')
      expect(body[0]).toHaveProperty('name')
      expect(typeof body[0].name).toBe('string')
      expect(body[0]).toHaveProperty('data')
      expect(typeof body[0].data).toBe('object')
      expect(body[0].data).toHaveProperty('year')
      expect(typeof body[0].data.year).toBe('number')
      expect(body[0].data).toHaveProperty('price')
      expect(typeof body[0].data.price).toBe('number')
      expect(body[0].data).toHaveProperty('CPU model')
      expect(typeof body[0].data['CPU model']).toBe('string')
      expect(body[0].data).toHaveProperty('Hard disk size')
      expect(typeof body[0].data['Hard disk size']).toBe('string')
    }
  })
})