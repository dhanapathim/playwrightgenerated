import { expect } from '@playwright/test'
import { test } from '../fixtures/apiWithAllure'

const validLoginParams = {
  username: 'testuser',
  password: 'testpassword'
}

const invalidLoginParams = {
  username: 'wronguser',
  password: 'wrongpassword'
}

const errorTriggerParams = {
  username: 'erroruser',
  password: 'errorpassword'
}

// -------------------- /user/login - GET → application/json --------------------
test.describe('/user/login - GET → application/json', () => {
  test('200 - Successful operation', async ({ request, baseURL }) => {
    console.log('200 GET→JSON Request Params:', validLoginParams)
    const response = await request.get(`${baseURL}/user/login`, {
      headers: {
        'Accept': 'application/json'
      },
      params: validLoginParams
    })

    const body = await response.json()
    console.log('200 GET→JSON:', body)
    expect(response.status()).toBe(200)
    expect(body).toContain('logged in user session:')
  })

  test('400 - Invalid username/password supplied', async ({ request, baseURL }) => {
    console.log('400 GET→JSON Request Params:', invalidLoginParams)
    const response = await request.get(`${baseURL}/user/login`, {
      headers: {
        'Accept': 'application/json'
      },
      params: invalidLoginParams
    })
    console.log('400 GET→JSON:', await response.text())
    expect(response.status()).toBe(400)
  })

  test('default - Unexpected error', async ({ request, baseURL }) => {
    console.log('Default GET→JSON Request Params:', errorTriggerParams)
    const response = await request.get(`${baseURL}/user/login`, {
      headers: {
        'Accept': 'application/json',
        'X-Force-Error': 'true'
      },
      params: errorTriggerParams
    })

    const body = await response.json()
    console.log('Default GET→JSON:', body)
    expect([500, 501, 502, 503]).toContain(response.status())
    expect(body).toHaveProperty('code')
    expect(body).toHaveProperty('message')
  })
})

// -------------------- /user/login - GET → application/xml --------------------
test.describe('/user/login - GET → application/xml', () => {
  test('200 - Successful operation', async ({ request, baseURL }) => {
    console.log('200 GET→XML Request Params:', validLoginParams)
    const response = await request.get(`${baseURL}/user/login`, {
      headers: {
        'Accept': 'application/xml'
      },
      params: validLoginParams
    })

    const text = await response.text()
    console.log('200 GET→XML:', text)
    expect(response.status()).toBe(200)
    expect(text).toContain('<string>')
    expect(text).toContain('logged in user session:')
  })

  test('400 - Invalid username/password supplied', async ({ request, baseURL }) => {
    console.log('400 GET→XML Request Params:', invalidLoginParams)
    const response = await request.get(`${baseURL}/user/login`, {
      headers: {
        'Accept': 'application/xml'
      },
      params: invalidLoginParams
    })
    console.log('400 GET→XML:', await response.text())
    expect(response.status()).toBe(400)
  })
})
