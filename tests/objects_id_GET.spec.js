import { expect } from '@playwright/test'
import { test } from '../fixtures/apiWithAllure'

const existingObjectId = 'ff4b36a3-83a8-4c28-b1de-6eafafbc7f49' // Example ID from spec
const nonExistentObjectId = '00000000-0000-0000-0000-000000000000' // Placeholder for a non-existent ID

// -------------------- 1. GET → JSON --------------------
test.describe('/objects/{id} - GET → JSON', () => {
  test('200 - Object details', async ({ request, baseURL }) => {
    const response = await request.get(`${baseURL}/objects/${existingObjectId}`, {
      headers: {
        'Accept': 'application/json'
      }
    })

    const body = await response.json()
    console.log('200 GET→JSON:', body)
    expect(response.status()).toBe(200)
    expect(body).toHaveProperty('id', existingObjectId)
    expect(body).toHaveProperty('name')
    expect(typeof body.name).toBe('string')
    expect(body).toHaveProperty('data')
    expect(typeof body.data).toBe('object')
    expect(body.data).toHaveProperty('year')
    expect(typeof body.data.year).toBe('number')
    expect(body.data).toHaveProperty('price')
    expect(typeof body.data.price).toBe('number')
    expect(body.data).toHaveProperty('CPU model')
    expect(typeof body.data['CPU model']).toBe('string')
    expect(body.data).toHaveProperty('Hard disk size')
    expect(typeof body.data['Hard disk size']).toBe('string')
  })

  test('404 - Object not found', async ({ request, baseURL }) => {
    const response = await request.get(`${baseURL}/objects/${nonExistentObjectId}`, {
      headers: {
        'Accept': 'application/json'
      }
    })
    console.log('404 GET→JSON:', await response.text())
    expect(response.status()).toBe(404)
  })
})