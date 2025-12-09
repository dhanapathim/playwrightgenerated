import { expect } from '@playwright/test'
import { test } from '../fixtures/apiWithAllure'

// -------------------- 1. GET → JSON --------------------
test.describe('/objects - GET → JSON', () => {
  test('200 - A list of objects', async ({ request, baseURL }) => {
    const response = await request.get(`${baseURL}/objects`, {
      headers: {
        'Accept': 'application/json'
      }
    })

    const body = await response.json()
    console.log('200 GET→JSON:', body)
    expect(response.status()).toBe(200)
    expect(Array.isArray(body)).toBe(true)

    if (body.length > 0) {
      const firstObject = body[0]
      expect(firstObject).toHaveProperty('id')
      expect(typeof firstObject.id).toBe('string')
      expect(firstObject).toHaveProperty('name')
      expect(typeof firstObject.name).toBe('string')
      expect(firstObject).toHaveProperty('data')
      expect(typeof firstObject.data).toBe('object')
      expect(firstObject.data).toHaveProperty('year')
      expect(typeof firstObject.data.year).toBe('number')
      expect(firstObject.data).toHaveProperty('price')
      expect(typeof firstObject.data.price).toBe('number')
      expect(firstObject.data).toHaveProperty('CPU model')
      expect(typeof firstObject.data['CPU model']).toBe('string')
      expect(firstObject.data).toHaveProperty('Hard disk size')
      expect(typeof firstObject.data['Hard disk size']).toBe('string')
    }
  })
})