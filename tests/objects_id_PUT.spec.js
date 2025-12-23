import { expect } from '@playwright/test'
import { test } from '../fixtures/apiWithAllure'

const exampleUpdateObjectJson = {
  name: 'Updated Apple MacBook Pro 16',
  data: {
    year: 2024,
    price: 2599.99,
    'CPU model': 'Apple M4 Max',
    'Hard disk size': '2 TB'
  }
}

const invalidUpdateObjectJson = {
  data: {
    year: 2024
  }
}

// -------------------- 1. JSON → JSON --------------------
test.describe('/objects/{id} - PUT JSON → JSON', () => {
  let existingObjectId = 'ff4b36a3-83a8-4c28-b1de-6eafafbc7f49' // Placeholder: In a real scenario, this would be fetched dynamically

  test('200 - Object updated successfully', async ({ request, baseURL }) => {
    const requestPayload = exampleUpdateObjectJson

    const response = await request.put(`${baseURL}/objects/${existingObjectId}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      data: requestPayload
    })

    const body = await response.json()
    console.log('200 JSON→JSON Request Payload:', requestPayload)
    console.log('200 JSON→JSON Response Body:', body)
    expect(response.status()).toBe(200)
    expect(body).toHaveProperty('id', existingObjectId)
    expect(body).toHaveProperty('name', exampleUpdateObjectJson.name)
    expect(body).toHaveProperty('data')
    expect(typeof body.data).toBe('object')
    expect(body.data).toHaveProperty('year', exampleUpdateObjectJson.data.year)
    expect(body.data).toHaveProperty('price', exampleUpdateObjectJson.data.price)
    expect(body.data).toHaveProperty('CPU model', exampleUpdateObjectJson.data['CPU model'])
    expect(body.data).toHaveProperty('Hard disk size', exampleUpdateObjectJson.data['Hard disk size'])
  })

  test('404 - Object not found', async ({ request, baseURL }) => {
    const nonExistentObjectId = 'non-existent-id-12345'
    const requestPayload = exampleUpdateObjectJson

    const response = await request.put(`${baseURL}/objects/${nonExistentObjectId}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      data: requestPayload
    })
    console.log('404 JSON→JSON Request Payload:', requestPayload)
    console.log('404 JSON→JSON Response Body:', await response.text())
    expect(response.status()).toBe(404)
  })

  test('400 - Invalid input (missing name)', async ({ request, baseURL }) => {
    const requestPayload = invalidUpdateObjectJson

    const response = await request.put(`${baseURL}/objects/${existingObjectId}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      data: requestPayload
    })
    console.log('400 JSON→JSON Request Payload:', requestPayload)
    console.log('400 JSON→JSON Response Body:', await response.text())
    expect(response.status()).toBe(400) // Assuming 400 for invalid request body, as per common API practices even if not explicitly in spec
  })
})