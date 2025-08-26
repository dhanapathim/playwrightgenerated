import { expect } from '@playwright/test'
import { test } from '../fixtures/apiWithAllure'


const exampleUserJson = {
  id: 10,
  username: 'theUser',
  firstName: 'John',
  lastName: 'James',
  email: 'john@email.com',
  password: '12345',
  phone: '12345',
  userStatus: 1
}

const exampleUserXml = `<?xml version="1.0" encoding="UTF-8"?>
<User>
  <id>10</id>
  <username>theUser</username>
  <firstName>John</firstName>
  <lastName>James</lastName>
  <email>john@email.com</email>
  <password>12345</password>
  <phone>12345</phone>
  <userStatus>1</userStatus>
</User>`

const formUrlEncodedUser = new URLSearchParams({
  id: '10',
  username: 'theUser',
  firstName: 'John',
  lastName: 'James',
  email: 'john@email.com',
  password: '12345',
  phone: '12345',
  userStatus: '1'
})

const badUserJson = { wrong: 'data' }
const invalidUserJson = { username: '', email: 'invalid-email' }
const badUserXml = `<invalid><data/></invalid>`
const invalidUserXml = `<User><username></username><email>invalid-email</email></User>`
const badFormUser = new URLSearchParams({ wrong: 'data' })
const invalidFormUser = new URLSearchParams({ username: '', email: 'invalid-email' })

const defaultErrorStatusCodes = [500, 501, 502, 503]

// -------------------- 1. JSON (Request) → JSON (Response) --------------------
test.describe('/user - POST JSON → JSON', () => {
  test('200 - successful operation', async ({ request, baseURL }) => {
    const requestPayload = exampleUserJson
    const response = await request.post(`${baseURL}/user`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      data: requestPayload
    })

    const body = await response.json()
    console.log('200 JSON→JSON Request Payload:', requestPayload)
    console.log('200 JSON→JSON Response Body:', body)
    expect(response.status()).toBe(200)
    expect(body).toHaveProperty('id')
    expect(body).toHaveProperty('username', 'theUser')
    expect(body).toHaveProperty('firstName', 'John')
    expect(body).toHaveProperty('lastName', 'James')
    expect(body).toHaveProperty('email', 'john@email.com')
    expect(body).toHaveProperty('password', '12345')
    expect(body).toHaveProperty('phone', '12345')
    expect(body).toHaveProperty('userStatus', 1)
  })

  test('400 - Invalid input (JSON)', async ({ request, baseURL }) => {
    const requestPayload = badUserJson
    const response = await request.post(`${baseURL}/user`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      data: requestPayload
    })
    console.log('400 JSON→JSON Request Payload:', requestPayload)
    console.log('400 JSON→JSON Response Body:', await response.text())
    expect(response.status()).toBeGreaterThanOrEqual(400)
  })

  test('422 - Validation exception (JSON)', async ({ request, baseURL }) => {
    const requestPayload = invalidUserJson
    const response = await request.post(`${baseURL}/user`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      data: requestPayload
    })
    console.log('422 JSON→JSON Request Payload:', requestPayload)
    console.log('422 JSON→JSON Response Body:', await response.text())
    expect(response.status()).toBeGreaterThanOrEqual(422)
  })

  test('default - Unexpected error (JSON)', async ({ request, baseURL }) => {
    const requestPayload = exampleUserJson
    const response = await request.post(`${baseURL}/user`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-Force-Error': 'true'
      },
      data: requestPayload
    })

    const body = await response.json()
    console.log('Default JSON→JSON Request Payload:', requestPayload)
    console.log('Default JSON→JSON Response Body:', body)
    expect(defaultErrorStatusCodes).toContain(response.status())
    expect(body).toHaveProperty('code')
    expect(body).toHaveProperty('message')
  })
})

