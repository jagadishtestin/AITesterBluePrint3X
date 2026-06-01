# Restful Booker API Test Framework

Enterprise-grade API testing automation framework using Playwright Test and JavaScript for comprehensive testing of the Restful Booker API.

## 📋 Table of Contents

- [Overview](#overview)
- [Project Structure](#project-structure)
- [Quick Start](#quick-start)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running Tests](#running-tests)
- [Test Coverage](#test-coverage)
- [Architecture](#architecture)
- [API Modules](#api-modules)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)

## 🎯 Overview

This framework provides:

✅ **Full CRUD Testing** - Create, Read, Update, Delete operations  
✅ **Authentication Management** - Token generation and Bearer auth  
✅ **Comprehensive Assertions** - Custom validation helpers  
✅ **Test Data Factory** - Reusable payload builders  
✅ **Structured Logging** - Request/response debugging  
✅ **40+ Test Cases** - Happy path and negative scenarios  
✅ **Production Ready** - Enterprise-grade code quality  
✅ **Modular Design** - Easy to extend for other APIs  

## 📁 Project Structure

```
restful-booker-api-tests/
├── package.json                 # Dependencies & npm scripts
├── playwright.config.js         # Playwright configuration
├── .env.example                 # Environment variables template
│
├── src/
│   ├── api/
│   │   ├── apiClient.js        # Core HTTP client (GET, POST, PUT, PATCH, DELETE)
│   │   ├── authManager.js      # Authentication & token management
│   │   └── endpoints.js        # API endpoint constants
│   │
│   ├── utils/
│   │   ├── testDataBuilder.js  # Test payload factory with valid/invalid data
│   │   ├── assertionHelper.js  # Custom assertion methods
│   │   └── logger.js           # Request/response logging
│   │
│   └── tests/
│       ├── auth.spec.js        # Authentication tests (10 tests)
│       ├── booking-crud.spec.js # CRUD operations (30 tests)
│       └── booking-filters.spec.js # Query filters (22 tests)
│
├── test-results/               # Generated test reports (HTML)
└── README.md                   # This file
```

## 🚀 Quick Start

### 1. **Clone/Download Framework**
```bash
cd restful-booker-api-tests
```

### 2. **Install Dependencies**
```bash
npm install
```

### 3. **Setup Environment**
```bash
cp .env.example .env
# Edit .env with your API credentials if needed
```

### 4. **Run All Tests**
```bash
npm test
```

### 5. **View Report**
```bash
npm run test:report
```

## 📦 Installation

### Prerequisites
- Node.js 16+ installed
- npm or yarn package manager

### Step-by-Step Installation

```bash
# 1. Navigate to project directory
cd restful-booker-api-tests

# 2. Install dependencies
npm install

# 3. Install Playwright browsers (first time only)
npx playwright install

# 4. Create .env file
cp .env.example .env

# 5. Run tests
npm test
```

## ⚙️ Configuration

### Environment Variables (`.env`)

```env
API_BASE_URL=https://restful-booker.herokuapp.com
API_USERNAME=admin
API_PASSWORD=password123
API_TIMEOUT=30000
ENABLE_LOGGING=true
LOG_LEVEL=info
```

### Playwright Configuration (`playwright.config.js`)

- **Test Directory**: `src/tests/`
- **Timeout**: 30 seconds per test
- **Retries**: 2 (CI), 0 (local)
- **Workers**: 3 (parallel tests)
- **Reporters**: HTML, JSON, Console

## 🧪 Running Tests

### Run All Tests
```bash
npm test
```

### Run Tests with Browser Visible
```bash
npm run test:headed
```

### Run Tests in UI Mode
```bash
npm run test:ui
```

### Debug Tests
```bash
npm run test:debug
```

### Run Specific Test File
```bash
npm run test:auth              # Authentication tests only
npm run test:booking           # CRUD operations only
npm run test:filters           # Filter/query tests only
```

### Generate HTML Report
```bash
npm run test:report
```

## 📊 Test Coverage

### Authentication Tests (10 tests)
- ✅ Valid credentials token creation
- ✅ Invalid credentials rejection
- ✅ Missing username/password validation
- ✅ Token management in AuthManager
- ✅ Authentication status verification

### CRUD Operations (30 tests)
- ✅ **Create**: Valid/invalid payloads, missing fields
- ✅ **Read**: Single/all bookings, non-existent IDs
- ✅ **Update**: Full PUT updates, partial PATCH updates
- ✅ **Delete**: Valid IDs, invalid IDs, error handling

### Filters & Queries (22 tests)
- ✅ Filter by firstname, lastname, dates
- ✅ Combined filters
- ✅ Invalid date formats
- ✅ Edge cases (special chars, long names)
- ✅ Performance benchmarks

**Total: 62+ Test Cases**

## 🏗️ Architecture

### API Client (`src/api/apiClient.js`)

Handles all HTTP operations with built-in logging and error handling:

```javascript
const apiClient = new APIClient(context);

// GET request
const response = await apiClient.get('/booking', { params: { firstname: 'John' } });

// POST request
const response = await apiClient.post('/booking', { firstname: 'Jane', ... });

// PUT request (full update)
const response = await apiClient.put('/booking/1', { ... });

// PATCH request (partial update)
const response = await apiClient.patch('/booking/1', { firstname: 'Updated' });

// DELETE request
const response = await apiClient.delete('/booking/1');
```

### Authentication Manager (`src/api/authManager.js`)

Manages token generation and session:

```javascript
const authManager = new AuthManager(context);

// Generate token
const response = await authManager.createToken('admin', 'password123');

// Set token manually
authManager.setToken(response.body.token);

// Check authentication status
if (authManager.isAuthenticated()) { ... }

// Clear token
authManager.clearToken();
```

### Test Data Builder (`src/utils/testDataBuilder.js`)

Creates reusable test payloads:

```javascript
// Valid payload
const validPayload = TestDataBuilder.createValidBookingPayload();

// Invalid payloads for negative testing
const missingName = TestDataBuilder.createInvalidBookingPayload_MissingFirstname();
const invalidDates = TestDataBuilder.createInvalidBookingPayload_CheckoutBeforeCheckin();
```

### Assertion Helper (`src/utils/assertionHelper.js`)

Custom assertions for API responses:

```javascript
AssertionHelper.assertStatusCode(response, 200);
AssertionHelper.assertResponseBodyContainsKeys(response, ['bookingid', 'booking']);
AssertionHelper.assertBookingStructure(response.body.booking);
AssertionHelper.assertTokenValid(response.body.token);
```

## 💡 Best Practices

### 1. **Always Setup Authentication**
```javascript
const authResponse = await authManager.createToken();
authManager.setToken(authResponse.body.token);
```

### 2. **Use Test Data Builder**
```javascript
// Instead of hardcoding:
const payload = TestDataBuilder.createValidBookingPayload({ firstname: 'Custom' });
```

### 3. **Use Custom Assertions**
```javascript
// Instead of expect() everywhere:
AssertionHelper.assertStatusCode(response, 200);
AssertionHelper.assertResponseBodyContainsKeys(response, ['token']);
```

### 4. **Leverage Environment Variables**
```javascript
const username = process.env.API_USERNAME || 'admin';
const baseURL = process.env.API_BASE_URL || 'https://restful-booker.herokuapp.com';
```

### 5. **Check Response Status Before Accessing Body**
```javascript
if (response.status === 200 && response.body.token) {
  authManager.setToken(response.body.token);
}
```

## 🔧 Extending the Framework

### Add New Test Suite

1. Create new file in `src/tests/myfeature.spec.js`:
```javascript
const { test } = require('@playwright/test');
const APIClient = require('../api/apiClient');
const ENDPOINTS = require('../api/endpoints');
const AssertionHelper = require('../utils/assertionHelper');

test.describe('My Feature', () => {
  let apiClient;

  test.beforeEach(async ({ playwright }) => {
    const context = await playwright.request.newContext();
    apiClient = new APIClient(context);
  });

  test('TC_MY_001: Test case description', async () => {
    const response = await apiClient.get(ENDPOINTS.BOOKING.GET_ALL);
    AssertionHelper.assertStatusCode(response, 200);
  });
});
```

2. Add npm script in `package.json`:
```json
"test:myfeature": "playwright test src/tests/myfeature.spec.js"
```

3. Run: `npm run test:myfeature`

### Add New API Endpoint

1. Add to `src/api/endpoints.js`:
```javascript
CUSTOM: {
  GET_DATA: '/custom/endpoint',
  CREATE_DATA: '/custom/endpoint'
}
```

2. Use in tests:
```javascript
const response = await apiClient.get(ENDPOINTS.CUSTOM.GET_DATA);
```

## 🐛 Troubleshooting

### Issue: "Cannot find module 'dotenv'"
**Solution**: Run `npm install`

### Issue: "Playwright not found"
**Solution**: Run `npx playwright install`

### Issue: "API connection timeout"
**Solution**: 
- Check `API_BASE_URL` in `.env`
- Verify internet connection
- Increase `API_TIMEOUT` in `.env`

### Issue: "Token creation fails"
**Solution**:
- Verify `API_USERNAME` and `API_PASSWORD` in `.env`
- Check if API server is running

### Issue: "Tests pass locally but fail in CI/CD"
**Solution**:
- Set `CI=true` environment variable
- Use absolute paths for file operations
- Check for hardcoded URLs/credentials

## 📚 Additional Resources

- [Playwright Documentation](https://playwright.dev)
- [Restful Booker API Docs](https://restful-booker.herokuapp.com/apidoc)
- [Test Best Practices](https://playwright.dev/docs/best-practices)
- [API Testing Guide](https://restful-booker.herokuapp.com/)

## 📝 License

MIT License - Feel free to use and modify

## 👥 Contributing

Contributions welcome! Please follow the code style and add tests for new features.

## 📧 Support

For issues or questions, please refer to the test cases and inline documentation.

---

**Framework Version**: 1.0.0  
**Last Updated**: June 2026  
**Playwright Version**: ^1.40.0
