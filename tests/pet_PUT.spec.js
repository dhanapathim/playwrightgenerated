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
});

const badIdJson = {
  id: 'invalidId',
  name: 'doggie',
  photoUrls: ['http://example.com/photo1'],
  status: 'available'
};

const badIdXml = `<?xml version="1.0" encoding="UTF-8"?>
<pet>
  <id>invalidId</id>
  <name>doggie</name>
  <photoUrls><photoUrl>http://example.com/photo1</photoUrl></photoUrls>
  <status>available</status>
</pet>`;

const badIdForm = new URLSearchParams({
  id: 'invalidId',
  name: 'doggie',
  photoUrls: 'http://example.com/photo1',
  status: 'available'
});

const notFoundIdJson = {
  id: 987654321000,
  name: 'doggie',
  photoUrls: ['http://example.com/photo1'],
  status: 'available'
};

const notFoundIdXml = `<?xml version="1.0" encoding="UTF-8"?>
<pet>
  <id>987654321000</id>
  <name>doggie</name>
  <photoUrls><photoUrl>http://example.com/photo1</photoUrl></photoUrls>
  <status>available</status>
</pet>`;

const notFoundIdForm = new URLSearchParams({
  id: '987654321000',
  name: 'doggie',
  photoUrls: 'http://example.com/photo1',
  status: 'available'
});

const validationErrorJson = {
  id: 10,
  name: '',
  photoUrls: [],
  category: { id: 1, name: 'Dogs' },
  tags: [{ id: 1, name: 'tag1' }],
  status: 'available'
};

const validationErrorXml = `<?xml version="1.0" encoding="UTF-8"?>
<pet>
  <id>10</id>
  <name></name>
  <photoUrls></photoUrls>
  <category><id>1</id><name>Dogs</name></category>
  <tags><tag><id>1</id><name>tag1</name></tag></tags>
  <status>available</status>
</pet>`;

const validationErrorForm = new URLSearchParams({
  id: '10',
  name: '',
  photoUrls: '',
  'category.id': '1',
  'category.name': 'Dogs',
  'tags[0].id': '1',
  'tags[0].name': 'tag1',
  status: 'available'
});

const defaultErrorJson = { invalid: 'Unexpected' };
const defaultErrorXml = `<invalid><data/></invalid>`;
const defaultErrorForm = new URLSearchParams({ wrong: 'data' });

// -------------------- 1. JSON (Request) → JSON (Response) --------------------
test.describe('/pet - PUT JSON → JSON', () => {
  test('200 - Successful operation', async ({ request, baseURL }) => {
    const response = await request.put(`${baseURL}/pet`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      data: examplePetJson
    })
    const body = await response.json()
    console.log('200 JSON→JSON:', body)
    expect(response.status()).toBe(200)
    expect(body).toHaveProperty('id')
    expect(body).toHaveProperty('name', 'doggie')
  })

  test('400 - Invalid ID supplied', async ({ request, baseURL }) => {
    const response = await request.put(`${baseURL}/pet`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      data: badIdJson
    })
    console.log('400 JSON→JSON:', await response.text())
    expect(response.status()).toBe(400)
  })

  test('404 - Pet not found', async ({ request, baseURL }) => {
    const response = await request.put(`${baseURL}/pet`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      data: notFoundIdJson
    })
    console.log('404 JSON→JSON:', await response.text())
    expect(response.status()).toBe(404)
  })

  test('422 - Validation exception', async ({ request, baseURL }) => {
    const response = await request.put(`${baseURL}/pet`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      data: validationErrorJson
    })
    console.log('422 JSON→JSON:', await response.text())
    expect(response.status()).toBe(422)
  })

  test('default - Unexpected error', async ({ request, baseURL }) => {
    const response = await request.put(`${baseURL}/pet`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-Force-Error': 'true'
      },
      data: defaultErrorJson
    })
    const body = await response.json()
    console.log('Default JSON→JSON:', body)
    expect([500, 501, 502, 503]).toContain(response.status())
    expect(body).toHaveProperty('code')
    expect(body).toHaveProperty('message')
  })
})

