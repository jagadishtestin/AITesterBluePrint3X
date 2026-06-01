**Objective**: Generate a comprehensive API testing automation framework from scratch using Playwright with JavaScript, covering full CRUD operations with enterprise-level standards and best practices.

**R - Role**

You are a QA automation engineer with 15+ years of experience in API testing and backend automation. You have deep expertise in RESTful API design, HTTP protocols, JSON/XML handling, and testing frameworks like Playwright, Mocha, and Chai. You understand API security, authentication mechanisms, and performance testing. You need to create a framework with Playwright Test, JavaScript, Node.js, npm, and it should be an enterprise-level framework.

**I - Instructions**

Generate a complete Playwright Test API automation framework following enterprise-level standards.
Automate and verify results for all CRUD operations (GET, POST, PUT, PATCH, DELETE) on a generic RESTful API.
Ensure comprehensive testing with valid and invalid test cases, edge cases, and error scenarios.
[Critical] - Apply proper test structure with `test.describe()`, `test.beforeEach()`, `test.afterEach()` and necessary setup/teardown logic.
[Critical] - Implement robust exception handling using try-catch blocks with meaningful error messages and assertions.
[Critical] - Use API request builder pattern for reusable and maintainable API client with proper headers, authentication, and payload management.
[Mandatory] - Create separate modules for: API Client, Test Data Builder, Assertion Helpers, and Test Utilities.
[Mandatory] - Use only RESTful API endpoints (no UI elements); validate responses using status codes, headers, and JSON body parsing.
[Mandatory] - Implement proper authentication handling (Bearer tokens, Basic auth, API keys).
[Mandatory] - Use only Playwright's built-in `APIRequestContext` for API calls; no external HTTP libraries.
[Output] - Output only runnable code—no explanations, comments, dependencies, or extra text beyond code blocks.
[Don't] - Don't use sleep/delay functions; rely on proper wait mechanisms and response validation.
[Don't] - Don't hardcode credentials or tokens; use environment variables or config files.
[Don't] - Don't add unnecessary comments or console.log statements in production code.
[Generate] - Generate 4 separate files: API Client Helper, Test Data Builder, Assertion Utilities, Complete Test Suite.
Maintain consistent code style, proper error handling, logging, and modularity.
Support multiple content types: application/json, application/xml, application/x-www-form-urlencoded.
Implement request/response logging for debugging and CI/CD pipeline integration.

**C — Context**

You are building a comprehensive API testing framework for a generic RESTful API with multiple endpoints supporting CRUD operations. The API includes:
- Authentication endpoints (login, token generation)
- Resource endpoints (Create, Read, Update, Delete resources)
- Query parameters, path parameters, and request body payloads
- Different response formats (JSON, XML)
- Error responses (400, 401, 403, 404, 500, etc.)
- Both valid test cases (happy path) and invalid scenarios (negative testing)

The framework should be production-ready, scalable, maintainable, and follow industry best practices.

**E — Example**

**Example 1: API Client Helper Structure**

```javascript
const { APIRequestContext } = require('@playwright/test');

class APIClient {
  constructor(baseURL, config = {}) {
    this.baseURL = baseURL;
    this.headers = config.headers || {};
    this.timeout = config.timeout || 30000;
    this.retryCount = config.retryCount || 0;
    this.token = null;
  }

  setAuthToken(token, type = 'Bearer') {
    this.token = token;
    this.headers.Authorization = `${type} ${token}`;
  }

  async request(method, endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const requestOptions = {
      method,
      headers: { 'Content-Type': 'application/json', ...this.headers, ...options.headers },
      timeout: options.timeout || this.timeout,
    };

    if (options.body) {
      requestOptions.data = options.body;
    }

    if (options.params) {
      const queryString = new URLSearchParams(options.params).toString();
      url += `?${queryString}`;
    }

    try {
      const response = await this.apiContext.fetch(url, requestOptions);
      return {
        status: response.status(),
        headers: response.headers(),
        body: await response.json().catch(() => response.text()),
      };
    } catch (error) {
      throw new Error(`API request failed: ${error.message}`);
    }
  }

  async get(endpoint, options = {}) {
    return this.request('GET', endpoint, options);
  }

  async post(endpoint, body, options = {}) {
    return this.request('POST', endpoint, { ...options, body });
  }

  async put(endpoint, body, options = {}) {
    return this.request('PUT', endpoint, { ...options, body });
  }

  async patch(endpoint, body, options = {}) {
    return this.request('PATCH', endpoint, { ...options, body });
  }

  async delete(endpoint, options = {}) {
    return this.request('DELETE', endpoint, options);
  }
}

module.exports = APIClient;
```

**Example 2: Test Data Builder**

```javascript
class TestDataBuilder {
  static createUserPayload(overrides = {}) {
    return {
      firstname: 'John',
      lastname: 'Doe',
      email: 'john.doe@example.com',
      ...overrides,
    };
  }

  static createResourcePayload(overrides = {}) {
    return {
      name: 'Resource Name',
      description: 'Test Description',
      active: true,
      ...overrides,
    };
  }

  static createAuthPayload() {
    return {
      username: process.env.API_USERNAME || 'admin',
      password: process.env.API_PASSWORD || 'password123',
    };
  }
}

module.exports = TestDataBuilder;
```

**Example 3: Assertion Utilities**

```javascript
class AssertionHelper {
  static assertStatusCode(response, expectedStatus) {
    if (response.status !== expectedStatus) {
      throw new Error(`Expected status ${expectedStatus}, got ${response.status}`);
    }
  }

  static assertResponseBodyContains(response, expectedKeys) {
    expectedKeys.forEach(key => {
      if (!(key in response.body)) {
        throw new Error(`Response body missing key: ${key}`);
      }
    });
  }

  static assertResponseHeader(response, headerName, expectedValue) {
    const actualValue = response.headers[headerName.toLowerCase()];
    if (actualValue !== expectedValue) {
      throw new Error(`Header ${headerName}: expected ${expectedValue}, got ${actualValue}`);
    }
  }

  static assertJsonStructure(data, schema) {
    Object.keys(schema).forEach(key => {
      if (typeof data[key] !== typeof schema[key]) {
        throw new Error(`Type mismatch for ${key}`);
      }
    });
  }
}

module.exports = AssertionHelper;
```

**Example 4: Comprehensive Test Suite**

```javascript
const { test, expect } = require('@playwright/test');
const APIClient = require('./apiClient');
const TestDataBuilder = require('./testDataBuilder');
const AssertionHelper = require('./assertionHelper');

test.describe('API CRUD Operations', () => {
  let apiClient;
  let resourceId;

  test.beforeEach(async ({ playwright }) => {
    const context = await playwright.request.newContext({
      baseURL: process.env.API_BASE_URL || 'https://api.example.com',
    });
    apiClient = new APIClient(process.env.API_BASE_URL, { apiContext: context });
  });

  test.describe('Authentication', () => {
    test('TC_AUTH_001: Login with valid credentials', async () => {
      const payload = TestDataBuilder.createAuthPayload();
      const response = await apiClient.post('/auth/login', payload);

      AssertionHelper.assertStatusCode(response, 200);
      AssertionHelper.assertResponseBodyContains(response, ['token', 'user']);
      
      apiClient.setAuthToken(response.body.token);
      expect(response.body.token).toBeTruthy();
    });

    test('TC_AUTH_002: Login with invalid credentials', async () => {
      const payload = { username: 'invalid', password: 'wrong' };
      const response = await apiClient.post('/auth/login', payload);

      AssertionHelper.assertStatusCode(response, 401);
      expect(response.body.error).toBeDefined();
    });
  });

  test.describe('Create Resource (POST)', () => {
    test('TC_CREATE_001: Create resource with valid payload', async () => {
      const payload = TestDataBuilder.createResourcePayload();
      const response = await apiClient.post('/resources', payload);

      AssertionHelper.assertStatusCode(response, 201);
      AssertionHelper.assertResponseBodyContains(response, ['id', 'name']);
      
      resourceId = response.body.id;
      expect(resourceId).toBeGreaterThan(0);
    });

    test('TC_CREATE_002: Create resource with missing required field', async () => {
      const payload = TestDataBuilder.createResourcePayload({ name: null });
      const response = await apiClient.post('/resources', payload);

      AssertionHelper.assertStatusCode(response, 400);
      expect(response.body.error).toContain('name is required');
    });
  });

  test.describe('Read Resource (GET)', () => {
    test('TC_READ_001: Get resource by ID', async () => {
      const response = await apiClient.get('/resources/1');

      AssertionHelper.assertStatusCode(response, 200);
      AssertionHelper.assertResponseBodyContains(response, ['id', 'name']);
    });

    test('TC_READ_002: Get non-existent resource', async () => {
      const response = await apiClient.get('/resources/99999');

      AssertionHelper.assertStatusCode(response, 404);
      expect(response.body.error).toContain('not found');
    });

    test('TC_READ_003: Get all resources with pagination', async () => {
      const response = await apiClient.get('/resources', { params: { page: 1, limit: 10 } });

      AssertionHelper.assertStatusCode(response, 200);
      expect(Array.isArray(response.body.data)).toBeTruthy();
    });
  });

  test.describe('Update Resource (PUT)', () => {
    test('TC_UPDATE_001: Update resource with valid payload', async () => {
      const payload = TestDataBuilder.createResourcePayload({ name: 'Updated Name' });
      const response = await apiClient.put('/resources/1', payload);

      AssertionHelper.assertStatusCode(response, 200);
      expect(response.body.name).toBe('Updated Name');
    });

    test('TC_UPDATE_002: Partial update resource (PATCH)', async () => {
      const payload = { description: 'Patched Description' };
      const response = await apiClient.patch('/resources/1', payload);

      AssertionHelper.assertStatusCode(response, 200);
      expect(response.body.description).toBe('Patched Description');
    });

    test('TC_UPDATE_003: Update non-existent resource', async () => {
      const payload = TestDataBuilder.createResourcePayload();
      const response = await apiClient.put('/resources/99999', payload);

      AssertionHelper.assertStatusCode(response, 404);
    });
  });

  test.describe('Delete Resource (DELETE)', () => {
    test('TC_DELETE_001: Delete existing resource', async () => {
      const response = await apiClient.delete('/resources/1');

      AssertionHelper.assertStatusCode(response, 204);
    });

    test('TC_DELETE_002: Delete non-existent resource', async () => {
      const response = await apiClient.delete('/resources/99999');

      AssertionHelper.assertStatusCode(response, 404);
    });
  });

  test.describe('Error Handling', () => {
    test('TC_ERROR_001: Handle malformed JSON response', async () => {
      try {
        const response = await apiClient.get('/malformed');
        expect(response.status).not.toBe(200);
      } catch (error) {
        expect(error.message).toBeTruthy();
      }
    });

    test('TC_ERROR_002: Handle timeout', async () => {
      try {
        await apiClient.get('/slow-endpoint', { timeout: 100 });
      } catch (error) {
        expect(error.message).toContain('timeout');
      }
    });
  });
});
```

**P — PARAMETERS**

- Production-level API test automation with pinpoint accuracy
- Zero hardcoded values (use environment variables and config files)
- Support for multiple authentication mechanisms
- Comprehensive error handling and meaningful assertions
- Reusable components for scalability
- CI/CD pipeline compatible (exit codes, structured logging)
- Performance baseline support (response time assertions)

**O — Output**

Provide only:
1. **apiClient.js** - Reusable API client with all HTTP methods
2. **testDataBuilder.js** - Test data factory for payloads
3. **assertionHelper.js** - Assertion utilities for validations
4. **tests.spec.js** - Complete test suite with valid and invalid scenarios
5. **playwright.config.js** - Playwright configuration
6. **.env.example** - Environment variables template
7. **package.json** - Dependencies and scripts

No explanations or additional content beyond code blocks.

**T — Tone**

Technical, precise, enterprise-grade, production-ready, modular, maintainable, scalable.

---

## Quick Reference

### Running Tests
```bash
npm install
npm run test                    # Run all tests
npm run test -- --headed       # Run with browser visible
npm run test:debug             # Debug mode
npm run test:report            # Generate HTML report
```

### Environment Setup
```bash
cp .env.example .env
# Update .env with your API credentials and base URL
```

### Key Features
✅ Full CRUD operations  
✅ Multiple authentication types  
✅ Request/Response logging  
✅ Retry mechanisms  
✅ Timeout handling  
✅ Structured assertions  
✅ Test data builders  
✅ Error recovery  
✅ Performance monitoring  
✅ CI/CD ready
