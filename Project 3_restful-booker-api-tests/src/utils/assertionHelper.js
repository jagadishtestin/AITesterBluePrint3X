const { expect } = require('@playwright/test');

class AssertionHelper {
  static assertStatusCode(response, expectedStatus, message = '') {
    const errorMsg = message || `Expected status ${expectedStatus}, got ${response.status}`;
    expect(response.status, errorMsg).toBe(expectedStatus);
  }

  static assertStatusCodeIn(response, expectedStatuses, message = '') {
    const errorMsg = message || `Expected status in [${expectedStatuses}], got ${response.status}`;
    expect(expectedStatuses, errorMsg).toContain(response.status);
  }

  static assertResponseOk(response) {
    expect(response.ok, `Response status ${response.status} is not ok`).toBe(true);
  }

  static assertResponseBodyIsNotEmpty(response) {
    expect(response.body, 'Response body is empty').toBeTruthy();
  }

  static assertResponseBodyContainsKeys(response, expectedKeys) {
    if (!response.body || typeof response.body !== 'object') {
      throw new Error('Response body is not an object');
    }

    expectedKeys.forEach(key => {
      expect(response.body, `Response body missing required key: ${key}`).toHaveProperty(key);
    });
  }

  static assertResponseBodyValue(response, key, expectedValue) {
    expect(response.body[key], `Expected ${key} to be ${expectedValue}`).toBe(expectedValue);
  }

  static assertResponseBodyValueExists(response, key) {
    expect(response.body[key], `Response body value for key '${key}' does not exist`).toBeDefined();
  }

  static assertResponseHeaderExists(response, headerName) {
    const headers = response.headers;
    const headerExists = Object.keys(headers).some(h => h.toLowerCase() === headerName.toLowerCase());
    expect(headerExists, `Response header '${headerName}' not found`).toBe(true);
  }

  static assertResponseHeaderValue(response, headerName, expectedValue) {
    const headers = response.headers;
    const actualValue = Object.entries(headers).find(
      ([key]) => key.toLowerCase() === headerName.toLowerCase()
    )?.[1];

    expect(actualValue, `Header ${headerName}: expected ${expectedValue}, got ${actualValue}`).toBe(expectedValue);
  }

  static assertIsArray(value, message = '') {
    const errorMsg = message || 'Expected value to be an array';
    expect(Array.isArray(value), errorMsg).toBe(true);
  }

  static assertArrayLength(array, expectedLength, message = '') {
    const errorMsg = message || `Expected array length ${expectedLength}, got ${array.length}`;
    expect(array.length, errorMsg).toBe(expectedLength);
  }

  static assertArrayLengthGreaterThan(array, minLength, message = '') {
    const errorMsg = message || `Expected array length > ${minLength}, got ${array.length}`;
    expect(array.length, errorMsg).toBeGreaterThan(minLength);
  }

  static assertStringContains(text, substring, message = '') {
    const errorMsg = message || `Expected "${text}" to contain "${substring}"`;
    expect(text, errorMsg).toContain(substring);
  }

  static assertObjectHasStructure(obj, schema) {
    Object.keys(schema).forEach(key => {
      const expectedType = typeof schema[key];
      const actualType = typeof obj[key];

      expect(obj, `Object missing property: ${key}`).toHaveProperty(key);
      expect(actualType, `Property ${key}: expected type ${expectedType}, got ${actualType}`).toBe(expectedType);
    });
  }

  static assertResponseTime(response, expectedTime, message = '') {
    const time = response.headers['x-response-time'] || 0;
    const errorMsg = message || `Expected response time < ${expectedTime}ms`;
    expect(parseInt(time), errorMsg).toBeLessThan(expectedTime);
  }

  static assertBookingStructure(booking) {
    const expectedKeys = ['firstname', 'lastname', 'totalprice', 'depositpaid', 'bookingdates', 'additionalneeds'];
    this.assertResponseBodyContainsKeys({ body: booking }, expectedKeys);
    this.assertObjectHasStructure(booking.bookingdates, {
      checkin: 'string',
      checkout: 'string'
    });
  }

  static assertBookingIdValid(bookingId) {
    expect(bookingId, 'Booking ID should be a number').toBeDefined();
    expect(typeof bookingId, 'Booking ID should be numeric').toMatch(/number|string/);
  }

  static assertTokenValid(token) {
    expect(token, 'Token should not be empty').toBeTruthy();
    expect(typeof token, 'Token should be a string').toBe('string');
  }
}

module.exports = AssertionHelper;