// -------------------- 2. JSON (Request) → XML (Response) --------------------
test.describe('/pet - PUT JSON → XML', () => {
  test('200 - Successful operation', async ({ request, baseURL }) => {
    const response = await request.put(`${baseURL}/pet`, {
      headers: {
        'Accept': 'application/xml',
        'Content-Type': 'application/json',
      },
      data: examplePetJson
    })
    const text = await response.text()
    console.log('200 JSON→XML:', text)
    expect(response.status()).toBe(200)
    expect(text).toContain('<Pet>')
    expect(text).toContain('<name>doggie</name>')
  })

  test('400 - Invalid ID supplied', async ({ request, baseURL }) => {
    const response = await request.put(`${baseURL}/pet`, {
      headers: {
        'Accept': 'application/xml',
        'Content-Type': 'application/json',
      },
      data: badIdJson
    })
    console.log('400 JSON→XML:', await response.text())
    expect(response.status()).toBe(400)
  })

  test('404 - Pet not found', async ({ request, baseURL }) => {
    const response = await request.put(`${baseURL}/pet`, {
      headers: {
        'Accept': 'application/xml',
        'Content-Type': 'application/json',
      },
      data: notFoundIdJson
    })
    console.log('404 JSON→XML:', await response.text())
    expect(response.status()).toBe(404)
  })

  test('422 - Validation exception', async ({ request, baseURL }) => {
    const response = await request.put(`${baseURL}/pet`, {
      headers: {
        'Accept': 'application/xml',
        'Content-Type': 'application/json',
      },
      data: validationErrorJson
    })
    console.log('422 JSON→XML:', await response.text())
    expect(response.status()).toBe(422)
  })

  test('default - Unexpected error', async ({ request, baseURL }) => {
    const response = await request.put(`${baseURL}/pet`, {
      headers: {
        'Accept': 'application/xml',
        'Content-Type': 'application/json',
        'X-Force-Error': 'true'
      },
      data: defaultErrorJson
    })
    console.log('Default JSON→XML:', await response.text())
    expect([500, 501, 502, 503]).toContain(response.status())
  })
})

// -------------------- 3. XML (Request) → JSON (Response) --------------------
test.describe('/pet - PUT XML → JSON', () => {
  test('200 - Successful operation', async ({ request, baseURL }) => {
    const response = await request.put(`${baseURL}/pet`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/xml',
      },
      data: examplePetXml
    })
    const body = await response.json()
    console.log('200 XML→JSON:', body)
    expect(response.status()).toBe(200)
    expect(body).toHaveProperty('id')
    expect(body).toHaveProperty('name', 'doggie')
  })

  test('400 - Invalid ID supplied', async ({ request, baseURL }) => {
    const response = await request.put(`${baseURL}/pet`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/xml',
      },
      data: badIdXml
    })
    console.log('400 XML→JSON:', await response.text())
    expect(response.status()).toBe(400)
  })

  test('404 - Pet not found', async ({ request, baseURL }) => {
    const response = await request.put(`${baseURL}/pet`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/xml',
      },
      data: notFoundIdXml
    })
    console.log('404 XML→JSON:', await response.text())
    expect(response.status()).toBe(404)
  })

  test('422 - Validation exception', async ({ request, baseURL }) => {
    const response = await request.put(`${baseURL}/pet`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/xml',
      },
      data: validationErrorXml
    })
    console.log('422 XML→JSON:', await response.text())
    expect(response.status()).toBe(422)
  })

  test('default - Unexpected error', async ({ request, baseURL }) => {
    const response = await request.put(`${baseURL}/pet`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/xml',
        'X-Force-Error': 'true'
      },
      data: defaultErrorXml
    })
    const body = await response.json()
    console.log('Default XML→JSON:', body)
    expect([500, 501, 502, 503]).toContain(response.status())
    expect(body).toHaveProperty('code')
    expect(body).toHaveProperty('message')
  })
})

// -------------------- 4. XML (Request) → XML (Response) --------------------
test.describe('/pet - PUT XML → XML', () => {
  test('200 - Successful operation', async ({ request, baseURL }) => {
    const response = await request.put(`${baseURL}/pet`, {
      headers: {
        'Accept': 'application/xml',
        'Content-Type': 'application/xml',
      },
      data: examplePetXml
    })
    const text = await response.text()
    console.log('200 XML→XML:', text)
    expect(response.status()).toBe(200)
    expect(text).toContain('<Pet>')
    expect(text).toContain('<name>doggie</name>')
  })

  test('400 - Invalid ID supplied', async ({ request, baseURL }) => {
    const response = await request.put(`${baseURL}/pet`, {
      headers: {
        'Accept': 'application/xml',
        'Content-Type': 'application/xml',
      },
      data: badIdXml
    })
    console.log('400 XML→XML:', await response.text())
    expect(response.status()).toBe(400)
  })

  test('404 - Pet not found', async ({ request, baseURL }) => {
    const response = await request.put(`${baseURL}/pet`, {
      headers: {
        'Accept': 'application/xml',
        'Content-Type': 'application/xml',
      },
      data: notFoundIdXml
    })
    console.log('404 XML→XML:', await response.text())
    expect(response.status()).toBe(404)
  })

  test('422 - Validation exception', async ({ request, baseURL }) => {
    const response = await request.put(`${baseURL}/pet`, {
      headers: {
        'Accept': 'application/xml',
        'Content-Type': 'application/xml',
      },
      data: validationErrorXml
    })
    console.log('422 XML→XML:', await response.text())
    expect(response.status()).toBe(422)
  })

  test('default - Unexpected error', async ({ request, baseURL }) => {
    const response = await request.put(`${baseURL}/pet`, {
      headers: {
        'Accept': 'application/xml',
        'Content-Type': 'application/xml',
        'X-Force-Error': 'true'
      },
      data: defaultErrorXml
    })
    console.log('Default XML→XML:', await response.text())
    expect([500, 501, 502, 503]).toContain(response.status())
  })
})

