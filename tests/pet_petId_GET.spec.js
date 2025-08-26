import { expect } from '@playwright/test'
import { test } from '../fixtures/apiWithAllure'

const validPetId = 10
const notFoundPetId = 99999
const invalidPetId = 'invalid'
const defaultErrorPetId = 1000000000000000000

// -------------------- 1. GET /pet/{petId} → JSON --------------------
test.describe('/pet/{petId} - GET → JSON', () => {
  test('200 - Successful operation', async ({ request, baseURL }) => {
    const response = await request.get(`${baseURL}/pet/${validPetId}`, {
      headers: {
        'Accept': 'application/json',
      },
    })
    const body = await response.json()
    console.log(`200 GET /pet/${validPetId} JSON:`, body)
    expect(response.status()).toBe(200)
    expect(body).toHaveProperty('id', validPetId)
    expect(body).toHaveProperty('name', 'doggie')
    expect(body).toHaveProperty('photoUrls')
    expect(Array.isArray(body.photoUrls)).toBe(true)
    expect(body).toHaveProperty('status')
    expect(['available', 'pending', 'sold']).toContain(body.status)
  })

  test('400 - Invalid ID supplied', async ({ request, baseURL }) => {
    const response = await request.get(`${baseURL}/pet/${invalidPetId}`, {
      headers: {
        'Accept': 'application/json',
      },
    })
    console.log(`400 GET /pet/${invalidPetId} JSON:`, await response.text())
    expect(response.status()).toBe(400)
  })

  test('404 - Pet not found', async ({ request, baseURL }) => {
    const response = await request.get(`${baseURL}/pet/${notFoundPetId}`, {
      headers: {
        'Accept': 'application/json',
      },
    })
    console.log(`404 GET /pet/${notFoundPetId} JSON:`, await response.text())
    expect(response.status()).toBe(404)
  })

  test('default - Unexpected error', async ({ request, baseURL }) => {
    const response = await request.get(`${baseURL}/pet/${defaultErrorPetId}`, {
      headers: {
        'Accept': 'application/json',
      },
    })
    const body = await response.json()
    console.log(`Default GET /pet/${defaultErrorPetId} JSON:`, body)
    expect([500, 501, 502, 503]).toContain(response.status())
    expect(body).toHaveProperty('code')
    expect(body).toHaveProperty('message')
  })
})

// -------------------- 2. GET /pet/{petId} → XML --------------------
test.describe('/pet/{petId} - GET → XML', () => {
  test('200 - Successful operation', async ({ request, baseURL }) => {
    const response = await request.get(`${baseURL}/pet/${validPetId}`, {
      headers: {
        'Accept': 'application/xml',
      },
    })
    const text = await response.text()
    console.log(`200 GET /pet/${validPetId} XML:`, text)
    expect(response.status()).toBe(200)
    expect(text).toContain('<Pet>')
    expect(text).toContain(`<id>${validPetId}</id>`)
    expect(text).toContain('<name>doggie</name>')
    expect(text).toContain('<photoUrls>')
    expect(text).toContain('<status>')
    expect(text).toMatch(/<status>(available|pending|sold)<\/status>/)
  })

  test('400 - Invalid ID supplied', async ({ request, baseURL }) => {
    const response = await request.get(`${baseURL}/pet/${invalidPetId}`, {
      headers: {
        'Accept': 'application/xml',
      },
    })
    console.log(`400 GET /pet/${invalidPetId} XML:`, await response.text())
    expect(response.status()).toBe(400)
  })

  test('404 - Pet not found', async ({ request, baseURL }) => {
    const response = await request.get(`${baseURL}/pet/${notFoundPetId}`, {
      headers: {
        'Accept': 'application/xml',
      },
    })
    console.log(`404 GET /pet/${notFoundPetId} XML:`, await response.text())
    expect(response.status()).toBe(404)
  })

  test('default - Unexpected error', async ({ request, baseURL }) => {
    const response = await request.get(`${baseURL}/pet/${defaultErrorPetId}`, {
      headers: {
        'Accept': 'application/xml',
      },
    })
    console.log(`Default GET /pet/${defaultErrorPetId} XML:`, await response.text())
    expect([500, 501, 502, 503]).toContain(response.status())
  })
})