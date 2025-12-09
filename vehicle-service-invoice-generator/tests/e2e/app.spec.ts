import { test, expect } from '@playwright/test';

test.describe('Vehicle Service Invoice Generator E2E', () => {
  test.beforeEach(async ({ page }) => {
    // Go to the landing page
    await page.goto('/');
  });

  test('should complete the full workflow: login -> create customer -> create service/product -> create invoice', async ({ page }) => {
    page.on('console', msg => console.log('Browser Console:', msg.text()));
    // 1. Landing Page -> Login
    // Check if we are on landing page by looking for "Staff Portal" or "Sign In"
    const loginButton = page.getByRole('button', { name: 'Staff Portal' });
    if (await loginButton.isVisible()) {
        await loginButton.click();
    } else {
        // Fallback if text changed
        await page.getByRole('button', { name: 'Sign In' }).click();
    }

    // Login Form
    await page.fill('#email', 'test@example.com');
    await page.fill('#password', 'password');
    await page.click('button[type="submit"]');

    // Verify we are on the dashboard
    await expect(page.getByRole('heading', { name: 'New Sale' })).toBeVisible();

    // 2. Create a new Customer
    await page.click('text=Customers'); // Sidebar link
    await expect(page.getByRole('heading', { name: 'Manage Customers' })).toBeVisible();

    const customerName = `Test Customer ${Date.now()}`;
    const vehicleRego = `REG-${Date.now()}`;

    await page.fill('#name', customerName);
    await page.fill('#rego', vehicleRego);
    await page.fill('#address', '123 Test St');
    await page.fill('#odo', '10000');
    await page.fill('#desc', 'Test Vehicle');
    await page.click('button:has-text("Add Customer")');

    // Verify customer is in the list
    await expect(page.getByText(customerName)).toBeVisible();

    // 3. Create a new Service with Checklist and Product
    await page.click('text=Services');
    await expect(page.getByRole('heading', { name: 'Manage Services' })).toBeVisible();

    const serviceDesc = `Test Service ${Date.now()}`;
    const checklistItem = 'Check oil level';
    
    await page.fill('#description', serviceDesc);
    await page.fill('#price', '100');
    await page.fill('#checklist', checklistItem);
    
    // Select a product to include (assuming at least one product exists from previous steps or seed)
    // We need to create a product first to be sure
    await page.click('text=Products');
    const productDesc = `Test Product ${Date.now()}`;
    await page.fill('#description', productDesc);
    await page.fill('#price', '50');
    await page.click('button:has-text("Add Product")');
    await expect(page.getByText(productDesc)).toBeVisible();

    // Go back to Services and create service with this product
    await page.click('text=Services');
    await page.fill('#description', serviceDesc);
    await page.fill('#price', '100');
    await page.fill('#checklist', checklistItem);
    
    // Search and select the product
    await page.fill('input[placeholder="Search and select products..."]', productDesc);
    await page.click(`button:has-text("${productDesc}")`);

    await page.click('button:has-text("Add Service")');

    // Wait for data refresh
    await page.waitForTimeout(1000);
    await page.reload();
    await page.click('text=Services');
    await expect(page.getByRole('heading', { name: 'Manage Services' })).toBeVisible();

    // Verify service is in the list
    await expect(page.getByText(serviceDesc)).toBeVisible();

    // 5. Create an Invoice
    await page.click('text=New Sale');
    
    // Wait for navigation
    await expect(page.getByRole('heading', { name: 'New Sale' })).toBeVisible();
    
    // Reload page to ensure new customer is in the list (since we just added it)
    await page.reload();
    await expect(page.getByRole('heading', { name: 'New Sale' })).toBeVisible();

    await page.getByLabel('Select Customer').selectOption({ label: customerName });
    
    // Select Vehicle
    const vehicleSelect = page.getByLabel('Select Vehicle');
    await vehicleSelect.selectOption({ index: 1 }); // Select first available vehicle

    // Add items
    await page.click('button:has-text("+ Add Item")');
    
    // Modal should appear
    await expect(page.getByText('Add Line Item')).toBeVisible();
    
    // Select Service
    // Use the exact service description + price format "Description - $Price.00"
    await page.getByLabel('Select Service').selectOption({ label: `${serviceDesc} - $100.00` });
    await page.click('#add-item-modal button:has-text("Add Item")'); // Button inside modal

    // Verify items in table (Service, Included Product, Checklist Item)
    await expect(page.getByText(serviceDesc)).toBeVisible();
    await expect(page.getByText(productDesc)).toBeVisible();
    await expect(page.getByText(checklistItem)).toBeVisible();
    await expect(page.getByText('(Included)')).toBeVisible();
    await expect(page.getByText('(Checklist)')).toBeVisible();

    // Create Invoice
    // Mock window.alert
    page.on('dialog', dialog => dialog.accept());
    
    await page.click('button:has-text("Create Invoice")');

    // Verify success (e.g., form reset or notification)
    // For now, just check if we are still on the page and maybe the list is cleared?
    // Or check if "Creating..." is gone.
    // Verify success by checking for the "Print / Save as PDF" button
    await expect(page.getByRole('button', { name: 'Print / Save as PDF' })).toBeVisible();
  });
});