// -------------------- 2. JSON (Request) → XML (Response) --------------------
test.describe('/user - POST JSON → XML', () => {
  test('200 - successful operation', async ({ request, baseURL }) => {
    const requestPayload = exampleUserJson
    const response = await request.post(`${baseURL}/user`, {
      headers: {
        'Accept': 'application/xml',
        'Content-Type': 'application/json',
      },
      data: requestPayload
    })

    const text = await response.text()
    console.log('200 JSON→XML Request Payload:', requestPayload)
    console.log('200 JSON→XML Response Body:', text)
    expect(response.status()).toBe(200)
    expect(text).toContain('<User>')
    expect(text).toContain('<username>theUser</username>')
    expect(text).toContain('<firstName>John</firstName>')
    expect(text).toContain('<lastName>James</lastName>')
    expect(text).toContain('<email>john@email.com</email>')
    expect(text).toContain('<password>12345</password>')
    expect(text).toContain('<phone>12345</phone>')
    expect(text).toContain('<userStatus>1</userStatus>')
  })

  test('400 - Invalid input (JSON)', async ({ request, baseURL }) => {
    const requestPayload = badUserJson
    const response = await request.post(`${baseURL}/user`, {
      headers: {
        'Accept': 'application/xml',
        'Content-Type': 'application/json',
      },
      data: requestPayload
    })
    console.log('400 JSON→XML Request Payload:', requestPayload)
    console.log('400 JSON→XML Response Body:', await response.text())
    expect(response.status()).toBeGreaterThanOrEqual(400)
  })

  test('422 - Validation exception (JSON)', async ({ request, baseURL }) => {
    const requestPayload = invalidUserJson
    const response = await request.post(`${baseURL}/user`, {
      headers: {
        'Accept': 'application/xml',
        'Content-Type': 'application/json',
      },
      data: requestPayload
    })
    console.log('422 JSON→XML Request Payload:', requestPayload)
    console.log('422 JSON→XML Response Body:', await response.text())
    expect(response.status()).toBeGreaterThanOrEqual(422)
  })

  test('default - Unexpected error (XML)', async ({ request, baseURL }) => {
    const requestPayload = exampleUserJson
    const response = await request.post(`${baseURL}/user`, {
      headers: {
        'Accept': 'application/xml',
        'Content-Type': 'application/json',
        'X-Force-Error': 'true'
      },
      data: requestPayload
    })
    console.log('Default JSON→XML Request Payload:', requestPayload)
    console.log('Default JSON→XML Response Body:', await response.text())
    expect(defaultErrorStatusCodes).toContain(response.status())
  })
})

// -------------------- 3. XML (Request) → JSON (Response) --------------------
test.describe('/user - POST XML → JSON', () => {
  test('200 - successful operation', async ({ request, baseURL }) => {
    const requestPayload = exampleUserXml
    const response = await request.post(`${baseURL}/user`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/xml',
      },
      data: requestPayload
    })

    const body = await response.json()
    console.log('200 XML→JSON Request Payload:', requestPayload)
    console.log('200 XML→JSON Response Body:', body)
    expect(response.status()).toBe(200)
    expect(body).toHaveProperty('id')
    expect(body).toHaveProperty('username', 'theUser')
    expect(body).toHaveProperty('firstName', 'John')
    expect(body).toHaveProperty('lastName', 'James')
    expect(body).toHaveProperty('email', 'john@email.com')
    expect(body).toHaveProperty('password', '12345')
    expect(body).toHaveProperty('phone', '12345')
    expect(body).toHaveProperty('userStatus', 1)
  })

  test('400 - Invalid input (XML)', async ({ request, baseURL }) => {
    const requestPayload = badUserXml
    const response = await request.post(`${baseURL}/user`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/xml',
      },
      data: requestPayload
    })
    console.log('400 XML→JSON Request Payload:', requestPayload)
    console.log('400 XML→JSON Response Body:', await response.text())
    expect(response.status()).toBeGreaterThanOrEqual(400)
  })

  test('422 - Validation exception (XML)', async ({ request, baseURL }) => {
    const requestPayload = invalidUserXml
    const response = await request.post(`${baseURL}/user`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/xml',
      },
      data: requestPayload
    })
    console.log('422 XML→JSON Request Payload:', requestPayload)
    console.log('422 XML→JSON Response Body:', await response.text())
    expect(response.status()).toBeGreaterThanOrEqual(422)
  })

  test('default - Unexpected error (JSON)', async ({ request, baseURL }) => {
    const requestPayload = exampleUserXml
    const response = await request.post(`${baseURL}/user`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/xml',
        'X-Force-Error': 'true'
      },
      data: requestPayload
    })

    const body = await response.json()
    console.log('Default XML→JSON Request Payload:', requestPayload)
    console.log('Default XML→JSON Response Body:', body)
    expect(defaultErrorStatusCodes).toContain(response.status())
    expect(body).toHaveProperty('code')
    expect(body).toHaveProperty('message')
  })
})

