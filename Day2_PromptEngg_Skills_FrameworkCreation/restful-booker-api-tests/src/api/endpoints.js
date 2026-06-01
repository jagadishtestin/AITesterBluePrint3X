const ENDPOINTS = {
  AUTH: {
    CREATE_TOKEN: '/auth'
  },
  BOOKING: {
    GET_ALL: '/booking',
    CREATE: '/booking',
    GET_BY_ID: (id) => `/booking/${id}`,
    UPDATE: (id) => `/booking/${id}`,
    PARTIAL_UPDATE: (id) => `/booking/${id}`,
    DELETE: (id) => `/booking/${id}`
  },
  HEALTH: {
    PING: '/ping'
  }
};

module.exports = ENDPOINTS;
