# React MUI v4 Playwright Junior Test

![Packitoo logo](https://avatars.githubusercontent.com/u/34088411?)

## 📋 Description
This is a **technical assessment** for a **junior quality developer** position at [Packitoo](https://packitoo.com).

Your task is to:
1. Build a simple **user registration form** using:
   - **React 16**
   - **Material UI v4.12**
   - **Formik 2.46**
   - **Yup 0.27**
2. Connect the form to a mocked API (`POST /api/users`).
3. Write **Playwright end-to-end tests** to verify form validation and API interaction.
4. Provide a short written explanation of your **test strategy**.

The goal is to ensure the feature will still work after major library upgrades.

---

## 🛠 Stack
- **Typescript** 4.x
- **React:** 16.x
- **Material UI:** 4.12.x
- **Formik:** 2.46.x
- **Yup:** 0.27.x
- **Playwright:** latest stable

---

## 🧩 Requirements

### Form Behavior
- **Fields:**
  - `name` — required, minimum 3 characters
  - `email` — required, must be a valid email
  - `age` — required, must be ≥ 18
  - `password` - required, must be number and letters, minimum 5 characters
- **UI:** Use Material UI v4 components.
- **Validation:** Use Formik + Yup.
- **On Submit:**
  - Call `POST /api/users` (mocked endpoint).
  - If successful, show a success message.
  - If API fails, show an error message.

### Playwright Tests
- Should cover:
  1. Form validation messages for empty/invalid inputs.
  2. Successful submission flow.
  3. Failed API call flow.
- Use Playwright’s API mocking features for failure scenarios.

---

## 🚀 How we test and what were looking for

```bash
yarn install

2. Start the app

yarn start

The app will run at http://localhost:3000.

3. Run Playwright tests

npx playwright install
npx playwright test
```

### 📄 Deliverables

Submit:
1.	Your completed UserForm.ts.
2.	Your Playwright test file(s).
3.	A short strategy explanation in README.md under the “Test Strategy” section.

### 🗣 Test Strategy (Your Notes Here)

Explain briefly:
- How your tests protect against regressions during future library upgrades.
- Why you chose this approach.
- What improvements you would add with more time.

### ✅ Evaluation Criteria

We will assess:
- Correct use of Formik, Yup, and Material UI.
- Playwright tests covering both success and error cases.
- Code readability and clarity.
- Your explanation of your test strategy.


Good luck!