// -------------------- 5. FORM (Request) → JSON (Response) --------------------
test.describe('/pet - PUT FORM → JSON', () => {
  test('200 - Successful operation', async ({ request, baseURL }) => {
    const response = await request.put(`${baseURL}/pet`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: formUrlEncoded.toString()
    })
    const body = await response.json()
    console.log('200 FORM→JSON:', body)
    expect(response.status()).toBe(200)
    expect(body).toHaveProperty('id')
    expect(body).toHaveProperty('name', 'doggie')
  })

  test('400 - Invalid ID supplied', async ({ request, baseURL }) => {
    const response = await request.put(`${baseURL}/pet`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: badIdForm.toString()
    })
    console.log('400 FORM→JSON:', await response.text())
    expect(response.status()).toBe(400)
  })

  test('404 - Pet not found', async ({ request, baseURL }) => {
    const response = await request.put(`${baseURL}/pet`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: notFoundIdForm.toString()
    })
    console.log('404 FORM→JSON:', await response.text())
    expect(response.status()).toBe(404)
  })

  test('422 - Validation exception', async ({ request, baseURL }) => {
    const response = await request.put(`${baseURL}/pet`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: validationErrorForm.toString()
    })
    console.log('422 FORM→JSON:', await response.text())
    expect(response.status()).toBe(422)
  })

  test('default - Unexpected error', async ({ request, baseURL }) => {
    const response = await request.put(`${baseURL}/pet`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-Force-Error': 'true'
      },
      data: defaultErrorForm.toString()
    })
    const body = await response.json()
    console.log('Default FORM→JSON:', body)
    expect([500, 501, 502, 503]).toContain(response.status())
    expect(body).toHaveProperty('code')
    expect(body).toHaveProperty('message')
  })
})

// -------------------- 6. FORM (Request) → XML (Response) --------------------
test.describe('/pet - PUT FORM → XML', () => {
  test('200 - Successful operation', async ({ request, baseURL }) => {
    const response = await request.put(`${baseURL}/pet`, {
      headers: {
        'Accept': 'application/xml',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: formUrlEncoded.toString()
    })
    const text = await response.text()
    console.log('200 FORM→XML:', text)
    expect(response.status()).toBe(200)
    expect(text).toContain('<Pet>')
    expect(text).toContain('<name>doggie</name>')
  })

  test('400 - Invalid ID supplied', async ({ request, baseURL }) => {
    const response = await request.put(`${baseURL}/pet`, {
      headers: {
        'Accept': 'application/xml',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: badIdForm.toString()
    })
    console.log('400 FORM→XML:', await response.text())
    expect(response.status()).toBe(400)
  })

  test('404 - Pet not found', async ({ request, baseURL }) => {
    const response = await request.put(`${baseURL}/pet`, {
      headers: {
        'Accept': 'application/xml',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: notFoundIdForm.toString()
    })
    console.log('404 FORM→XML:', await response.text())
    expect(response.status()).toBe(404)
  })

  test('422 - Validation exception', async ({ request, baseURL }) => {
    const response = await request.put(`${baseURL}/pet`, {
      headers: {
        'Accept': 'application/xml',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: validationErrorForm.toString()
    })
    console.log('422 FORM→XML:', await response.text())
    expect(response.status()).toBe(422)
  })

  test('default - Unexpected error', async ({ request, baseURL }) => {
    const response = await request.put(`${baseURL}/pet`, {
      headers: {
        'Accept': 'application/xml',
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-Force-Error': 'true'
      },
      data: defaultErrorForm.toString()
    })
    console.log('Default FORM→XML:', await response.text())
    expect([500, 501, 502, 503]).toContain(response.status())
  })
})
