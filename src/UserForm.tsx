// src/UserForm.tsx

import React, { useState } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import {
  Container,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Box,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { makeStyles } from '@material-ui/core/styles';

/**
 * Styles for the form container and elements
 * - wrapper: centers the form both vertically and horizontally
 * - form: layout of the form fields
 * - buttonWrapper & buttonProgress: positions the loading spinner
 */
const useStyles = makeStyles((theme) => ({
  wrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    padding: theme.spacing(2),
    
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#fff',
    padding: theme.spacing(4),
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[3],
  },
  buttonWrapper: {
    position: 'relative',
  },
  buttonProgress: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
}));

/**
 * Validation schema using Yup
 * - Ensures proper validation messages for all fields
 */
const validationSchema = Yup.object({
  name: Yup.string()
    .min(3, 'Name must be at least 3 characters')
    .required('Name is required'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  age: Yup.number()
    .min(18, 'You must be at least 18 years old')
    .required('Age is required'),
  password: Yup.string()
    .min(5, 'Password must be at least 5 characters')
    .matches(/^(?=.*[A-Za-z])(?=.*\d)/, 'Password must contain both letters and numbers')
    .required('Password is required'),
});

/**
 * UserForm component
 * - Uses Formik for form state management
 * - Uses Material-UI v4 for UI components
 * - Displays validation messages and handles API submission
 */
const UserForm = () => {
  const classes = useStyles();
  const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  return (
    <Container className={classes.wrapper} role="main">
      <Formik
        initialValues={{ name: '', email: '', age: '', password: '' }}
        validationSchema={validationSchema}
        onSubmit={async (values, { setSubmitting, resetForm }) => {
          setSubmissionStatus('idle');
          setErrorMessage('');

          try {
            // API call (mocked endpoint)
            const response = await fetch('/api/users', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(values),
            });

            if (!response.ok) throw new Error(`API Error: ${response.statusText}`);

            // Show success and reset form
            setSubmissionStatus('success');
            resetForm();
          } catch (error) {
            // Show API error
            setSubmissionStatus('error');
            setErrorMessage(error instanceof Error ? error.message : 'An unknown error occurred.');
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ errors, touched, isSubmitting }) => (
          <Form className={classes.form} aria-label="User registration form">
            {/* Form title */}
            <Typography variant="h4" component="h1" gutterBottom>
              User form
            </Typography>

            {/* Name input */}
            <Field
              name="name"
              as={TextField}
              label="Name"
              variant="outlined"
              fullWidth
              error={touched.name && Boolean(errors.name)}
              helperText={touched.name && errors.name}
              inputProps={{ 'aria-required': true }}
            />

            {/* Email input */}
            <Field
              name="email"
              type="email"
              as={TextField}
              label="Email"
              variant="outlined"
              fullWidth
              error={touched.email && Boolean(errors.email)}
              helperText={touched.email && errors.email}
              inputProps={{ 'aria-required': true }}
            />

            {/* Age input */}
            <Field
              name="age"
              type="number"
              as={TextField}
              label="Age"
              variant="outlined"
              fullWidth
              error={touched.age && Boolean(errors.age)}
              helperText={touched.age && errors.age}
              inputProps={{ 'aria-required': true, min: 0 }}
            />

            {/* Password input */}
            <Field
              name="password"
              type="password"
              as={TextField}
              label="Password"
              variant="outlined"
              fullWidth
              error={touched.password && Boolean(errors.password)}
              helperText={touched.password && errors.password}
              inputProps={{ 'aria-required': true }}
            />

            {/* Submit button with spinner */}
            <Box className={classes.buttonWrapper}>
              <Button
                type="submit"
                color="primary"
                variant="contained"
                fullWidth
                disabled={isSubmitting}
                aria-busy={isSubmitting}
              >
                Sign Up
              </Button>
              {isSubmitting && <CircularProgress size={24} className={classes.buttonProgress} />}
            </Box>

            {/* Submission feedback */}
            {submissionStatus === 'success' && (
              <Alert severity="success" style={{ marginTop: '16px' }} role="alert">
                Registration successful! Welcome.
              </Alert>
            )}
            {submissionStatus === 'error' && (
              <Alert severity="error" style={{ marginTop: '16px' }} role="alert">
                Registration failed. {errorMessage}
              </Alert>
            )}
          </Form>
        )}
      </Formik>
    </Container>
  );
};

export default UserForm;


