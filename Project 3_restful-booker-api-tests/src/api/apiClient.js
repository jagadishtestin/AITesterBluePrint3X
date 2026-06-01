require('dotenv').config();
const Logger = require('../utils/logger');

class APIClient {
  constructor(context) {
    this.context = context;
    this.baseURL = process.env.API_BASE_URL || 'https://restful-booker.herokuapp.com';
    this.token = null;
    this.timeout = parseInt(process.env.API_TIMEOUT) || 30000;
    this.logger = new Logger();
  }

  setAuthToken(token) {
    this.token = token;
    this.logger.log(`Authorization token set: ${token.substring(0, 10)}...`);
  }

  clearAuthToken() {
    this.token = null;
    this.logger.log('Authorization token cleared');
  }

  getAuthHeaders() {
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };

    if (this.token) {
      headers['Cookie'] = `token=${this.token}`;
    }

    return headers;
  }

  async request(method, endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const headers = { ...this.getAuthHeaders(), ...options.headers };

    let fullUrl = url;
    if (options.params) {
      const queryString = new URLSearchParams(options.params).toString();
      fullUrl = `${url}?${queryString}`;
    }

    const requestOptions = {
      method,
      headers,
      timeout: options.timeout || this.timeout
    };

    if (options.body && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
      requestOptions.data = options.body;
    }

    this.logger.log(`${method} ${fullUrl}`);
    if (options.body) {
      this.logger.log(`Request Body: ${JSON.stringify(options.body, null, 2)}`);
    }

    try {
      const response = await this.context.fetch(fullUrl, requestOptions);
      const status = response.status();
      const headers = response.headers();

      let body = null;
      try {
        body = await response.json();
      } catch (e) {
        body = await response.text();
      }

      this.logger.log(`Response Status: ${status}`);
      this.logger.log(`Response Body: ${JSON.stringify(body, null, 2)}`);

      return {
        status,
        headers,
        body,
        ok: response.ok()
      };
    } catch (error) {
      this.logger.error(`API Request Failed: ${error.message}`);
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
