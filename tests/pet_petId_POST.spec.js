import { expect } from '@playwright/test';
import { test } from '../fixtures/apiWithAllure';

// Constants for /pet/{petId} POST operation
const PATH_PET_ID = 10; // Example petId for path parameter
const UPDATE_NAME = 'DoggieUpdated';
const UPDATE_STATUS = 'sold'; // Must be one of enum: "available", "pending", "sold"

// Query parameters for successful update
const successQueryParams = {
  name: UPDATE_NAME,
  status: UPDATE_STATUS
};

// Query parameters for invalid input (e.g., invalid enum status)
const invalidStatusQueryParams = {
  name: UPDATE_NAME,
  status: 'invalid_status_value' // Not in enum
};

// Invalid petId for path parameter
const invalidPathPetId = 'notanid';

// -------------------- 1. FORM (Query Params) → JSON --------------------
test.describe(`/pet/{petId} - POST FORM (Query Params) → JSON`, () => {
  test('200 - Successful operation', async ({ request, baseURL }) => {
    const response = await request.post(`${baseURL}/pet/${PATH_PET_ID}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      params: successQueryParams
    });

    const body = await response.json();
    console.log(`200 FORM (Query Params)→JSON Request: Path: /pet/${PATH_PET_ID}, Query Params: { name=${successQueryParams.name}, status=${successQueryParams.status} }`);
    console.log(`200 FORM (Query Params)→JSON Response:`, body);
    expect(response.status()).toBe(200);
    expect(body).toHaveProperty('id');
    expect(body).toHaveProperty('name', UPDATE_NAME);
    expect(body).toHaveProperty('status', UPDATE_STATUS);
    expect(body).toHaveProperty('photoUrls');
    expect(Array.isArray(body.photoUrls)).toBe(true);
  });

  test('400 - Invalid input (Invalid petId path parameter)', async ({ request, baseURL }) => {
    const response = await request.post(`${baseURL}/pet/${invalidPathPetId}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      params: successQueryParams
    });
    console.log(`400 FORM (Query Params)→JSON Request: Path: /pet/${invalidPathPetId}, Query Params: { name=${successQueryParams.name}, status=${successQueryParams.status} }`);
    console.log(`400 FORM (Query Params)→JSON Response:`, await response.text());
    expect(response.status()).toBe(400);
  });

  test('400 - Invalid input (Invalid status query parameter)', async ({ request, baseURL }) => {
    const response = await request.post(`${baseURL}/pet/${PATH_PET_ID}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      params: invalidStatusQueryParams
    });
    console.log(`400 FORM (Query Params)→JSON Request: Path: /pet/${PATH_PET_ID}, Query Params: { name=${invalidStatusQueryParams.name}, status=${invalidStatusQueryParams.status} }`);
    console.log(`400 FORM (Query Params)→JSON Response:`, await response.text());
    expect(response.status()).toBe(400);
  });

  test('default - Unexpected error', async ({ request, baseURL }) => {
    const response = await request.post(`${baseURL}/pet/${PATH_PET_ID}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-Force-Error': 'true'
      },
      params: successQueryParams
    });

    const body = await response.json();
    console.log(`Default FORM (Query Params)→JSON Request: Path: /pet/${PATH_PET_ID}, Query Params: { name=${successQueryParams.name}, status=${successQueryParams.status} }`);
    console.log(`Default FORM (Query Params)→JSON Response:`, body);
    expect([500, 501, 502, 503]).toContain(response.status());
    expect(body).toHaveProperty('code');
    expect(body).toHaveProperty('message');
  });
});

// -------------------- 2. FORM (Query Params) → XML --------------------
test.describe(`/pet/{petId} - POST FORM (Query Params) → XML`, () => {
  test('200 - Successful operation', async ({ request, baseURL }) => {
    const response = await request.post(`${baseURL}/pet/${PATH_PET_ID}`, {
      headers: {
        'Accept': 'application/xml',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      params: successQueryParams
    });

    const text = await response.text();
    console.log(`200 FORM (Query Params)→XML Request: Path: /pet/${PATH_PET_ID}, Query Params: { name=${successQueryParams.name}, status=${successQueryParams.status} }`);
    console.log(`200 FORM (Query Params)→XML Response:`, text);
    expect(response.status()).toBe(200);
    expect(text).toContain('<Pet>');
    expect(text).toContain(`<name>${UPDATE_NAME}</name>`);
    expect(text).toContain(`<status>${UPDATE_STATUS}</status>`);
    expect(text).toContain('<photoUrls>');
  });

  test('400 - Invalid input (Invalid petId path parameter)', async ({ request, baseURL }) => {
    const response = await request.post(`${baseURL}/pet/${invalidPathPetId}`, {
      headers: {
        'Accept': 'application/xml',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      params: successQueryParams
    });
    console.log(`400 FORM (Query Params)→XML Request: Path: /pet/${invalidPathPetId}, Query Params: { name=${successQueryParams.name}, status=${successQueryParams.status} }`);
    console.log(`400 FORM (Query Params)→XML Response:`, await response.text());
    expect(response.status()).toBe(400);
  });

  test('400 - Invalid input (Invalid status query parameter)', async ({ request, baseURL }) => {
    const response = await request.post(`${baseURL}/pet/${PATH_PET_ID}`, {
      headers: {
        'Accept': 'application/xml',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      params: invalidStatusQueryParams
    });
    console.log(`400 FORM (Query Params)→XML Request: Path: /pet/${PATH_PET_ID}, Query Params: { name=${invalidStatusQueryParams.name}, status=${invalidStatusQueryParams.status} }`);
    console.log(`400 FORM (Query Params)→XML Response:`, await response.text());
    expect(response.status()).toBe(400);
  });

  test('default - Unexpected error', async ({ request, baseURL }) => {
    const response = await request.post(`${baseURL}/pet/${PATH_PET_ID}`, {
      headers: {
        'Accept': 'application/xml',
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-Force-Error': 'true'
      },
      params: successQueryParams
    });
    console.log(`Default FORM (Query Params)→XML Request: Path: /pet/${PATH_PET_ID}, Query Params: { name=${successQueryParams.name}, status=${successQueryParams.status} }`);
    console.log(`Default FORM (Query Params)→XML Response:`, await response.text());
    expect([500, 501, 502, 503]).toContain(response.status());
  });
});
