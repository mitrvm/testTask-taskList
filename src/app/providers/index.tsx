import { withErrorBoundary } from 'react-error-boundary';
import { ErrorFallback } from '~pages/dashboard';
import { withSuspense } from '~shared/lib/react';
import { BrowserRouter } from './RouterProvider';
import { MUIThemeProvider } from './ThemeProvider';
import { AntDesignProvider } from './AntDesignProvider';
import { JSX } from 'react';
import React from 'react';
// import '../../i18n.js';

export default function App(): JSX.Element {
  return (
    <React.StrictMode>
      <MUIThemeProvider>
        <AntDesignProvider>
          <BrowserRouter />
        </AntDesignProvider>
      </MUIThemeProvider>
    </React.StrictMode>
  );
}

const SuspensedProvider = withSuspense(App, {
  fallback: (
    <div>
      <h2>Что-то пошло не так... :/</h2>
    </div>
  ),
});

export const Provider = withErrorBoundary(SuspensedProvider, {
  fallbackRender: ErrorFallback,
});
