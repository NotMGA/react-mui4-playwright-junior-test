# Test Strategy

## How the tests protect against regressions

Our Playwright tests cover both **validation and submission flows** for the User Registration Form:

- **Field validation**: Each field (name, email, age, password) is tested individually for empty or invalid inputs. This ensures that any future changes in Formik, Yup, or Material-UI do not break the validation rules.
- **Successful submission**: We test the happy path with correct inputs and a successful API response, ensuring that the form behaves as expected.
- **Failed API call**: The API is mocked to simulate a failure, verifying that the application properly displays error messages when something goes wrong.

By covering both error and success scenarios, these tests act as a safety net, **catching regressions quickly** if library updates or code changes introduce unexpected behavior.

## Why this approach was chosen

- **Clarity and maintainability**: Each test focuses on a single aspect (field validation, happy path, API error), making it easy to identify the source of any failure.
- **API mocking**: Using Playwright’s route mocking ensures tests are **deterministic** and do not rely on a real backend.
- **Type safety**: TypeScript ensures that form fields and helper functions are used correctly, reducing runtime errors.

## Potential improvements with more time

- Add **more granular validation tests** for complex password rules or edge cases.
- Test **UI state changes**, such as button disabled states, loading indicators, or Material-UI error styles.
- Expand coverage to **accessibility checks**, ensuring the form is navigable via keyboard and screen readers.
- Integrate **visual regression testing** to detect unintended style changes after library upgrades.
```
