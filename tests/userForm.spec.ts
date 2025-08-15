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
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/users', route => route.fulfill({ status: 200 }));
    await page.goto('http://localhost:3000/');
  });

  // =================================================================
  // SUITE 1 : TESTS DE VALIDATION
  // =================================================================
  test.describe('Validation', () => {
    test('shows validation errors for empty inputs', async ({ page }) => {
      await page.click('text=Sign Up');

      await expect(page.locator('text=Name is required')).toBeVisible();
      await expect(page.locator('text=Email is required')).toBeVisible();
      await expect(page.locator('text=Age is required')).toBeVisible();
      await expect(page.locator('text=Password is required')).toBeVisible();
    });

    const invalidFieldTestCases = [
      { description: 'name too short', values: { name: 'Ma' }, expectedError: 'Name must be at least 3 characters' },
      { description: 'invalid email', values: { email: 'maxime' }, expectedError: 'Invalid email address' },
      { description: 'age below 18', values: { age: '3' }, expectedError: 'You must be at least 18 years old' },
      { description: 'password too short', values: { password: 'ab' }, expectedError: 'Password must be at least 5 characters' },
      { description: 'password with letters only', values: { password: 'abcdef' }, expectedError: 'Password must contain both letters and numbers' },
      { description: 'password with numbers only', values: { password: '123456' }, expectedError: 'Password must contain both letters and numbers' },
    ];

    for (const { description, values, expectedError } of invalidFieldTestCases) {
      test(`shows error for ${description}`, async ({ page }) => {
        await fillForm(page, values);
        await expect(page.locator(`text=${expectedError}`)).toBeVisible();
      });
    }
  });

  // =================================================================
  // SUITE 2 : TESTS DE SOUMISSION DU FORMULAIRE
  // =================================================================
  test.describe('Submission Flow', () => {
    const validData = {
      name: 'Maxime',
      email: 'maxime@example.com',
      age: '25',
      password: 'abc123',
    };

    test('successful submission clears the form', async ({ page }) => {
      await fillForm(page, validData);

      await expect(page.locator('text=Registration successful! Welcome.')).toBeVisible();
      await expect(page.locator('input[name="name"]')).toHaveValue('');
      await expect(page.locator('input[name="email"]')).toHaveValue('');
    });

    test('failed API call shows an error message', async ({ page }) => {
      
      await page.route('**/api/users', route => route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Server error' }),
      }));

      await fillForm(page, validData);

      await expect(page.locator('text=Registration failed')).toBeVisible();
      await expect(page.locator('text=API Error')).toBeVisible();
      
      await expect(page.locator('input[name="name"]')).toHaveValue(validData.name);
    });
  });
});

