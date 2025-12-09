import { expect } from '@playwright/test'
import { test } from '../fixtures/apiWithAllure'

const exampleNewObjectJson = {
  name: 'Apple MacBook Pro 16',
  data: {
    year: 2023,
    price: 2499.99,
    'CPU model': 'Apple M3 Max',
    'Hard disk size': '1 TB'
  }
}

const invalidNewObjectJson = {
  data: {
    year: 2023
  }
}

// -------------------- 1. JSON → JSON --------------------
test.describe('/objects - POST JSON → JSON', () => {
  test('200 - Object created successfully', async ({ request, baseURL }) => {
    const response = await request.post(`${baseURL}/objects`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      data: exampleNewObjectJson
    })

    const body = await response.json()
    console.log('200 JSON→JSON:', body)
    expect(response.status()).toBe(200)
    expect(body).toHaveProperty('id')
    expect(typeof body.id).toBe('string')
    expect(body).toHaveProperty('name', exampleNewObjectJson.name)
    expect(body).toHaveProperty('data')
    expect(body.data).toHaveProperty('year', exampleNewObjectJson.data.year)
    expect(body.data).toHaveProperty('price', exampleNewObjectJson.data.price)
    expect(body.data).toHaveProperty('CPU model', exampleNewObjectJson.data['CPU model'])
    expect(body.data).toHaveProperty('Hard disk size', exampleNewObjectJson.data['Hard disk size'])
  })

  test('400 - Invalid input (missing required name)', async ({ request, baseURL }) => {
    const response = await request.post(`${baseURL}/objects`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      data: invalidNewObjectJson
    })
    console.log('400 JSON→JSON:', await response.text())
    expect(response.status()).toBe(400)
  })
})