// -------------------- 4. XML (Request) → XML (Response) --------------------
test.describe('/user - POST XML → XML', () => {
  test('200 - successful operation', async ({ request, baseURL }) => {
    const requestPayload = exampleUserXml
    const response = await request.post(`${baseURL}/user`, {
      headers: {
        'Accept': 'application/xml',
        'Content-Type': 'application/xml',
      },
      data: requestPayload
    })

    const text = await response.text()
    console.log('200 XML→XML Request Payload:', requestPayload)
    console.log('200 XML→XML Response Body:', text)
    expect(response.status()).toBe(200)
    expect(text).toContain('<User>')
    expect(text).toContain('<username>theUser</username>')
    expect(text).toContain('<firstName>John</firstName>')
    expect(text).toContain('<lastName>James</lastName>')
    expect(text).toContain('<email>john@email.com</email>')
    expect(text).toContain('<password>12345</password>')
    expect(text).toContain('<phone>12345</phone>')
    expect(text).toContain('<userStatus>1</userStatus>')
  })

  test('400 - Invalid input (XML)', async ({ request, baseURL }) => {
    const requestPayload = badUserXml
    const response = await request.post(`${baseURL}/user`, {
      headers: {
        'Accept': 'application/xml',
        'Content-Type': 'application/xml',
      },
      data: requestPayload
    })
    console.log('400 XML→XML Request Payload:', requestPayload)
    console.log('400 XML→XML Response Body:', await response.text())
    expect(response.status()).toBeGreaterThanOrEqual(400)
  })

  test('422 - Validation exception (XML)', async ({ request, baseURL }) => {
    const requestPayload = invalidUserXml
    const response = await request.post(`${baseURL}/user`, {
      headers: {
        'Accept': 'application/xml',
        'Content-Type': 'application/xml',
      },
      data: requestPayload
    })
    console.log('422 XML→XML Request Payload:', requestPayload)
    console.log('422 XML→XML Response Body:', await response.text())
    expect(response.status()).toBeGreaterThanOrEqual(422)
  })

  test('default - Unexpected error (XML)', async ({ request, baseURL }) => {
    const requestPayload = exampleUserXml
    const response = await request.post(`${baseURL}/user`, {
      headers: {
        'Accept': 'application/xml',
        'Content-Type': 'application/xml',
        'X-Force-Error': 'true'
      },
      data: requestPayload
    })
    console.log('Default XML→XML Request Payload:', requestPayload)
    console.log('Default XML→XML Response Body:', await response.text())
    expect(defaultErrorStatusCodes).toContain(response.status())
  })
})

