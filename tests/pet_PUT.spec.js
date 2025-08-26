import { expect } from '@playwright/test'
import { test } from '../fixtures/apiWithAllure'

const examplePetJson = {
  id: 10,
  name: 'doggie',
  category: { id: 1, name: 'Dogs' },
  photoUrls: ['http://example.com/photo1'],
  tags: [{ id: 1, name: 'tag1' }],
  status: 'available'
}

const examplePetXml = `<?xml version="1.0" encoding="UTF-8"?>
  <pet>
    <id>10</id>
    <name>doggie</name>
    <category>
      <id>1</id>
      <name>Dogs</name>
    </category>
    <photoUrls>
      <photoUrl>http://example.com/photo1</photoUrl>
    </photoUrls>
    <tags>
      <tag>
        <id>1</id>
        <name>tag1</name>
      </tag>
    </tags>
    <status>available</status>
  </pet>`;

const formUrlEncoded = new URLSearchParams({
  id: '10',
  name: 'doggie',
  'category.id': '1',
  'category.name': 'Dogs',
  photoUrls: 'http://example.com/photo1',
  'tags[0].id': '1',
  'tags[0].name': 'tag1',
  status: 'available'
})

const badForm = new URLSearchParams({ wrong: 'data' })

// -------------------- 1. JSON (Request) → JSON (Response) --------------------
test.describe('/pet - PUT JSON → JSON', () => {
  test('200 - Successful operation', async ({ request, baseURL }) => {
    const requestPayload = examplePetJson
    const response = await request.put(`${baseURL}/pet`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      data: requestPayload
    })

    const body = await response.json()
    console.log('Request Payload (200 JSON→JSON):', requestPayload)
    console.log('Response Body (200 JSON→JSON):', body)
    expect(response.status()).toBe(200)
    expect(body).toHaveProperty('id', examplePetJson.id)
    expect(body).toHaveProperty('name', examplePetJson.name)
    expect(body.photoUrls).toEqual(examplePetJson.photoUrls)
  })

  test('400 - Invalid ID supplied', async ({ request, baseURL }) => {
    const requestPayload = { "id": "invalid", "name": "test", "photoUrls": ["url"], "status": "available" }
    const response = await request.put(`${baseURL}/pet`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      data: requestPayload
    })
    const body = await response.text()
    console.log('Request Payload (400 JSON→JSON):', requestPayload)
    console.log('Response Body (400 JSON→JSON):', body)
    expect(response.status()).toBe(400)
  })

  test('404 - Pet not found', async ({ request, baseURL }) => {
    const requestPayload = { id: 99999999, name: 'nonexistent', photoUrls: ['http://example.com/photo_nonexistent'], status: 'available' }
    const response = await request.put(`${baseURL}/pet`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      data: requestPayload
    })
    const body = await response.text()
    console.log('Request Payload (404 JSON→JSON):', requestPayload)
    console.log('Response Body (404 JSON→JSON):', body)
    expect(response.status()).toBe(404)
  })

  test('422 - Validation exception', async ({ request, baseURL }) => {
    const requestPayload = { id: 1, name: '', photoUrls: [] }
    const response = await request.put(`${baseURL}/pet`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      data: requestPayload
    })
    const body = await response.text()
    console.log('Request Payload (422 JSON→JSON):', requestPayload)
    console.log('Response Body (422 JSON→JSON):', body)
    expect(response.status()).toBe(422)
  })

  test('default - Unexpected error', async ({ request, baseURL }) => {
    const requestPayload = { invalid: 'Unexpected' }
    const response = await request.put(`${baseURL}/pet`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-Force-Error': 'true'
      },
      data: requestPayload
    })

    const body = await response.json()
    console.log('Request Payload (Default JSON→JSON):', requestPayload)
    console.log('Response Body (Default JSON→JSON):', body)
    expect([500, 501, 502, 503]).toContain(response.status())
    expect(body).toHaveProperty('code')
    expect(body).toHaveProperty('message')
  })
})

