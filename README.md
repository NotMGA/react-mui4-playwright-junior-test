
# Test Strategy

## How the tests protect against regressions

The test suite is built on three pillars to act as a safety net against regressions, especially during library upgrades:

1.  **Field-level Validation:** Each input is individually tested against invalid data (empty, too short, incorrect format). This isolates the validation logic (Yup, Formik) and guarantees that user feedback remains intact.
2.  **Successful Submission Flow (Happy Path):** We simulate a complete, successful user journey. This verifies the core functionality: a valid form submission leads to a success message and a state reset.
3.  **API Failure Simulation:** Using Playwright's network mocking, we simulate a server error (`500`). This ensures the application gracefully handles failures by displaying a clear error message to the user without crashing.

---

## Why this approach was chosen

This strategy was chosen for three main reasons:

-   **Reliability:** API mocking makes our tests **deterministic** and independent of any real backend. They run quickly and consistently, which is crucial for integration in a CI/CD pipeline.
-   **Maintainability:** Each test has a single, clear purpose. When a test fails, it points directly to the part of the application that has regressed, making debugging faster.
-   **Confidence:** By covering the most critical user flows (validation, success, failure), the suite provides strong confidence that the feature works as intended and will withstand future changes.

---

## Potential improvements with more time

To further increase the quality assurance, the next steps would be:

-   **UI State Testing:** Verify more granular UI states like the loading spinner's visibility and the disabled state of the submit button during submission.
-   **Accessibility (A11y) Checks:** Integrate automated checks to ensure the form is fully accessible, for instance, by verifying keyboard navigation and ARIA attributes.
-   **Visual Regression Testing:** Implement tools to capture screenshots and detect unintended visual changes after CSS modifications or library updates, which is key for maintaining UI consistency.
