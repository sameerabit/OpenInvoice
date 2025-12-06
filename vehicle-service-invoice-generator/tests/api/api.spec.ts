import { test, expect } from '@playwright/test';

const API_URL = process.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

test.describe('Backend API Integration Tests', () => {
  let authToken: string;
  let customerId: string;
  let serviceId: string;
  let productId: string;

  test.beforeAll(async ({ request }) => {
    // 1. Login
    const loginResponse = await request.post(`${API_URL}/login`, {
      data: {
        email: 'test@example.com',
        password: 'password',
      },
    });
    expect(loginResponse.ok()).toBeTruthy();
    const loginData = await loginResponse.json();
    authToken = loginData.token;
    expect(authToken).toBeDefined();
  });

  test('should create a new customer', async ({ request }) => {
    const response = await request.post(`${API_URL}/customers`, {
      headers: { Authorization: `Bearer ${authToken}` },
      data: {
        name: 'Test Customer',
        address: '123 Test St',
      },
    });
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(data.name).toBe('Test Customer');
    customerId = data.id;
  });

  test('should create a new service', async ({ request }) => {
    const response = await request.post(`${API_URL}/services`, {
      headers: { Authorization: `Bearer ${authToken}` },
      data: {
        description: 'Test Service',
        price: 100,
      },
    });
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(data.description).toBe('Test Service');
    serviceId = data.id;
  });

  test('should create a new product', async ({ request }) => {
    const response = await request.post(`${API_URL}/products`, {
      headers: { Authorization: `Bearer ${authToken}` },
      data: {
        description: 'Test Product',
        price: 50,
      },
    });
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(data.description).toBe('Test Product');
    productId = data.id;
  });

  test('should fetch lookups', async ({ request }) => {
    const response = await request.get(`${API_URL}/lookups`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(Array.isArray(data.customers)).toBeTruthy();
    expect(Array.isArray(data.services)).toBeTruthy();
    expect(Array.isArray(data.products)).toBeTruthy();
  });

  test('should create an invoice', async ({ request }) => {
    const response = await request.post(`${API_URL}/invoices`, {
      headers: { Authorization: `Bearer ${authToken}` },
      data: {
        customerId: customerId,
        customerName: 'Test Customer',
        lineItems: [
          {
            description: 'Test Service',
            price: 100,
            quantity: 1,
          },
        ],
      },
    });
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(data.invoiceNumber).toBeDefined();
  });

  test('should create and update service with included products', async ({ request }) => {
    // Login
    const loginResponse = await request.post('http://localhost:8000/api/login', {
      data: { email: 'test@example.com', password: 'password' }
    });
    const { token } = await loginResponse.json();

    // Create a product first
    const productResponse = await request.post('http://localhost:8000/api/products', {
      headers: { 'Authorization': `Bearer ${token}` },
      data: {
        description: 'Test Product for Service',
        price: 25.00
      }
    });
    if (!productResponse.ok()) {
      console.log('Product creation failed:', await productResponse.text());
    }
    expect(productResponse.ok()).toBeTruthy();
    const product = await productResponse.json();
    console.log('Created product:', product);

    // Create a service
    const serviceResponse = await request.post('http://localhost:8000/api/services', {
      headers: { 'Authorization': `Bearer ${token}` },
      data: {
        description: 'Test Service with Products',
        price: 100.00,
        includedProductIds: []
      }
    });
    expect(serviceResponse.ok()).toBeTruthy();
    const service = await serviceResponse.json();
    console.log('Created service:', service);
    expect(service.includedProductIds).toEqual([]);

    // Update service to add the product
    const updateResponse = await request.patch(`http://localhost:8000/api/services/${service.id}`, {
      headers: { 'Authorization': `Bearer ${token}` },
      data: {
        includedProductIds: [product.id]
      }
    });
    expect(updateResponse.ok()).toBeTruthy();
    const updatedService = await updateResponse.json();
    console.log('Updated service:', updatedService);
    
    // CRITICAL: Verify the service now has the included product
    expect(updatedService.includedProductIds).toEqual([product.id]);
    expect(updatedService.includedProductIds.length).toBe(1);

    // Fetch lookups to verify the service has the product
    const lookupsResponse = await request.get('http://localhost:8000/api/lookups', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    expect(lookupsResponse.ok()).toBeTruthy();
    const lookups = await lookupsResponse.json();
    
    const fetchedService = lookups.services.find((s: any) => s.id === service.id);
    console.log('Fetched service from lookups:', fetchedService);
    expect(fetchedService).toBeDefined();
    expect(fetchedService.includedProductIds).toEqual([product.id]);
    expect(fetchedService.type).toBe('service');
  });
});
