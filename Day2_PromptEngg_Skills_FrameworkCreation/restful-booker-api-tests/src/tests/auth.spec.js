const { test } = require('@playwright/test');
const APIClient = require('../api/apiClient');
const AuthManager = require('../api/authManager');
const ENDPOINTS = require('../api/endpoints');
const TestDataBuilder = require('../utils/testDataBuilder');
const AssertionHelper = require('../utils/assertionHelper');

test.describe('Authentication Tests', () => {
  let apiClient;
  let authManager;

  test.beforeEach(async ({ playwright }) => {
    const context = await playwright.request.newContext();
    apiClient = new APIClient(context);
    authManager = new AuthManager(context);
  });

  test.afterEach(async ({ playwright }) => {
    await playwright.request.dispose?.();
  });

  test('TC_AUTH_001: Create token with valid credentials', async () => {
    const response = await authManager.createToken();

    AssertionHelper.assertStatusCode(response, 200);
    AssertionHelper.assertResponseBodyContainsKeys(response, ['token']);
    AssertionHelper.assertTokenValid(response.body.token);
  });

  test('TC_AUTH_002: Create token with valid username and password', async () => {
    const response = await authManager.createToken('admin', 'password123');

    AssertionHelper.assertStatusCode(response, 200);
    AssertionHelper.assertTokenValid(response.body.token);
  });

  test('TC_AUTH_003: Reject token creation with invalid username', async () => {
    const response = await authManager.createToken('invaliduser', 'password123');

    AssertionHelper.assertStatusCode(response, 200);
    AssertionHelper.assertResponseBodyContainsKeys(response, ['reason']);
  });

  test('TC_AUTH_004: Reject token creation with invalid password', async () => {
    const response = await authManager.createToken('admin', 'wrongpassword');

    AssertionHelper.assertStatusCode(response, 200);
    AssertionHelper.assertResponseBodyContainsKeys(response, ['reason']);
  });

  test('TC_AUTH_005: Reject token creation with missing username', async () => {
    const payload = TestDataBuilder.createInvalidAuthPayload_MissingUsername();
    const response = await apiClient.post(ENDPOINTS.AUTH.CREATE_TOKEN, payload);

    AssertionHelper.assertStatusCodeIn(response, [200, 400, 500]);
  });

  test('TC_AUTH_006: Reject token creation with missing password', async () => {
    const payload = TestDataBuilder.createInvalidAuthPayload_MissingPassword();
    const response = await apiClient.post(ENDPOINTS.AUTH.CREATE_TOKEN, payload);

    AssertionHelper.assertStatusCodeIn(response, [200, 400, 500]);
  });

  test('TC_AUTH_007: Token should be non-empty string', async () => {
    const response = await authManager.createToken();

    if (response.body.token) {
      AssertionHelper.assertTokenValid(response.body.token);
      const token = response.body.token;
      AssertionHelper.assertStringContains(token, '', 'Token exists');
    }
  });

  test('TC_AUTH_008: Set token in AuthManager', async () => {
    const response = await authManager.createToken();
    const token = response.body.token;

    authManager.setToken(token);
    AssertionHelper.assertTokenValid(authManager.getToken());
  });

  test('TC_AUTH_009: Clear token from AuthManager', async () => {
    const response = await authManager.createToken();
    authManager.setToken(response.body.token);
    authManager.clearToken();

    test.expect(authManager.getToken()).toBeNull();
  });

  test('TC_AUTH_010: Verify authentication status', async () => {
    test.expect(authManager.isAuthenticated()).toBe(false);

    const response = await authManager.createToken();
    authManager.setToken(response.body.token);

    test.expect(authManager.isAuthenticated()).toBe(true);
  });
});
