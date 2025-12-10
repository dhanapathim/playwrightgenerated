import { expect } from '@playwright/test'
import { test } from '../fixtures/apiWithAllure'

const existingObjectId = 'ff4b36a3-83a8-4c28-b1de-6eafafbc7f49' // Example ID from spec
const nonExistentObjectId = 'non-existent-id-000'

// -------------------- 1. GET → JSON --------------------
test.describe('/objects/{id} - GET → JSON', () => {
  test('200 - Object details', async ({ request, baseURL }) => {
    const objectId = existingObjectId
    const response = await request.get(`${baseURL}/objects/${objectId}`, {
      headers: {
        'Accept': 'application/json',
      }
    })

    const body = await response.json()
    console.log('200 GET→JSON:', body)
    expect(response.status()).toBe(200)
    expect(body).toHaveProperty('id', objectId)
    expect(body).toHaveProperty('name', 'Apple MacBook Pro 16')
    expect(body).toHaveProperty('data')
    expect(typeof body.data).toBe('object')
    expect(body.data).toHaveProperty('year', 2023)
    expect(body.data).toHaveProperty('price', 2499.99)
    expect(body.data).toHaveProperty('CPU model', 'Apple M3 Max')
    expect(body.data).toHaveProperty('Hard disk size', '1 TB')
  })

  test('404 - Object not found', async ({ request, baseURL }) => {
    const objectId = nonExistentObjectId
    const response = await request.get(`${baseURL}/objects/${objectId}`, {
      headers: {
        'Accept': 'application/json',
      }
    })

    console.log('404 GET→JSON:', await response.text())
    expect(response.status()).toBe(404)
  })
})