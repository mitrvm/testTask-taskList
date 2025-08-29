import { createElement } from 'react';
import { type RouteObject } from 'react-router-dom';
import { pathKeys } from '~shared/lib/react-router';
import { MainPage } from './ui';

export const mainPageRoute: RouteObject = {
  path: pathKeys.dashboard.home.root(),
  element: createElement(MainPage),
  loader: async (args) => args,
};
