import { expect } from '@playwright/test'
import { test } from '../fixtures/apiWithAllure'

const objectIdToDelete = 'ff4b36a3-83a8-4c28-b1de-6eafafbc7f49' // Example ID from spec
const nonExistentObjectId = '00000000-0000-0000-0000-000000000000' // Placeholder for a non-existent ID

// -------------------- 1. DELETE --------------------
test.describe('/objects/{id} - DELETE', () => {
  test('200 - Object deleted successfully', async ({ request, baseURL }) => {
    // Note: For a real test, you would typically create an object first to ensure it exists before deleting.
    // For this example, we assume objectIdToDelete exists or the API handles it gracefully.
    const response = await request.delete(`${baseURL}/objects/${objectIdToDelete}`)
    console.log('200 DELETE:', await response.text())
    expect(response.status()).toBe(200)
  })

  test('404 - Object not found', async ({ request, baseURL }) => {
    const response = await request.delete(`${baseURL}/objects/${nonExistentObjectId}`)
    console.log('404 DELETE:', await response.text())
    expect(response.status()).toBe(404)
  })
})