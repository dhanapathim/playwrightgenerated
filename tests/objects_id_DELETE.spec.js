import { expect } from '@playwright/test'
import { test } from '../fixtures/apiWithAllure'

// For a DELETE operation, we need an ID that might exist or clearly not exist.
// In a real testing scenario, an object would typically be created first (via POST)
// and its ID used for deletion, or a known test ID would be used.
const existingObjectId = 'some-valid-object-id-to-delete'; // Placeholder: Replace with a real ID if the API allows it or setup a prerequisite.
const nonExistentObjectId = 'non-existent-id-000';

// -------------------- 1. DELETE --------------------
test.describe('/objects/{id} - DELETE', () => {
  test('200 - Object deleted successfully', async ({ request, baseURL }) => {
    const objectId = existingObjectId;
    const response = await request.delete(`${baseURL}/objects/${objectId}`);

    // DELETE 200 usually returns an empty body or a simple message.
    // Since no content type is specified for 200, we'll check the status and log the text.
    console.log(`200 DELETE: Object with ID ${objectId} deletion attempt. Response status: ${response.status()}, Body: ${await response.text()}`);
    expect(response.status()).toBe(200);
    // Optionally, if the API returns a specific message:
    // expect(await response.text()).toContain('Object deleted successfully');
  });

  test('404 - Object not found', async ({ request, baseURL }) => {
    const objectId = nonExistentObjectId;
    const response = await request.delete(`${baseURL}/objects/${objectId}`);

    console.log(`404 DELETE: Object with ID ${objectId} deletion attempt. Response status: ${response.status()}, Body: ${await response.text()}`);
    expect(response.status()).toBe(404);
    // Optionally, if the API returns a specific error message:
    // expect(await response.text()).toContain('Object not found');
  });
});