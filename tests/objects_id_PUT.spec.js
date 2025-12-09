import { expect } from '@playwright/test'
import { test } from '../fixtures/apiWithAllure'

const existingObjectId = 'ff4b36a3-83a8-4c28-b1de-6eafafbc7f49' // Example ID from spec
const nonExistentObjectId = '00000000-0000-0000-0000-000000000000' // Placeholder for a non-existent ID

const updateObjectJson = {
  name: 'Apple MacBook Pro 16 (Updated)',
  data: {
    year: 2024,
    price: 2599.99,
    'CPU model': 'Apple M3 Pro',
    'Hard disk size': '2 TB'
  }
}

// -------------------- 1. JSON → JSON --------------------
test.describe('/objects/{id} - PUT JSON → JSON', () => {
  test('200 - Object updated successfully', async ({ request, baseURL }) => {
    const response = await request.put(`${baseURL}/objects/${existingObjectId}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      data: updateObjectJson
    })

    const body = await response.json()
    console.log('200 JSON→JSON:', body)
    expect(response.status()).toBe(200)
    expect(body).toHaveProperty('id', existingObjectId)
    expect(body).toHaveProperty('name', updateObjectJson.name)
    expect(body).toHaveProperty('data')
    expect(body.data).toHaveProperty('year', updateObjectJson.data.year)
    expect(body.data).toHaveProperty('price', updateObjectJson.data.price)
    expect(body.data).toHaveProperty('CPU model', updateObjectJson.data['CPU model'])
    expect(body.data).toHaveProperty('Hard disk size', updateObjectJson.data['Hard disk size'])
  })

  test('404 - Object not found', async ({ request, baseURL }) => {
    const response = await request.put(`${baseURL}/objects/${nonExistentObjectId}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      data: updateObjectJson // Valid payload, but non-existent ID
    })
    console.log('404 JSON→JSON:', await response.text())
    expect(response.status()).toBe(404)
  })
})