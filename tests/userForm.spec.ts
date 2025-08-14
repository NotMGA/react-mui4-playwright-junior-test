// tests/userForm.spec.ts

import { test, expect } from '@playwright/test';

/**
 * Utility function to fill the user registration form.
 * Only fills fields provided in the `values` object.
 * Submits the form after filling the values.
 */
async function fillForm(
  page,
  values: { name?: string; email?: string; age?: string; password?: string }
) {
  if (values.name !== undefined) await page.fill('input[name="name"]', values.name);
  if (values.email !== undefined) await page.fill('input[name="email"]', values.email);
  if (values.age !== undefined) await page.fill('input[name="age"]', values.age);
  if (values.password !== undefined) await page.fill('input[name="password"]', values.password);

  await page.click('text=Sign Up');
}

test.describe('User Registration Form', () => {

  // ======================
  // Setup before each test
  // ======================
  test.beforeEach(async ({ page }) => {
    // Mock the API to always return success unless overridden
    await page.route('**/api/users', route => route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ success: true }),
    }));

    // Navigate to the registration page
    await page.goto('http://localhost:5173/');
  });

  // ======================
  // Validation Tests
  // ======================

  test('shows validation errors for empty inputs', async ({ page }) => {
    // Submit the form without filling any field
    await page.click('text=Sign Up');

    // Expect required field errors
    await expect(page.locator('text=Name is required')).toBeVisible();
    await expect(page.locator('text=Email is required')).toBeVisible();
    await expect(page.locator('text=Age is required')).toBeVisible();
    await expect(page.locator('text=Password is required')).toBeVisible();
  });

  // Individual field validation tests
  test('name too short shows error', async ({ page }) => {
    await fillForm(page, { name: 'Ma' });
    await expect(page.locator('text=Name must be at least 3 characters')).toBeVisible();
  });

  test('invalid email shows error', async ({ page }) => {
    await fillForm(page, { email: 'maxime' });
    await expect(page.locator('text=Invalid email address')).toBeVisible();
  });

  test('age below 18 shows error', async ({ page }) => {
    await fillForm(page, { age: '3' });
    await expect(page.locator('text=You must be at least 18 years old')).toBeVisible();
  });

  test('password too short shows error', async ({ page }) => {
    await fillForm(page, { password: 'ab' });
    await expect(page.locator('text=Password must be at least 5 characters')).toBeVisible();
  });

  test('password letters only shows error', async ({ page }) => {
    await fillForm(page, { password: 'abcdef' });
    await expect(page.locator('text=Password must contain both letters and numbers')).toBeVisible();
  });

  test('password numbers only shows error', async ({ page }) => {
    await fillForm(page, { password: '123456' });
    await expect(page.locator('text=Password must contain both letters and numbers')).toBeVisible();
  });

  // ======================
  // Positive Validation (No Errors)
  // ======================

  test('valid name does not show error', async ({ page }) => {
    await fillForm(page, { name: 'Maxime' });
    await page.click('text=Sign Up');
    await expect(page.locator('text=Name must be at least 3 characters')).toHaveCount(0);
    await expect(page.locator('text=Name is required')).toHaveCount(0);
  });

  test('valid email does not show error', async ({ page }) => {
    await fillForm(page, { email: 'maxime@example.com' });
    await page.click('text=Sign Up');
    await expect(page.locator('text=Invalid email address')).toHaveCount(0);
    await expect(page.locator('text=Email is required')).toHaveCount(0);
  });

  test('valid age does not show error', async ({ page }) => {
    await fillForm(page, { age: '25' });
    await page.click('text=Sign Up');
    await expect(page.locator('text=You must be at least 18 years old')).toHaveCount(0);
    await expect(page.locator('text=Age is required')).toHaveCount(0);
  });

  test('valid password does not show error', async ({ page }) => {
    await fillForm(page, { password: 'abc123' });
    await page.click('text=Sign Up');
    await expect(page.locator('text=Password must be at least 5 characters')).toHaveCount(0);
    await expect(page.locator('text=Password must contain both letters and numbers')).toHaveCount(0);
    await expect(page.locator('text=Password is required')).toHaveCount(0);
  });

  // ======================
  // Submission Flow Tests
  // ======================

  test('successful submission flow', async ({ page }) => {
    await fillForm(page, { name: 'Maxime', email: 'maxime@example.com', age: '25', password: 'abc123' });

    // Expect success message
    await expect(page.locator('text=Registration successful! Welcome.')).toBeVisible();

    // Ensure form resets after successful submission
    await expect(page.locator('input[name="name"]')).toHaveValue('');
    await expect(page.locator('input[name="email"]')).toHaveValue('');
    await expect(page.locator('input[name="age"]')).toHaveValue('');
    await expect(page.locator('input[name="password"]')).toHaveValue('');
  });

  test('failed API call flow', async ({ page }) => {
    // Mock API failure
    await page.route('**/api/users', route => route.fulfill({
      status: 500,
      contentType: 'application/json',
      body: JSON.stringify({ error: 'Server error' }),
    }));

    await fillForm(page, { name: 'Maxime', email: 'maxime@example.com', age: '25', password: 'abc123' });

    // Expect error message to be visible
    await expect(page.locator('text=Registration failed')).toBeVisible();
    await expect(page.locator('text=API Error')).toBeVisible();
  });

});

