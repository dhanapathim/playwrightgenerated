import { expect } from '@playwright/test'
import { test } from '../fixtures/apiWithAllure'

// -------------------- 1. No Request Body → No Response Body (Implicit) --------------------
test.describe('/objects/{id} - DELETE', () => {
  let objectIdToDelete = 'ff4b36a3-83a8-4c28-b1de-6eafafbc7f49' // Placeholder: In a real scenario, this would be fetched dynamically or created by a prerequisite POST request.
  const nonExistentObjectId = 'non-existent-id-12345'

  test('200 - Object deleted successfully', async ({ request, baseURL }) => {
    // Note: For a real test, you would likely create an object first using a POST request
    // to ensure you have a valid ID to delete, then delete it.
    // This example assumes 'objectIdToDelete' is a valid ID that can be deleted.

    const response = await request.delete(`${baseURL}/objects/${objectIdToDelete}`)

    console.log(`200 DELETE (id: ${objectIdToDelete}):`, await response.text())
    expect(response.status()).toBe(200)
    // No response body specified for 200, so no body assertions needed.
  })

  test('404 - Object not found', async ({ request, baseURL }) => {
    const response = await request.delete(`${baseURL}/objects/${nonExistentObjectId}`)

    console.log(`404 DELETE (id: ${nonExistentObjectId}):`, await response.text())
    expect(response.status()).toBe(404)
  })
})