// -------------------- 2. JSON (Request) → XML (Response) --------------------
test.describe('/pet - PUT JSON → XML', () => {
  test('200 - Successful operation', async ({ request, baseURL }) => {
    const requestPayload = examplePetJson
    const response = await request.put(`${baseURL}/pet`, {
      headers: {
        'Accept': 'application/xml',
        'Content-Type': 'application/json',
      },
      data: requestPayload
    })
    const text = await response.text()
    console.log('Request Payload (200 JSON→XML):', requestPayload)
    console.log('Response Body (200 JSON→XML):', text)
    expect(response.status()).toBe(200)
    expect(text).toContain('<Pet>')
    expect(text).toContain('<id>10</id>')
    expect(text).toContain('<name>doggie</name>')
  })

  test('400 - Invalid ID supplied', async ({ request, baseURL }) => {
    const requestPayload = { "id": "invalid", "name": "test", "photoUrls": ["url"], "status": "available" }
    const response = await request.put(`${baseURL}/pet`, {
      headers: {
        'Accept': 'application/xml',
        'Content-Type': 'application/json',
      },
      data: requestPayload
    })
    const body = await response.text()
    console.log('Request Payload (400 JSON→XML):', requestPayload)
    console.log('Response Body (400 JSON→XML):', body)
    expect(response.status()).toBe(400)
  })

  test('404 - Pet not found', async ({ request, baseURL }) => {
    const requestPayload = { id: 99999999, name: 'nonexistent', photoUrls: ['http://example.com/photo_nonexistent'], status: 'available' }
    const response = await request.put(`${baseURL}/pet`, {
      headers: {
        'Accept': 'application/xml',
        'Content-Type': 'application/json',
      },
      data: requestPayload
    })
    const body = await response.text()
    console.log('Request Payload (404 JSON→XML):', requestPayload)
    console.log('Response Body (404 JSON→XML):', body)
    expect(response.status()).toBe(404)
  })

  test('422 - Validation exception', async ({ request, baseURL }) => {
    const requestPayload = { id: 1, name: '', photoUrls: [] }
    const response = await request.put(`${baseURL}/pet`, {
      headers: {
        'Accept': 'application/xml',
        'Content-Type': 'application/json',
      },
      data: requestPayload
    })
    const body = await response.text()
    console.log('Request Payload (422 JSON→XML):', requestPayload)
    console.log('Response Body (422 JSON→XML):', body)
    expect(response.status()).toBe(422)
  })

  test('default - Unexpected error', async ({ request, baseURL }) => {
    const requestPayload = { invalid: 'Unexpected' }
    const response = await request.put(`${baseURL}/pet`, {
      headers: {
        'Accept': 'application/xml',
        'Content-Type': 'application/json',
        'X-Force-Error': 'true'
      },
      data: requestPayload
    })
    const body = await response.text()
    console.log('Request Payload (Default JSON→XML):', requestPayload)
    console.log('Response Body (Default JSON→XML):', body)
    expect([500, 501, 502, 503]).toContain(response.status())
  })
})

// -------------------- 3. XML (Request) → JSON (Response) --------------------
test.describe('/pet - PUT XML → JSON', () => {
  test('200 - Successful operation', async ({ request, baseURL }) => {
    const requestPayload = examplePetXml
    const response = await request.put(`${baseURL}/pet`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/xml',
      },
      data: requestPayload
    })

    const body = await response.json()
    console.log('Request Payload (200 XML→JSON):', requestPayload)
    console.log('Response Body (200 XML→JSON):', body)
    expect(response.status()).toBe(200)
    expect(body).toHaveProperty('id', 10)
    expect(body).toHaveProperty('name', 'doggie')
  })

  test('400 - Invalid ID supplied', async ({ request, baseURL }) => {
    const requestPayload = `<pet><id>invalid</id><name>test</name><photoUrls><photoUrl>url</photoUrl></photoUrls><status>available</status></pet>`
    const response = await request.put(`${baseURL}/pet`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/xml',
      },
      data: requestPayload
    })
    const body = await response.text()
    console.log('Request Payload (400 XML→JSON):', requestPayload)
    console.log('Response Body (400 XML→JSON):', body)
    expect(response.status()).toBe(400)
  })

  test('404 - Pet not found', async ({ request, baseURL }) => {
    const requestPayload = `<pet><id>99999999</id><name>nonexistent</name><photoUrls><photoUrl>http://example.com/photo_nonexistent</photoUrl></photoUrls><status>available</status></pet>`
    const response = await request.put(`${baseURL}/pet`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/xml',
      },
      data: requestPayload
    })
    const body = await response.text()
    console.log('Request Payload (404 XML→JSON):', requestPayload)
    console.log('Response Body (404 XML→JSON):', body)
    expect(response.status()).toBe(404)
  })

  test('422 - Validation exception', async ({ request, baseURL }) => {
    const requestPayload = `<pet><id>1</id><name></name><photoUrls></photoUrls></pet>`
    const response = await request.put(`${baseURL}/pet`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/xml',
      },
      data: requestPayload
    })
    const body = await response.text()
    console.log('Request Payload (422 XML→JSON):', requestPayload)
    console.log('Response Body (422 XML→JSON):', body)
    expect(response.status()).toBe(422)
  })

  test('default - Unexpected error', async ({ request, baseURL }) => {
    const requestPayload = `<invalid><data/></invalid>`
    const response = await request.put(`${baseURL}/pet`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/xml',
        'X-Force-Error': 'true'
      },
      data: requestPayload
    })

    const body = await response.json()
    console.log('Request Payload (Default XML→JSON):', requestPayload)
    console.log('Response Body (Default XML→JSON):', body)
    expect([500, 501, 502, 503]).toContain(response.status())
    expect(body).toHaveProperty('code')
    expect(body).toHaveProperty('message')
  })
})

