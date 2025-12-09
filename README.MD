 
# 🧪 QA REST Automation Testing Workflow

This repository contains an automated **REST API testing framework** powered by **Playwright**.  
It is designed to:  

- Parse **Swagger/OpenAPI** specifications  
- Auto-generate **Playwright tests** for each endpoint  
- Validate **request → response content-types** (JSON / XML)  
- Produce detailed reports with **Allure**  
- Support **CI/CD integration**  

---

## RESTful API Demo

This is a sample OpenAPI 3.0.3 specification for [https://restful-api.dev/](https://restful-api.dev/).
It provides endpoints for creating, reading, updating, and deleting demo items.

## 📌 API Overview
- **Version:** 1.0.0
- **Base URLs:** https://api.restful-api.dev

## 🚀 Endpoints
- `GET /objects` → Get all objects
- `POST /objects` → Create a new object
- `GET /objects/{id}` → Get object by ID
- `PUT /objects/{id}` → Update an existing object
- `DELETE /objects/{id}` → Delete an object

---

## 🔑 Authentication
No authentication required.

---

## ⚙️ Content Types
- **Requests:** application/json, application/xml, application/x-www-form-urlencoded
- **Responses:** application/json, application/xml

---
## 📂Playwright Project Structure

```bash
.github/workflows/playwright.yml
allure-report/
allure-results/
node_modules/
test-results/
tests/
  ├── pet_findByStatus_GET.spec.js
  ├── pet_findByTags_GET.spec.js
  ├── pet_petId_DELETE.spec.js
  ├── pet_petId_GET.spec.js
  ├── pet_petId_POST.spec.js
 
.env
.gitignore
auth.json
global-setup.js
package.json
package-lock.json
playwright.config.js
README.md
```

## 🧪 How to Test (with Playwright)

Playwright tests can be auto-generated to cover:
- Each path and method
- All request/response content-type combinations (json/xml)
- Valid and invalid payloads

Run tests:
```bash
npx playwright test
npx allure generate ./allure-results --clean -o ./allure-report
npx allure open ./allure-report
```



