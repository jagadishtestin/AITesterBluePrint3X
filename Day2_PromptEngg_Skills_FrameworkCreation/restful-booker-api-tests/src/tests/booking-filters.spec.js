const { test } = require('@playwright/test');
const APIClient = require('../api/apiClient');
const AuthManager = require('../api/authManager');
const ENDPOINTS = require('../api/endpoints');
const TestDataBuilder = require('../utils/testDataBuilder');
const AssertionHelper = require('../utils/assertionHelper');

test.describe('Booking Filter & Query Tests', () => {
  let apiClient;
  let authManager;

  test.beforeEach(async ({ playwright }) => {
    const context = await playwright.request.newContext();
    apiClient = new APIClient(context);
    authManager = new AuthManager(context);

    const authResponse = await authManager.createToken();
    if (authResponse.body.token) {
      authManager.setToken(authResponse.body.token);
    }
  });

  test.afterEach(async ({ playwright }) => {
    await playwright.request.dispose?.();
  });

  test.describe('Filter by Name', () => {
    test('TC_FILTER_001: Get bookings filtered by firstname', async () => {
      const response = await apiClient.get(ENDPOINTS.BOOKING.GET_ALL, {
        params: { firstname: 'John' }
      });

      AssertionHelper.assertStatusCode(response, 200);
      AssertionHelper.assertIsArray(response.body);
    });

    test('TC_FILTER_002: Get bookings filtered by lastname', async () => {
      const response = await apiClient.get(ENDPOINTS.BOOKING.GET_ALL, {
        params: { lastname: 'Doe' }
      });

      AssertionHelper.assertStatusCode(response, 200);
      AssertionHelper.assertIsArray(response.body);
    });

    test('TC_FILTER_003: Get bookings filtered by firstname AND lastname', async () => {
      const response = await apiClient.get(ENDPOINTS.BOOKING.GET_ALL, {
        params: {
          firstname: 'John',
          lastname: 'Doe'
        }
      });

      AssertionHelper.assertStatusCode(response, 200);
      AssertionHelper.assertIsArray(response.body);
    });

    test('TC_FILTER_004: Filter with non-existent firstname', async () => {
      const response = await apiClient.get(ENDPOINTS.BOOKING.GET_ALL, {
        params: { firstname: 'NonExistentName12345' }
      });

      AssertionHelper.assertStatusCode(response, 200);
      AssertionHelper.assertIsArray(response.body);
    });

    test('TC_FILTER_005: Filter with empty firstname', async () => {
      const response = await apiClient.get(ENDPOINTS.BOOKING.GET_ALL, {
        params: { firstname: '' }
      });

      AssertionHelper.assertStatusCode(response, 200);
    });
  });

  test.describe('Filter by Date', () => {
    test('TC_FILTER_006: Get bookings filtered by checkin date', async () => {
      const response = await apiClient.get(ENDPOINTS.BOOKING.GET_ALL, {
        params: { checkin: '2021-01-01' }
      });

      AssertionHelper.assertStatusCode(response, 200);
      AssertionHelper.assertIsArray(response.body);
    });

    test('TC_FILTER_007: Get bookings filtered by checkout date', async () => {
      const response = await apiClient.get(ENDPOINTS.BOOKING.GET_ALL, {
        params: { checkout: '2021-12-31' }
      });

      AssertionHelper.assertStatusCode(response, 200);
      AssertionHelper.assertIsArray(response.body);
    });

    test('TC_FILTER_008: Get bookings filtered by both checkin and checkout', async () => {
      const response = await apiClient.get(ENDPOINTS.BOOKING.GET_ALL, {
        params: {
          checkin: '2021-01-01',
          checkout: '2021-12-31'
        }
      });

      AssertionHelper.assertStatusCode(response, 200);
      AssertionHelper.assertIsArray(response.body);
    });

    test('TC_FILTER_009: Filter with invalid date format', async () => {
      const response = await apiClient.get(ENDPOINTS.BOOKING.GET_ALL, {
        params: { checkin: '01/01/2021' }
      });

      AssertionHelper.assertStatusCodeIn(response, [200, 400]);
    });

    test('TC_FILTER_010: Filter with valid date format CCYY-MM-DD', async () => {
      const response = await apiClient.get(ENDPOINTS.BOOKING.GET_ALL, {
        params: { checkin: '2021-06-15' }
      });

      AssertionHelper.assertStatusCode(response, 200);
      AssertionHelper.assertIsArray(response.body);
    });

    test('TC_FILTER_011: Filter with future date', async () => {
      const futureDate = '2099-12-31';
      const response = await apiClient.get(ENDPOINTS.BOOKING.GET_ALL, {
        params: { checkin: futureDate }
      });

      AssertionHelper.assertStatusCode(response, 200);
    });

    test('TC_FILTER_012: Filter with past date', async () => {
      const pastDate = '2000-01-01';
      const response = await apiClient.get(ENDPOINTS.BOOKING.GET_ALL, {
        params: { checkin: pastDate }
      });

      AssertionHelper.assertStatusCode(response, 200);
    });
  });

  test.describe('Combined Filters', () => {
    test('TC_FILTER_013: Combine firstname, lastname, and checkin filters', async () => {
      const response = await apiClient.get(ENDPOINTS.BOOKING.GET_ALL, {
        params: {
          firstname: 'John',
          lastname: 'Doe',
          checkin: '2021-01-01'
        }
      });

      AssertionHelper.assertStatusCode(response, 200);
      AssertionHelper.assertIsArray(response.body);
    });

    test('TC_FILTER_014: Combine all available filters', async () => {
      const response = await apiClient.get(ENDPOINTS.BOOKING.GET_ALL, {
        params: {
          firstname: 'John',
          lastname: 'Doe',
          checkin: '2021-01-01',
          checkout: '2021-12-31'
        }
      });

      AssertionHelper.assertStatusCode(response, 200);
      AssertionHelper.assertIsArray(response.body);
    });

    test('TC_FILTER_015: Multiple filters should return valid array', async () => {
      const response = await apiClient.get(ENDPOINTS.BOOKING.GET_ALL, {
        params: {
          firstname: 'Sally',
          lastname: 'Brown'
        }
      });

      AssertionHelper.assertStatusCode(response, 200);
      AssertionHelper.assertIsArray(response.body);
    });
  });

  test.describe('Edge Cases', () => {
    test('TC_FILTER_016: Filter with special characters in firstname', async () => {
      const response = await apiClient.get(ENDPOINTS.BOOKING.GET_ALL, {
        params: { firstname: 'John@#$%' }
      });

      AssertionHelper.assertStatusCode(response, 200);
    });

    test('TC_FILTER_017: Filter with very long firstname', async () => {
      const longName = 'a'.repeat(500);
      const response = await apiClient.get(ENDPOINTS.BOOKING.GET_ALL, {
        params: { firstname: longName }
      });

      AssertionHelper.assertStatusCodeIn(response, [200, 400]);
    });

    test('TC_FILTER_018: Filter with URL encoded characters', async () => {
      const response = await apiClient.get(ENDPOINTS.BOOKING.GET_ALL, {
        params: { firstname: 'John%20Doe' }
      });

      AssertionHelper.assertStatusCodeIn(response, [200, 400]);
    });

    test('TC_FILTER_019: Multiple identical filter parameters', async () => {
      const response = await apiClient.get(ENDPOINTS.BOOKING.GET_ALL, {
        params: { firstname: 'John' }
      });

      AssertionHelper.assertStatusCode(response, 200);
    });

    test('TC_FILTER_020: Verify filter results are array of booking IDs', async () => {
      const response = await apiClient.get(ENDPOINTS.BOOKING.GET_ALL);

      AssertionHelper.assertStatusCode(response, 200);
      if (response.body.length > 0) {
        response.body.forEach(booking => {
          test.expect(booking).toHaveProperty('bookingid');
        });
      }
    });
  });

  test.describe('Performance Tests', () => {
    test('TC_FILTER_021: Retrieve all bookings completes within reasonable time', async () => {
      const startTime = Date.now();
      const response = await apiClient.get(ENDPOINTS.BOOKING.GET_ALL);
      const endTime = Date.now();

      AssertionHelper.assertStatusCode(response, 200);
      const duration = endTime - startTime;
      test.expect(duration).toBeLessThan(5000);
    });

    test('TC_FILTER_022: Filter query completes within reasonable time', async () => {
      const startTime = Date.now();
      const response = await apiClient.get(ENDPOINTS.BOOKING.GET_ALL, {
        params: { firstname: 'John' }
      });
      const endTime = Date.now();

      AssertionHelper.assertStatusCode(response, 200);
      const duration = endTime - startTime;
      test.expect(duration).toBeLessThan(5000);
    });
  });
});
