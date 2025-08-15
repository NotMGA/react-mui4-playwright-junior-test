// src/App.tsx
import React from 'react';
import UserForm from './components/UserForm';
import { CssBaseline } from '@material-ui/core';

function App() {
  return (
    <>
      <CssBaseline />
      <main style={{ padding: '2rem' }}>
        <UserForm />
      </main>
    </>
  );
}

export default App;
