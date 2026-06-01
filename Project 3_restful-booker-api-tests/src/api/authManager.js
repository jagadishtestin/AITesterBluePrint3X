require('dotenv').config();
const APIClient = require('./apiClient');
const ENDPOINTS = require('./endpoints');

class AuthManager {
  constructor(context) {
    this.apiClient = new APIClient(context);
    this.token = null;
  }

  async createToken(username = null, password = null) {
    const credentials = {
      username: username || process.env.API_USERNAME || 'admin',
      password: password || process.env.API_PASSWORD || 'password123'
    };

    const response = await this.apiClient.post(
      ENDPOINTS.AUTH.CREATE_TOKEN,
      credentials
    );

    if (response.status === 200 && response.body.token) {
      this.token = response.body.token;
      this.apiClient.setAuthToken(this.token);
    }

    return response;
  }

  getToken() {
    return this.token;
  }

  setToken(token) {
    this.token = token;
    this.apiClient.setAuthToken(token);
  }

  clearToken() {
    this.token = null;
    this.apiClient.clearAuthToken();
  }

  isAuthenticated() {
    return this.token !== null;
  }
}

module.exports = AuthManager;