// -------------------- 4. XML (Request) → XML (Response) --------------------
test.describe('/pet - PUT XML → XML', () => {
  test('200 - Successful operation', async ({ request, baseURL }) => {
    const requestPayload = examplePetXml
    const response = await request.put(`${baseURL}/pet`, {
      headers: {
        'Accept': 'application/xml',
        'Content-Type': 'application/xml',
      },
      data: requestPayload
    })

    const text = await response.text()
    console.log('Request Payload (200 XML→XML):', requestPayload)
    console.log('Response Body (200 XML→XML):', text)
    expect(response.status()).toBe(200)
    expect(text).toContain('<Pet>')
    expect(text).toContain('<id>10</id>')
    expect(text).toContain('<name>doggie</name>')
  })

  test('400 - Invalid ID supplied', async ({ request, baseURL }) => {
    const requestPayload = `<pet><id>invalid</id><name>test</name><photoUrls><photoUrl>url</photoUrl></photoUrls><status>available</status></pet>`
    const response = await request.put(`${baseURL}/pet`, {
      headers: {
        'Accept': 'application/xml',
        'Content-Type': 'application/xml',
      },
      data: requestPayload
    })
    const body = await response.text()
    console.log('Request Payload (400 XML→XML):', requestPayload)
    console.log('Response Body (400 XML→XML):', body)
    expect(response.status()).toBe(400)
  })

  test('404 - Pet not found', async ({ request, baseURL }) => {
    const requestPayload = `<pet><id>99999999</id><name>nonexistent</name><photoUrls><photoUrl>http://example.com/photo_nonexistent</photoUrl></photoUrls><status>available</status></pet>`
    const response = await request.put(`${baseURL}/pet`, {
      headers: {
        'Accept': 'application/xml',
        'Content-Type': 'application/xml',
      },
      data: requestPayload
    })
    const body = await response.text()
    console.log('Request Payload (404 XML→XML):', requestPayload)
    console.log('Response Body (404 XML→XML):', body)
    expect(response.status()).toBe(404)
  })

  test('422 - Validation exception', async ({ request, baseURL }) => {
    const requestPayload = `<pet><id>1</id><name></name><photoUrls></photoUrls></pet>`
    const response = await request.put(`${baseURL}/pet`, {
      headers: {
        'Accept': 'application/xml',
        'Content-Type': 'application/xml',
      },
      data: requestPayload
    })
    const body = await response.text()
    console.log('Request Payload (422 XML→XML):', requestPayload)
    console.log('Response Body (422 XML→XML):', body)
    expect(response.status()).toBe(422)
  })

  test('default - Unexpected error', async ({ request, baseURL }) => {
    const requestPayload = `<invalid><data/></invalid>`
    const response = await request.put(`${baseURL}/pet`, {
      headers: {
        'Accept': 'application/xml',
        'Content-Type': 'application/xml',
        'X-Force-Error': 'true'
      },
      data: requestPayload
    })
    const body = await response.text()
    console.log('Request Payload (Default XML→XML):', requestPayload)
    console.log('Response Body (Default XML→XML):', body)
    expect([500, 501, 502, 503]).toContain(response.status())
  })
})

