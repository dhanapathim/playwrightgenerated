import { expect } from '@playwright/test'
import { test } from '../fixtures/apiWithAllure'

const validLoginParams = {
  username: 'testuser',
  password: 'password123'
}

const invalidLoginParams = {
  username: 'invaliduser',
  password: 'wrongpassword'
}

// -------------------- 1. GET /user/login → application/json --------------------
test.describe('/user/login - GET → application/json', () => {
  test('200 - Successful operation', async ({ request, baseURL }) => {
    const response = await request.get(`${baseURL}/user/login`, {
      headers: {
        'Accept': 'application/json'
      },
      params: validLoginParams
    })
    const body = await response.json()
    console.log('200 GET application/json:', body)
    expect(response.status()).toBe(200)
    expect(typeof body).toBe('string')
    expect(body).toContain('logged in user session:')
  })

  test('400 - Invalid username/password supplied', async ({ request, baseURL }) => {
    const response = await request.get(`${baseURL}/user/login`, {
      headers: {
        'Accept': 'application/json'
      },
      params: invalidLoginParams
    })
    console.log('400 GET application/json:', await response.text())
    expect(response.status()).toBe(400)
  })

  test('default - Unexpected error', async ({ request, baseURL }) => {
    const response = await request.get(`${baseURL}/user/login`, {
      headers: {
        'Accept': 'application/json'
      },
      params: validLoginParams
    })
    const body = await response.json()
    console.log('Default GET application/json:', body)
    expect([500, 501, 502, 503]).toContain(response.status())
    expect(body).toHaveProperty('code')
    expect(typeof body.code).toBe('string')
    expect(body).toHaveProperty('message')
    expect(typeof body.message).toBe('string')
  })
})

// -------------------- 2. GET /user/login → application/xml --------------------
test.describe('/user/login - GET → application/xml', () => {
  test('200 - Successful operation', async ({ request, baseURL }) => {
    const response = await request.get(`${baseURL}/user/login`, {
      headers: {
        'Accept': 'application/xml'
      },
      params: validLoginParams
    })
    const text = await response.text()
    console.log('200 GET application/xml:', text)
    expect(response.status()).toBe(200)
    expect(typeof text).toBe('string')
    expect(text).toContain('<string>')
    expect(text).toContain('logged in user session:')
  })

  test('400 - Invalid username/password supplied', async ({ request, baseURL }) => {
    const response = await request.get(`${baseURL}/user/login`, {
      headers: {
        'Accept': 'application/xml'
      },
      params: invalidLoginParams
    })
    console.log('400 GET application/xml:', await response.text())
    expect(response.status()).toBe(400)
  })

  test('default - Unexpected error', async ({ request, baseURL }) => {
    const response = await request.get(`${baseURL}/user/login`, {
      headers: {
        'Accept': 'application/xml'
      },
      params: validLoginParams
    })
    console.log('Default GET application/xml:', await response.text())
    expect([500, 501, 502, 503]).toContain(response.status())
  })
})