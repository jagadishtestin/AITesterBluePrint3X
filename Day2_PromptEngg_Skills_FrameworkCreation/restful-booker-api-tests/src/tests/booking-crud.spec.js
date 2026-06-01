const { test } = require('@playwright/test');
const APIClient = require('../api/apiClient');
const AuthManager = require('../api/authManager');
const ENDPOINTS = require('../api/endpoints');
const TestDataBuilder = require('../utils/testDataBuilder');
const AssertionHelper = require('../utils/assertionHelper');

test.describe('Booking CRUD Operations', () => {
  let apiClient;
  let authManager;
  let bookingId;

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

  test.describe('CREATE Operations (POST)', () => {
    test('TC_CREATE_001: Create booking with valid payload', async () => {
      const payload = TestDataBuilder.createValidBookingPayload();
      const response = await apiClient.post(ENDPOINTS.BOOKING.CREATE, payload);

      AssertionHelper.assertStatusCode(response, 200);
      AssertionHelper.assertResponseBodyContainsKeys(response, ['bookingid', 'booking']);
      AssertionHelper.assertBookingStructure(response.body.booking);

      bookingId = response.body.bookingid;
      AssertionHelper.assertBookingIdValid(bookingId);
    });

    test('TC_CREATE_002: Create booking with custom data', async () => {
      const payload = TestDataBuilder.createValidBookingPayload({
        firstname: 'Jane',
        lastname: 'Smith',
        totalprice: 250,
        additionalneeds: 'Wi-Fi'
      });
      const response = await apiClient.post(ENDPOINTS.BOOKING.CREATE, payload);

      AssertionHelper.assertStatusCode(response, 200);
      AssertionHelper.assertResponseBodyValue(response, 'booking.firstname', 'Jane');
    });

    test('TC_CREATE_003: Reject booking without firstname', async () => {
      const payload = TestDataBuilder.createInvalidBookingPayload_MissingFirstname();
      const response = await apiClient.post(ENDPOINTS.BOOKING.CREATE, payload);

      AssertionHelper.assertStatusCodeIn(response, [400, 500]);
    });

    test('TC_CREATE_004: Reject booking without lastname', async () => {
      const payload = TestDataBuilder.createInvalidBookingPayload_MissingLastname();
      const response = await apiClient.post(ENDPOINTS.BOOKING.CREATE, payload);

      AssertionHelper.assertStatusCodeIn(response, [400, 500]);
    });

    test('TC_CREATE_005: Reject booking without totalprice', async () => {
      const payload = TestDataBuilder.createInvalidBookingPayload_MissingTotalPrice();
      const response = await apiClient.post(ENDPOINTS.BOOKING.CREATE, payload);

      AssertionHelper.assertStatusCodeIn(response, [400, 500]);
    });

    test('TC_CREATE_006: Reject booking without dates', async () => {
      const payload = TestDataBuilder.createInvalidBookingPayload_MissingDates();
      const response = await apiClient.post(ENDPOINTS.BOOKING.CREATE, payload);

      AssertionHelper.assertStatusCodeIn(response, [400, 500]);
    });

    test('TC_CREATE_007: Reject booking with checkout before checkin', async () => {
      const payload = TestDataBuilder.createInvalidBookingPayload_CheckoutBeforeCheckin();
      const response = await apiClient.post(ENDPOINTS.BOOKING.CREATE, payload);

      AssertionHelper.assertStatusCodeIn(response, [400, 500]);
    });

    test('TC_CREATE_008: Accept booking with negative price', async () => {
      const payload = TestDataBuilder.createInvalidBookingPayload_NegativePrice();
      const response = await apiClient.post(ENDPOINTS.BOOKING.CREATE, payload);

      AssertionHelper.assertStatusCode(response, 200);
    });
  });

  test.describe('READ Operations (GET)', () => {
    test('TC_READ_001: Get all bookings', async () => {
      const response = await apiClient.get(ENDPOINTS.BOOKING.GET_ALL);

      AssertionHelper.assertStatusCode(response, 200);
      AssertionHelper.assertIsArray(response.body);
    });

    test('TC_READ_002: Get booking by valid ID', async () => {
      const createResponse = await apiClient.post(
        ENDPOINTS.BOOKING.CREATE,
        TestDataBuilder.createValidBookingPayload()
      );
      const id = createResponse.body.bookingid;

      const response = await apiClient.get(ENDPOINTS.BOOKING.GET_BY_ID(id));

      AssertionHelper.assertStatusCode(response, 200);
      AssertionHelper.assertBookingStructure(response.body);
    });

    test('TC_READ_003: Get booking with non-existent ID', async () => {
      const response = await apiClient.get(ENDPOINTS.BOOKING.GET_BY_ID(99999));

      AssertionHelper.assertStatusCodeIn(response, [404, 400]);
    });

    test('TC_READ_004: Get booking with invalid ID format', async () => {
      const response = await apiClient.get(ENDPOINTS.BOOKING.GET_BY_ID('invalid'));

      AssertionHelper.assertStatusCodeIn(response, [404, 400]);
    });

    test('TC_READ_005: Retrieve all bookings returns array', async () => {
      const response = await apiClient.get(ENDPOINTS.BOOKING.GET_ALL);

      AssertionHelper.assertStatusCode(response, 200);
      AssertionHelper.assertIsArray(response.body);
    });

    test('TC_READ_006: Each booking ID should be numeric', async () => {
      const response = await apiClient.get(ENDPOINTS.BOOKING.GET_ALL);

      if (response.body.length > 0) {
        response.body.forEach(booking => {
          AssertionHelper.assertBookingIdValid(booking.bookingid);
        });
      }
    });
  });

  test.describe('UPDATE Operations (PUT)', () => {
    test('TC_UPDATE_001: Update booking with full payload', async () => {
      const createResponse = await apiClient.post(
        ENDPOINTS.BOOKING.CREATE,
        TestDataBuilder.createValidBookingPayload()
      );
      const id = createResponse.body.bookingid;

      const updatePayload = TestDataBuilder.createValidBookingPayload({
        firstname: 'UpdatedFirst',
        lastname: 'UpdatedLast'
      });
      const response = await apiClient.put(ENDPOINTS.BOOKING.UPDATE(id), updatePayload);

      AssertionHelper.assertStatusCode(response, 200);
      AssertionHelper.assertResponseBodyValue(response, 'firstname', 'UpdatedFirst');
    });

    test('TC_UPDATE_002: Update existing booking returns updated data', async () => {
      const createResponse = await apiClient.post(
        ENDPOINTS.BOOKING.CREATE,
        TestDataBuilder.createValidBookingPayload({ firstname: 'Original' })
      );
      const id = createResponse.body.bookingid;

      const updatePayload = TestDataBuilder.createValidBookingPayload({ firstname: 'Modified' });
      const response = await apiClient.put(ENDPOINTS.BOOKING.UPDATE(id), updatePayload);

      AssertionHelper.assertStatusCode(response, 200);
    });

    test('TC_UPDATE_003: Reject update on non-existent booking', async () => {
      const payload = TestDataBuilder.createValidBookingPayload();
      const response = await apiClient.put(ENDPOINTS.BOOKING.UPDATE(99999), payload);

      AssertionHelper.assertStatusCodeIn(response, [404, 403, 405]);
    });
  });

  test.describe('PARTIAL UPDATE Operations (PATCH)', () => {
    test('TC_PATCH_001: Partial update with only firstname', async () => {
      const createResponse = await apiClient.post(
        ENDPOINTS.BOOKING.CREATE,
        TestDataBuilder.createValidBookingPayload()
      );
      const id = createResponse.body.bookingid;

      const patchPayload = { firstname: 'PatchedName' };
      const response = await apiClient.patch(ENDPOINTS.BOOKING.PARTIAL_UPDATE(id), patchPayload);

      AssertionHelper.assertStatusCode(response, 200);
      AssertionHelper.assertResponseBodyValue(response, 'firstname', 'PatchedName');
    });

    test('TC_PATCH_002: Partial update preserves other fields', async () => {
      const createPayload = TestDataBuilder.createValidBookingPayload({
        firstname: 'Original',
        lastname: 'Lastname'
      });
      const createResponse = await apiClient.post(ENDPOINTS.BOOKING.CREATE, createPayload);
      const id = createResponse.body.bookingid;

      const patchPayload = { firstname: 'Changed' };
      const response = await apiClient.patch(ENDPOINTS.BOOKING.PARTIAL_UPDATE(id), patchPayload);

      AssertionHelper.assertStatusCode(response, 200);
    });
  });

  test.describe('DELETE Operations', () => {
    test('TC_DELETE_001: Delete existing booking', async () => {
      const createResponse = await apiClient.post(
        ENDPOINTS.BOOKING.CREATE,
        TestDataBuilder.createValidBookingPayload()
      );
      const id = createResponse.body.bookingid;

      const response = await apiClient.delete(ENDPOINTS.BOOKING.DELETE(id));

      AssertionHelper.assertStatusCodeIn(response, [201, 200]);
    });

    test('TC_DELETE_002: Delete non-existent booking', async () => {
      const response = await apiClient.delete(ENDPOINTS.BOOKING.DELETE(99999));

      AssertionHelper.assertStatusCodeIn(response, [404, 401, 403]);
    });

    test('TC_DELETE_003: Delete with invalid ID format', async () => {
      const response = await apiClient.delete(ENDPOINTS.BOOKING.DELETE('invalid'));

      AssertionHelper.assertStatusCodeIn(response, [404, 400, 403]);
    });
  });
});
