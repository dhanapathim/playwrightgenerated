import { expect } from '@playwright/test'
import { test } from '../fixtures/apiWithAllure'

const exampleUpdateObjectJson = {
  name: "Updated Apple MacBook Pro 16",
  data: {
    year: 2024,
    price: 2599.99,
    "CPU model": "Apple M4 Pro",
    "Hard disk size": "2 TB"
  }
}

// For a PUT operation, we assume an ID from an existing object or a plausible example.
// In a real testing scenario, this ID would typically come from a prior POST request.
const existingObjectId = 'ff4b36a3-83a8-4c28-b1de-6eafafbc7f49'; // Example ID from spec
const nonExistentObjectId = 'non-existent-id-000';

// -------------------- 1. JSON → JSON --------------------
test.describe('/objects/{id} - PUT JSON → JSON', () => {
  test('200 - Object updated successfully', async ({ request, baseURL }) => {
    const objectId = existingObjectId
    const requestPayload = exampleUpdateObjectJson

    const response = await request.put(`${baseURL}/objects/${objectId}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      data: requestPayload
    })

    const body = await response.json()
    console.log('Request Payload:', requestPayload)
    console.log('200 JSON→JSON:', body)
    expect(response.status()).toBe(200)
    expect(body).toHaveProperty('id', objectId)
    expect(body).toHaveProperty('name', requestPayload.name)
    expect(body).toHaveProperty('data')
    expect(body.data).toHaveProperty('year', requestPayload.data.year)
    expect(body.data).toHaveProperty('price', requestPayload.data.price)
    expect(body.data).toHaveProperty('CPU model', requestPayload.data['CPU model'])
    expect(body.data).toHaveProperty('Hard disk size', requestPayload.data['Hard disk size'])
  })

  test('404 - Object not found', async ({ request, baseURL }) => {
    const objectId = nonExistentObjectId
    const requestPayload = exampleUpdateObjectJson // A valid payload, but for a non-existent ID

    const response = await request.put(`${baseURL}/objects/${objectId}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      data: requestPayload
    })

    console.log('Request Payload:', requestPayload)
    console.log('404 JSON→JSON:', await response.text())
    expect(response.status()).toBe(404)
  })
})