class TestDataBuilder {
  static createValidBookingPayload(overrides = {}) {
    return {
      firstname: 'John',
      lastname: 'Doe',
      totalprice: 150,
      depositpaid: true,
      bookingdates: {
        checkin: '2025-12-01',
        checkout: '2025-12-10'
      },
      additionalneeds: 'Breakfast',
      ...overrides
    };
  }

  static createInvalidBookingPayload_MissingFirstname() {
    return {
      lastname: 'Doe',
      totalprice: 150,
      depositpaid: true,
      bookingdates: {
        checkin: '2025-12-01',
        checkout: '2025-12-10'
      }
    };
  }

  static createInvalidBookingPayload_MissingLastname() {
    return {
      firstname: 'John',
      totalprice: 150,
      depositpaid: true,
      bookingdates: {
        checkin: '2025-12-01',
        checkout: '2025-12-10'
      }
    };
  }

  static createInvalidBookingPayload_MissingTotalPrice() {
    return {
      firstname: 'John',
      lastname: 'Doe',
      depositpaid: true,
      bookingdates: {
        checkin: '2025-12-01',
        checkout: '2025-12-10'
      }
    };
  }

  static createInvalidBookingPayload_MissingDates() {
    return {
      firstname: 'John',
      lastname: 'Doe',
      totalprice: 150,
      depositpaid: true
    };
  }

  static createInvalidBookingPayload_CheckoutBeforeCheckin() {
    return {
      firstname: 'John',
      lastname: 'Doe',
      totalprice: 150,
      depositpaid: true,
      bookingdates: {
        checkin: '2025-12-10',
        checkout: '2025-12-01'
      }
    };
  }

  static createInvalidBookingPayload_NegativePrice() {
    return {
      firstname: 'John',
      lastname: 'Doe',
      totalprice: -100,
      depositpaid: true,
      bookingdates: {
        checkin: '2025-12-01',
        checkout: '2025-12-10'
      }
    };
  }

  static createInvalidBookingPayload_InvalidDateFormat() {
    return {
      firstname: 'John',
      lastname: 'Doe',
      totalprice: 150,
      depositpaid: true,
      bookingdates: {
        checkin: '01/12/2025',
        checkout: '10/12/2025'
      }
    };
  }

  static createAuthPayload(username, password) {
    return {
      username: username || 'admin',
      password: password || 'password123'
    };
  }

  static createInvalidAuthPayload_MissingUsername() {
    return {
      password: 'password123'
    };
  }

  static createInvalidAuthPayload_MissingPassword() {
    return {
      username: 'admin'
    };
  }

  static createInvalidAuthPayload_WrongCredentials() {
    return {
      username: 'invaliduser',
      password: 'wrongpassword'
    };
  }

  static createPartialUpdatePayload(overrides = {}) {
    return {
      firstname: 'Jane',
      ...overrides
    };
  }
}

module.exports = TestDataBuilder;
