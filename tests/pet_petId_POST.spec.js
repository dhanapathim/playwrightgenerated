import { expect } from '@playwright/test'
import { test } from '../fixtures/apiWithAllure'

const petIdForUpdate = 10; // Path parameter for /pet/{petId}

const examplePetBodyJson = {
  id: petIdForUpdate,
  name: 'UpdatedDoggieJson',
  category: { id: 1, name: 'Dogs' },
  photoUrls: ['http://example.com/json_photo1'],
  tags: [{ id: 1, name: 'tag1' }],
  status: 'sold'
};

const examplePetBodyXml = `<?xml version="1.0" encoding="UTF-8"?>
  <Pet>
    <id>${petIdForUpdate}</id>
    <name>UpdatedDoggieXml</name>
    <category>
      <id>1</id>
      <name>Dogs</name>
    </category>
    <photoUrls>
      <photoUrl>http://example.com/xml_photo1</photoUrl>
    </photoUrls>
    <tags>
      <tag>
        <id>1</id>
        <name>tag1</name>
      </tag>
    </tags>
    <status>sold</status>
  </Pet>`;

const formUrlEncodedBody = new URLSearchParams({
  id: petIdForUpdate.toString(),
  name: 'UpdatedDoggieForm',
  'category.id': '1',
  'category.name': 'Dogs',
  photoUrls: 'http://example.com/form_photo1',
  'tags[0].id': '1',
  'tags[0].name': 'tag1',
  status: 'pending'
});

const badFormBody = new URLSearchParams({ wrong: 'data' });
const invalidFormBody = new URLSearchParams({ name: '', photoUrls: '' }); // Missing required, or empty values for validation

const badXmlBody = ` < invalid > < data / > < / invalid > `;
const invalidXmlBody = ` < Pet > < name > < / name > < photoUrls / > < / Pet > `;

const badJsonBody = { invalid: 'payload' };
const invalidJsonBody = { name: '', photoUrls: [] };

// -------------------- 1. JSON Request → JSON Response --------------------
test.describe('/pet/{petId} - POST JSON → JSON', () => {
  test('200 - Successful operation', async ({ request, baseURL }) => {
    const updateName = 'UpdatedDoggieJson';
    const updateStatus = 'sold';
    const requestPayload = { ...examplePetBodyJson, name: updateName, status: updateStatus };
    const response = await request.post(`${baseURL}/pet/${petIdForUpdate}?name=${updateName}&status=${updateStatus}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      data: requestPayload
    });
    const body = await response.json();
    console.log('200 JSON→JSON Request Payload:', requestPayload);
    console.log('200 JSON→JSON Response Body:', body);
    expect(response.status()).toBe(200);
    expect(body).toHaveProperty('id', petIdForUpdate);
    expect(body).toHaveProperty('name', updateName);
    expect(body).toHaveProperty('status', updateStatus);
  });

  test('400 - Invalid input', async ({ request, baseURL }) => {
    const updateName = 'BadName';
    const updateStatus = 'invalidStatus';
    const requestPayload = badJsonBody;
    const response = await request.post(`${baseURL}/pet/${petIdForUpdate}?name=${updateName}&status=${updateStatus}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      data: requestPayload
    });
    console.log('400 JSON→JSON Request Payload:', requestPayload);
    console.log('400 JSON→JSON Response Body:', await response.text());
    expect(response.status()).toBe(400);
  });

  test('422 - Validation exception', async ({ request, baseURL }) => {
    const updateName = '';
    const updateStatus = 'available';
    const requestPayload = invalidJsonBody;
    const response = await request.post(`${baseURL}/pet/${petIdForUpdate}?name=${updateName}&status=${updateStatus}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      data: requestPayload
    });
    console.log('422 JSON→JSON Request Payload:', requestPayload);
    console.log('422 JSON→JSON Response Body:', await response.text());
    expect(response.status()).toBe(422);
  });

  test('default - Unexpected error', async ({ request, baseURL }) => {
    const updateName = 'ErrorName';
    const updateStatus = 'errorStatus';
    const requestPayload = { invalid: 'Unexpected' };
    const response = await request.post(`${baseURL}/pet/${petIdForUpdate}?name=${updateName}&status=${updateStatus}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-Force-Error': 'true'
      },
      data: requestPayload
    });
    const body = await response.json();
    console.log('Default JSON→JSON Request Payload:', requestPayload);
    console.log('Default JSON→JSON Response Body:', body);
    expect([500, 501, 502, 503]).toContain(response.status());
    expect(body).toHaveProperty('code');
    expect(body).toHaveProperty('message');
  });
});