// -------------------- 5. FORM (Request) → JSON (Response) --------------------
test.describe('/user - POST FORM → JSON', () => {
  test('200 - successful operation', async ({ request, baseURL }) => {
    const requestPayload = formUrlEncodedUser.toString()
    const response = await request.post(`${baseURL}/user`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: requestPayload
    })

    const body = await response.json()
    console.log('200 FORM→JSON Request Payload:', requestPayload)
    console.log('200 FORM→JSON Response Body:', body)
    expect(response.status()).toBe(200)
    expect(body).toHaveProperty('id')
    expect(body).toHaveProperty('username', 'theUser')
    expect(body).toHaveProperty('firstName', 'John')
    expect(body).toHaveProperty('lastName', 'James')
    expect(body).toHaveProperty('email', 'john@email.com')
    expect(body).toHaveProperty('password', '12345')
    expect(body).toHaveProperty('phone', '12345')
    expect(body).toHaveProperty('userStatus', 1)
  })

  test('400 - Invalid input (FORM)', async ({ request, baseURL }) => {
    const requestPayload = badFormUser.toString()
    const response = await request.post(`${baseURL}/user`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: requestPayload
    })
    console.log('400 FORM→JSON Request Payload:', requestPayload)
    console.log('400 FORM→JSON Response Body:', await response.text())
    expect(response.status()).toBeGreaterThanOrEqual(400)
  })

  test('422 - Validation exception (FORM)', async ({ request, baseURL }) => {
    const requestPayload = invalidFormUser.toString()
    const response = await request.post(`${baseURL}/user`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: requestPayload
    })
    console.log('422 FORM→JSON Request Payload:', requestPayload)
    console.log('422 FORM→JSON Response Body:', await response.text())
    expect(response.status()).toBeGreaterThanOrEqual(422)
  })

  test('default - Unexpected error (JSON)', async ({ request, baseURL }) => {
    const requestPayload = formUrlEncodedUser.toString()
    const response = await request.post(`${baseURL}/user`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-Force-Error': 'true'
      },
      data: requestPayload
    })

    const body = await response.json()
    console.log('Default FORM→JSON Request Payload:', requestPayload)
    console.log('Default FORM→JSON Response Body:', body)
    expect(defaultErrorStatusCodes).toContain(response.status())
    expect(body).toHaveProperty('code')
    expect(body).toHaveProperty('message')
  })
})

// -------------------- 6. FORM (Request) → XML (Response) --------------------
test.describe('/user - POST FORM → XML', () => {
  test('200 - successful operation', async ({ request, baseURL }) => {
    const requestPayload = formUrlEncodedUser.toString()
    const response = await request.post(`${baseURL}/user`, {
      headers: {
        'Accept': 'application/xml',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: requestPayload
    })

    const text = await response.text()
    console.log('200 FORM→XML Request Payload:', requestPayload)
    console.log('200 FORM→XML Response Body:', text)
    expect(response.status()).toBe(200)
    expect(text).toContain('<User>')
    expect(text).toContain('<username>theUser</username>')
    expect(text).toContain('<firstName>John</firstName>')
    expect(text).toContain('<lastName>James</lastName>')
    expect(text).toContain('<email>john@email.com</email>')
    expect(text).toContain('<password>12345</password>')
    expect(text).toContain('<phone>12345</phone>')
    expect(text).toContain('<userStatus>1</userStatus>')
  })

  test('400 - Invalid input (FORM)', async ({ request, baseURL }) => {
    const requestPayload = badFormUser.toString()
    const response = await request.post(`${baseURL}/user`, {
      headers: {
        'Accept': 'application/xml',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: requestPayload
    })
    console.log('400 FORM→XML Request Payload:', requestPayload)
    console.log('400 FORM→XML Response Body:', await response.text())
    expect(response.status()).toBeGreaterThanOrEqual(400)
  })

  test('422 - Validation exception (FORM)', async ({ request, baseURL }) => {
    const requestPayload = invalidFormUser.toString()
    const response = await request.post(`${baseURL}/user`, {
      headers: {
        'Accept': 'application/xml',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: requestPayload
    })
    console.log('422 FORM→XML Request Payload:', requestPayload)
    console.log('422 FORM→XML Response Body:', await response.text())
    expect(response.status()).toBeGreaterThanOrEqual(422)
  })

  test('default - Unexpected error (XML)', async ({ request, baseURL }) => {
    const requestPayload = formUrlEncodedUser.toString()
    const response = await request.post(`${baseURL}/user`, {
      headers: {
        'Accept': 'application/xml',
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-Force-Error': 'true'
      },
      data: requestPayload
    })
    console.log('Default FORM→XML Request Payload:', requestPayload)
    console.log('Default FORM→XML Response Body:', await response.text())
    expect(defaultErrorStatusCodes).toContain(response.status())
  })
})