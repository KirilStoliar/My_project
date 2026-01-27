export const environment = {
  production: false,
  apiUrl: 'http://localhost:8083', // API Gateway URL
  auth: {
    login: '/api/v1/auth/login',
    register: '/api/v1/auth/register',
    validate: '/api/v1/auth/validate',
    refresh: '/api/v1/auth/refresh'
  },
  orders: {
    base: '/api/v1/orders',
    byUser: '/api/v1/orders/user'
  },
  payments: {
    base: '/api/v1/payments',
    byUser: '/api/v1/payments/user'
  }
};