// -------------------- 2. JSON Request → XML Response --------------------
test.describe('/pet/{petId} - POST JSON → XML', () => {
  test('200 - Successful operation', async ({ request, baseURL }) => {
    const updateName = 'UpdatedDoggieJson';
    const updateStatus = 'sold';
    const requestPayload = { ...examplePetBodyJson, name: updateName, status: updateStatus };
    const response = await request.post(`${baseURL}/pet/${petIdForUpdate}?name=${updateName}&status=${updateStatus}`, {
      headers: {
        'Accept': 'application/xml',
        'Content-Type': 'application/json',
      },
      data: requestPayload
    });
    const text = await response.text();
    console.log('200 JSON→XML Request Payload:', requestPayload);
    console.log('200 JSON→XML Response Body:', text);
    expect(response.status()).toBe(200);
    expect(text).toContain('<Pet>');
    expect(text).toContain(`<name>${updateName}</name>`);
    expect(text).toContain(`<status>${updateStatus}</status>`);
  });

  test('400 - Invalid input', async ({ request, baseURL }) => {
    const updateName = 'BadName';
    const updateStatus = 'invalidStatus';
    const requestPayload = badJsonBody;
    const response = await request.post(`${baseURL}/pet/${petIdForUpdate}?name=${updateName}&status=${updateStatus}`, {
      headers: {
        'Accept': 'application/xml',
        'Content-Type': 'application/json',
      },
      data: requestPayload
    });
    console.log('400 JSON→XML Request Payload:', requestPayload);
    console.log('400 JSON→XML Response Body:', await response.text());
    expect(response.status()).toBe(400);
  });

  test('422 - Validation exception', async ({ request, baseURL }) => {
    const updateName = '';
    const updateStatus = 'available';
    const requestPayload = invalidJsonBody;
    const response = await request.post(`${baseURL}/pet/${petIdForUpdate}?name=${updateName}&status=${updateStatus}`, {
      headers: {
        'Accept': 'application/xml',
        'Content-Type': 'application/json',
      },
      data: requestPayload
    });
    console.log('422 JSON→XML Request Payload:', requestPayload);
    console.log('422 JSON→XML Response Body:', await response.text());
    expect(response.status()).toBe(422);
  });
});

// -------------------- 3. XML Request → JSON Response --------------------
test.describe('/pet/{petId} - POST XML → JSON', () => {
  test('200 - Successful operation', async ({ request, baseURL }) => {
    const updateName = 'UpdatedDoggieXml';
    const updateStatus = 'sold';
    const requestPayload = examplePetBodyXml.replace('<name>UpdatedDoggieXml</name>', `<name>${updateName}</name>`).replace('<status>sold</status>', `<status>${updateStatus}</status>`);
    const response = await request.post(`${baseURL}/pet/${petIdForUpdate}?name=${updateName}&status=${updateStatus}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/xml',
      },
      data: requestPayload
    });
    const body = await response.json();
    console.log('200 XML→JSON Request Payload:', requestPayload);
    console.log('200 XML→JSON Response Body:', body);
    expect(response.status()).toBe(200);
    expect(body).toHaveProperty('id', petIdForUpdate);
    expect(body).toHaveProperty('name', updateName);
    expect(body).toHaveProperty('status', updateStatus);
  });

  test('400 - Invalid input', async ({ request, baseURL }) => {
    const updateName = 'BadName';
    const updateStatus = 'invalidStatus';
    const requestPayload = badXmlBody;
    const response = await request.post(`${baseURL}/pet/${petIdForUpdate}?name=${updateName}&status=${updateStatus}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/xml',
      },
      data: requestPayload
    });
    console.log('400 XML→JSON Request Payload:', requestPayload);
    console.log('400 XML→JSON Response Body:', await response.text());
    expect(response.status()).toBe(400);
  });

  test('422 - Validation exception', async ({ request, baseURL }) => {
    const updateName = '';
    const updateStatus = 'available';
    const requestPayload = invalidXmlBody;
    const response = await request.post(`${baseURL}/pet/${petIdForUpdate}?name=${updateName}&status=${updateStatus}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/xml',
      },
      data: requestPayload
    });
    console.log('422 XML→JSON Request Payload:', requestPayload);
    console.log('422 XML→JSON Response Body:', await response.text());
    expect(response.status()).toBe(422);
  });

  test('default - Unexpected error', async ({ request, baseURL }) => {
    const updateName = 'ErrorName';
    const updateStatus = 'errorStatus';
    const requestPayload = badXmlBody;
    const response = await request.post(`${baseURL}/pet/${petIdForUpdate}?name=${updateName}&status=${updateStatus}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/xml',
        'X-Force-Error': 'true'
      },
      data: requestPayload
    });
    const body = await response.json();
    console.log('Default XML→JSON Request Payload:', requestPayload);
    console.log('Default XML→JSON Response Body:', body);
    expect([500, 501, 502, 503]).toContain(response.status());
    expect(body).toHaveProperty('code');
    expect(body).toHaveProperty('message');
  });
});

