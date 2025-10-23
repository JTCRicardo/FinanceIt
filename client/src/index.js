import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { ClerkProvider } from '@clerk/clerk-react';
import App from './App';

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!clerkPubKey) {
  throw new Error('Missing Clerk Publishable Key');
}

const root = ReactDOM.createRoot(document.getElementById('root'));

//wrap the entire app in the ClerkProvider
root.render(
  <ClerkProvider publishableKey={clerkPubKey}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </ClerkProvider>
);