// -------------------- 5. FORM (Request) → JSON (Response) --------------------
test.describe('/pet - PUT FORM → JSON', () => {
  test('200 - Successful operation', async ({ request, baseURL }) => {
    const requestPayload = formUrlEncoded.toString()
    const response = await request.put(`${baseURL}/pet`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: requestPayload
    })

    const body = await response.json()
    console.log('Request Payload (200 FORM→JSON):', requestPayload)
    console.log('Response Body (200 FORM→JSON):', body)
    expect(response.status()).toBe(200)
    expect(body).toHaveProperty('id', 10)
    expect(body).toHaveProperty('name', 'doggie')
  })

  test('400 - Invalid ID supplied', async ({ request, baseURL }) => {
    const requestPayload = new URLSearchParams({ id: 'invalid', name: 'test', photoUrls: 'url', status: 'available' }).toString()
    const response = await request.put(`${baseURL}/pet`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: requestPayload
    })
    const body = await response.text()
    console.log('Request Payload (400 FORM→JSON):', requestPayload)
    console.log('Response Body (400 FORM→JSON):', body)
    expect(response.status()).toBe(400)
  })

  test('404 - Pet not found', async ({ request, baseURL }) => {
    const requestPayload = new URLSearchParams({ id: '99999999', name: 'nonexistent', photoUrls: 'http://example.com/photo_nonexistent', status: 'available' }).toString()
    const response = await request.put(`${baseURL}/pet`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: requestPayload
    })
    const body = await response.text()
    console.log('Request Payload (404 FORM→JSON):', requestPayload)
    console.log('Response Body (404 FORM→JSON):', body)
    expect(response.status()).toBe(404)
  })

  test('422 - Validation exception', async ({ request, baseURL }) => {
    const requestPayload = new URLSearchParams({ id: '1', name: '', photoUrls: '' }).toString()
    const response = await request.put(`${baseURL}/pet`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: requestPayload
    })
    const body = await response.text()
    console.log('Request Payload (422 FORM→JSON):', requestPayload)
    console.log('Response Body (422 FORM→JSON):', body)
    expect(response.status()).toBe(422)
  })

  test('default - Unexpected error', async ({ request, baseURL }) => {
    const requestPayload = badForm.toString()
    const response = await request.put(`${baseURL}/pet`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-Force-Error': 'true'
      },
      data: requestPayload
    })
    const body = await response.json()
    console.log('Request Payload (Default FORM→JSON):', requestPayload)
    console.log('Response Body (Default FORM→JSON):', body)
    expect([500, 501, 502, 503]).toContain(response.status())
    expect(body).toHaveProperty('code')
    expect(body).toHaveProperty('message')
  })
})

// -------------------- 6. FORM (Request) → XML (Response) --------------------
test.describe('/pet - PUT FORM → XML', () => {
  test('200 - Successful operation', async ({ request, baseURL }) => {
    const requestPayload = formUrlEncoded.toString()
    const response = await request.put(`${baseURL}/pet`, {
      headers: {
        'Accept': 'application/xml',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: requestPayload
    })
    const text = await response.text()
    console.log('Request Payload (200 FORM→XML):', requestPayload)
    console.log('Response Body (200 FORM→XML):', text)
    expect(response.status()).toBe(200)
    expect(text).toContain('<Pet>')
    expect(text).toContain('<id>10</id>')
    expect(text).toContain('<name>doggie</name>')
  })

  test('400 - Invalid ID supplied', async ({ request, baseURL }) => {
    const requestPayload = new URLSearchParams({ id: 'invalid', name: 'test', photoUrls: 'url', status: 'available' }).toString()
    const response = await request.put(`${baseURL}/pet`, {
      headers: {
        'Accept': 'application/xml',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: requestPayload
    })
    const body = await response.text()
    console.log('Request Payload (400 FORM→XML):', requestPayload)
    console.log('Response Body (400 FORM→XML):', body)
    expect(response.status()).toBe(400)
  })

  test('404 - Pet not found', async ({ request, baseURL }) => {
    const requestPayload = new URLSearchParams({ id: '99999999', name: 'nonexistent', photoUrls: 'http://example.com/photo_nonexistent', status: 'available' }).toString()
    const response = await request.put(`${baseURL}/pet`, {
      headers: {
        'Accept': 'application/xml',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: requestPayload
    })
    const body = await response.text()
    console.log('Request Payload (404 FORM→XML):', requestPayload)
    console.log('Response Body (404 FORM→XML):', body)
    expect(response.status()).toBe(404)
  })

  test('422 - Validation exception', async ({ request, baseURL }) => {
    const requestPayload = new URLSearchParams({ id: '1', name: '', photoUrls: '' }).toString()
    const response = await request.put(`${baseURL}/pet`, {
      headers: {
        'Accept': 'application/xml',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: requestPayload
    })
    const body = await response.text()
    console.log('Request Payload (422 FORM→XML):', requestPayload)
    console.log('Response Body (422 FORM→XML):', body)
    expect(response.status()).toBe(422)
  })

  test('default - Unexpected error', async ({ request, baseURL }) => {
    const requestPayload = badForm.toString()
    const response = await request.put(`${baseURL}/pet`, {
      headers: {
        'Accept': 'application/xml',
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-Force-Error': 'true'
      },
      data: requestPayload
    })
    const body = await response.text()
    console.log('Request Payload (Default FORM→XML):', requestPayload)
    console.log('Response Body (Default FORM→XML):', body)
    expect([500, 501, 502, 503]).toContain(response.status())
  })
})