// -------------------- 4. XML Request → XML Response --------------------
test.describe('/pet/{petId} - POST XML → XML', () => {
  test('200 - Successful operation', async ({ request, baseURL }) => {
    const updateName = 'UpdatedDoggieXml';
    const updateStatus = 'sold';
    const requestPayload = examplePetBodyXml.replace('<name>UpdatedDoggieXml</name>', `<name>${updateName}</name>`).replace('<status>sold</status>', `<status>${updateStatus}</status>`);
    const response = await request.post(`${baseURL}/pet/${petIdForUpdate}?name=${updateName}&status=${updateStatus}`, {
      headers: {
        'Accept': 'application/xml',
        'Content-Type': 'application/xml',
      },
      data: requestPayload
    });
    const text = await response.text();
    console.log('200 XML→XML Request Payload:', requestPayload);
    console.log('200 XML→XML Response Body:', text);
    expect(response.status()).toBe(200);
    expect(text).toContain('<Pet>');
    expect(text).toContain(`<name>${updateName}</name>`);
    expect(text).toContain(`<status>${updateStatus}</status>`);
  });

  test('400 - Invalid input', async ({ request, baseURL }) => {
    const updateName = 'BadName';
    const updateStatus = 'invalidStatus';
    const requestPayload = badXmlBody;
    const response = await request.post(`${baseURL}/pet/${petIdForUpdate}?name=${updateName}&status=${updateStatus}`, {
      headers: {
        'Accept': 'application/xml',
        'Content-Type': 'application/xml',
      },
      data: requestPayload
    });
    console.log('400 XML→XML Request Payload:', requestPayload);
    console.log('400 XML→XML Response Body:', await response.text());
    expect(response.status()).toBe(400);
  });

  test('422 - Validation exception', async ({ request, baseURL }) => {
    const updateName = '';
    const updateStatus = 'available';
    const requestPayload = invalidXmlBody;
    const response = await request.post(`${baseURL}/pet/${petIdForUpdate}?name=${updateName}&status=${updateStatus}`, {
      headers: {
        'Accept': 'application/xml',
        'Content-Type': 'application/xml',
      },
      data: requestPayload
    });
    console.log('422 XML→XML Request Payload:', requestPayload);
    console.log('422 XML→XML Response Body:', await response.text());
    expect(response.status()).toBe(422);
  });
});

