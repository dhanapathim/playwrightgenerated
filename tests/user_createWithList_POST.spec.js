import { expect } from '@playwright/test'
import { test } from '../fixtures/apiWithAllure'

const exampleUserListJson = [
  {
    id: 1,
    username: 'user1',
    firstName: 'Alice',
    lastName: 'Smith',
    email: 'alice@example.com',
    password: 'password1',
    phone: '111-222-3333',
    userStatus: 1
  },
  {
    id: 2,
    username: 'user2',
    firstName: 'Bob',
    lastName: 'Johnson',
    email: 'bob@example.com',
    password: 'password2',
    phone: '444-555-6666',
    userStatus: 1
  }
];

const exampleSingleUserJson = { // Based on the 200 response schema for a single User object
  id: 1,
  username: 'user1',
  firstName: 'Alice',
  lastName: 'Smith',
  email: 'alice@example.com',
  password: 'password1',
  phone: '111-222-3333',
  userStatus: 1
};

const exampleSingleUserXml = `<?xml version="1.0" encoding="UTF-8"?>
<User>
  <id>1</id>
  <username>user1</username>
  <firstName>Alice</firstName>
  <lastName>Smith</lastName>
  <email>alice@example.com</email>
  <password>password1</password>
  <phone>111-222-3333</phone>
  <userStatus>1</userStatus>
</User>`;

const invalidUserListJson = [ // Invalid data to trigger errors or test schema validation
  {
    id: 'notAnId',
    username: '',
    firstName: 'John',
    lastName: 'Doe',
    email: 'invalid-email',
    password: '123',
    phone: 'short',
    userStatus: 'abc'
  },
  {} // Empty object in the array
];

// -------------------- 1. JSON Request → JSON Response --------------------
test.describe('/user/createWithList - POST JSON → JSON', () => {
  test('200 - Successful operation', async ({ request, baseURL }) => {
    const requestPayload = exampleUserListJson;
    const response = await request.post(`${baseURL}/user/createWithList`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      data: requestPayload
    });

    const body = await response.json();
    console.log('Request Payload:', requestPayload);
    console.log('200 JSON→JSON:', body);
    expect(response.status()).toBe(200);
    expect(body).toHaveProperty('id');
    expect(body).toHaveProperty('username', exampleSingleUserJson.username);
    expect(body).toHaveProperty('firstName', exampleSingleUserJson.firstName);
    expect(body).toHaveProperty('lastName', exampleSingleUserJson.lastName);
    expect(body).toHaveProperty('email', exampleSingleUserJson.email);
    expect(body).toHaveProperty('password', exampleSingleUserJson.password);
    expect(body).toHaveProperty('phone', exampleSingleUserJson.phone);
    expect(body).toHaveProperty('userStatus', exampleSingleUserJson.userStatus);
  });

  test('default - Unexpected error', async ({ request, baseURL }) => {
    const requestPayload = invalidUserListJson;
    const response = await request.post(`${baseURL}/user/createWithList`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-Force-Error': 'true'
      },
      data: requestPayload
    });

    const body = await response.json();
    console.log('Request Payload:', requestPayload);
    console.log('Default JSON→JSON:', body);
    expect([500, 501, 502, 503]).toContain(response.status());
    expect(body).toHaveProperty('code');
    expect(body).toHaveProperty('message');
  });
});

// -------------------- 2. JSON Request → XML Response --------------------
test.describe('/user/createWithList - POST JSON → XML', () => {
  test('200 - Successful operation', async ({ request, baseURL }) => {
    const requestPayload = exampleUserListJson;
    const response = await request.post(`${baseURL}/user/createWithList`, {
      headers: {
        'Accept': 'application/xml',
        'Content-Type': 'application/json',
      },
      data: requestPayload
    });

    const text = await response.text();
    console.log('Request Payload:', requestPayload);
    console.log('200 JSON→XML:', text);
    expect(response.status()).toBe(200);
    expect(text).toContain('<User>');
    expect(text).toContain('<id>1</id>');
    expect(text).toContain('<username>user1</username>');
    expect(text).toContain('<firstName>Alice</firstName>');
    expect(text).toContain('<lastName>Smith</lastName>');
    expect(text).toContain('<email>alice@example.com</email>');
    expect(text).toContain('<password>password1</password>');
    expect(text).toContain('<phone>111-222-3333</phone>');
    expect(text).toContain('<userStatus>1</userStatus>');
  });

  test('default - Unexpected error', async ({ request, baseURL }) => {
    const requestPayload = invalidUserListJson;
    const response = await request.post(`${baseURL}/user/createWithList`, {
      headers: {
        'Accept': 'application/xml',
        'Content-Type': 'application/json',
        'X-Force-Error': 'true'
      },
      data: requestPayload
    });

    const text = await response.text();
    console.log('Request Payload:', requestPayload);
    console.log('Default JSON→XML:', text);
    expect([500, 501, 502, 503]).toContain(response.status());
  });
});
