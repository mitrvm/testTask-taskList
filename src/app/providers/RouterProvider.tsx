import {
  RouterProvider,
  createBrowserRouter,
  redirect,
  useRouteError,
} from 'react-router-dom';
import { NakedLayout } from '~pages/layouts';
import { mainPageRoute } from '~pages/dashboard/pages';
import { pathKeys } from '~shared/lib/react-router';
import { dashboardPageRoute } from '~pages/dashboard';

function BubbleError() {
  const error = useRouteError();
  if (error) throw error;
  return null;
}

const router = createBrowserRouter([
  {
    errorElement: <BubbleError />,
    element: <NakedLayout />,
    children: [
      dashboardPageRoute,
      mainPageRoute,
      {
        loader: async () => redirect(pathKeys.dashboard.home.root()),
        path: '*',
      },
    ],
  },
]);

export function BrowserRouter() {
  return <RouterProvider router={router} />;
}