// -------------------- 5. FORM Request → JSON Response --------------------
test.describe('/pet/{petId} - POST FORM → JSON', () => {
  test('200 - Successful operation', async ({ request, baseURL }) => {
    const updateName = 'UpdatedDoggieForm';
    const updateStatus = 'pending';
    const requestPayload = new URLSearchParams({ ...Object.fromEntries(formUrlEncodedBody), name: updateName, status: updateStatus });
    const response = await request.post(`${baseURL}/pet/${petIdForUpdate}?name=${updateName}&status=${updateStatus}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: requestPayload.toString()
    });
    const body = await response.json();
    console.log('200 FORM→JSON Request Payload:', requestPayload.toString());
    console.log('200 FORM→JSON Response Body:', body);
    expect(response.status()).toBe(200);
    expect(body).toHaveProperty('id', petIdForUpdate);
    expect(body).toHaveProperty('name', updateName);
    expect(body).toHaveProperty('status', updateStatus);
  });

  test('400 - Invalid input', async ({ request, baseURL }) => {
    const updateName = 'BadName';
    const updateStatus = 'invalidStatus';
    const requestPayload = badFormBody;
    const response = await request.post(`${baseURL}/pet/${petIdForUpdate}?name=${updateName}&status=${updateStatus}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: requestPayload.toString()
    });
    console.log('400 FORM→JSON Request Payload:', requestPayload.toString());
    console.log('400 FORM→JSON Response Body:', await response.text());
    expect(response.status()).toBe(400);
  });

  test('422 - Validation exception', async ({ request, baseURL }) => {
    const updateName = '';
    const updateStatus = 'available';
    const requestPayload = invalidFormBody;
    const response = await request.post(`${baseURL}/pet/${petIdForUpdate}?name=${updateName}&status=${updateStatus}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: requestPayload.toString()
    });
    console.log('422 FORM→JSON Request Payload:', requestPayload.toString());
    console.log('422 FORM→JSON Response Body:', await response.text());
    expect(response.status()).toBe(422);
  });

  test('default - Unexpected error', async ({ request, baseURL }) => {
    const updateName = 'ErrorName';
    const updateStatus = 'errorStatus';
    const requestPayload = badFormBody;
    const response = await request.post(`${baseURL}/pet/${petIdForUpdate}?name=${updateName}&status=${updateStatus}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-Force-Error': 'true'
      },
      data: requestPayload.toString()
    });
    const body = await response.json();
    console.log('Default FORM→JSON Request Payload:', requestPayload.toString());
    console.log('Default FORM→JSON Response Body:', body);
    expect([500, 501, 502, 503]).toContain(response.status());
    expect(body).toHaveProperty('code');
    expect(body).toHaveProperty('message');
  });
});

// -------------------- 6. FORM Request → XML Response --------------------
test.describe('/pet/{petId} - POST FORM → XML', () => {
  test('200 - Successful operation', async ({ request, baseURL }) => {
    const updateName = 'UpdatedDoggieForm';
    const updateStatus = 'pending';
    const requestPayload = new URLSearchParams({ ...Object.fromEntries(formUrlEncodedBody), name: updateName, status: updateStatus });
    const response = await request.post(`${baseURL}/pet/${petIdForUpdate}?name=${updateName}&status=${updateStatus}`, {
      headers: {
        'Accept': 'application/xml',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: requestPayload.toString()
    });
    const text = await response.text();
    console.log('200 FORM→XML Request Payload:', requestPayload.toString());
    console.log('200 FORM→XML Response Body:', text);
    expect(response.status()).toBe(200);
    expect(text).toContain('<Pet>');
    expect(text).toContain(`<name>${updateName}</name>`);
    expect(text).toContain(`<status>${updateStatus}</status>`);
  });

  test('400 - Invalid input', async ({ request, baseURL }) => {
    const updateName = 'BadName';
    const updateStatus = 'invalidStatus';
    const requestPayload = badFormBody;
    const response = await request.post(`${baseURL}/pet/${petIdForUpdate}?name=${updateName}&status=${updateStatus}`, {
      headers: {
        'Accept': 'application/xml',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: requestPayload.toString()
    });
    console.log('400 FORM→XML Request Payload:', requestPayload.toString());
    console.log('400 FORM→XML Response Body:', await response.text());
    expect(response.status()).toBe(400);
  });

  test('422 - Validation exception', async ({ request, baseURL }) => {
    const updateName = '';
    const updateStatus = 'available';
    const requestPayload = invalidFormBody;
    const response = await request.post(`${baseURL}/pet/${petIdForUpdate}?name=${updateName}&status=${updateStatus}`, {
      headers: {
        'Accept': 'application/xml',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: requestPayload.toString()
    });
    console.log('422 FORM→XML Request Payload:', requestPayload.toString());
    console.log('422 FORM→XML Response Body:', await response.text());
    expect(response.status()).toBe(422);
  });

  test('default - Unexpected error', async ({ request, baseURL }) => {
    const updateName = 'ErrorName';
    const updateStatus = 'errorStatus';
    const requestPayload = badFormBody;
    const response = await request.post(`${baseURL}/pet/${petIdForUpdate}?name=${updateName}&status=${updateStatus}`, {
      headers: {
        'Accept': 'application/xml',
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-Force-Error': 'true'
      },
      data: requestPayload.toString()
    });
    console.log('Default FORM→XML Request Payload:', requestPayload.toString());
    console.log('Default FORM→XML Response Body:', await response.text());
    expect([500, 501, 502, 503]).toContain(response.status());
  });
});
