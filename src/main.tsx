import React, { StrictMode, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { ErrorBoundary } from 'react-error-boundary';
import App from './App.tsx';
import './index.css';

// Error Fallback Component
const ErrorFallback = ({ error }: { error: Error }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            Something went wrong
          </h2>
          <p className="mt-2 text-center text-sm text-red-600">
            {error.message}
          </p>
          <div className="mt-4 text-center">
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Refresh Page
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Loading Component
const LoadingFallback = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>
  );
};

const root = document.getElementById('root');

if (!root) {
  throw new Error('Root element not found');
}

createRoot(root).render(
  <StrictMode>
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Suspense fallback={<LoadingFallback />}>
        <App />
      </Suspense>
    </ErrorBoundary>
  </StrictMode>
);
