import { expect } from '@playwright/test'
import { test } from '../fixtures/apiWithAllure'

const exampleNewObjectJson = {
  name: "Apple MacBook Pro 16",
  data: {
    year: 2023,
    price: 2499.99,
    "CPU model": "Apple M3 Max",
    "Hard disk size": "1 TB"
  }
}

const badNewObjectJson = {
  data: {
    year: 2023,
    price: 2499.99
  }
}

// -------------------- 1. JSON → JSON --------------------
test.describe('/objects - POST JSON → JSON', () => {
  test('200 - Object created successfully', async ({ request, baseURL }) => {
    const requestPayload = exampleNewObjectJson
    const response = await request.post(`${baseURL}/objects`, {
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
    expect(body).toHaveProperty('id')
    expect(typeof body.id).toBe('string')
    expect(body).toHaveProperty('name', 'Apple MacBook Pro 16')
    expect(body).toHaveProperty('data')
    expect(body.data).toHaveProperty('year', 2023)
    expect(body.data).toHaveProperty('price', 2499.99)
    expect(body.data).toHaveProperty('CPU model', 'Apple M3 Max')
    expect(body.data).toHaveProperty('Hard disk size', '1 TB')
  })

  test('400 - Invalid input', async ({ request, baseURL }) => {
    const requestPayload = badNewObjectJson
    const response = await request.post(`${baseURL}/objects`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      data: requestPayload
    })

    console.log('Request Payload:', requestPayload)
    console.log('400 JSON→JSON:', await response.text())
    expect(response.status()).toBe(400)
  })
})