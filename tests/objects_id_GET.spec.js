import { expect } from '@playwright/test'
import { test } from '../fixtures/apiWithAllure'

// -------------------- 1. No Request Body → JSON --------------------
test.describe('/objects/{id} - GET → JSON', () => {
  const exampleObjectId = 'ff4b36a3-83a8-4c28-b1de-6eafafbc7f49'
  const nonExistentObjectId = 'non-existent-id-12345'

  test('200 - Object details', async ({ request, baseURL }) => {
    const response = await request.get(`${baseURL}/objects/${exampleObjectId}`, {
      headers: {
        'Accept': 'application/json'
      }
    })

    const body = await response.json()
    console.log(`200 GET→JSON (id: ${exampleObjectId}):`, body)
    expect(response.status()).toBe(200)
    expect(body).toHaveProperty('id', exampleObjectId)
    expect(typeof body.id).toBe('string')
    expect(body).toHaveProperty('name')
    expect(typeof body.name).toBe('string')
    expect(body).toHaveProperty('data')
    expect(typeof body.data).toBe('object')
    if (body.data) {
      expect(body.data).toHaveProperty('year')
      expect(typeof body.data.year).toBe('number')
      expect(body.data).toHaveProperty('price')
      expect(typeof body.data.price).toBe('number')
      expect(body.data).toHaveProperty('CPU model')
      expect(typeof body.data['CPU model']).toBe('string')
      expect(body.data).toHaveProperty('Hard disk size')
      expect(typeof body.data['Hard disk size']).toBe('string')
    }
  })

  test('404 - Object not found', async ({ request, baseURL }) => {
    const response = await request.get(`${baseURL}/objects/${nonExistentObjectId}`, {
      headers: {
        'Accept': 'application/json'
      }
    })

    console.log(`404 GET→JSON (id: ${nonExistentObjectId}):`, await response.text())
    expect(response.status()).toBe(404)
  })
})