export const pathKeys = {
  root: '/',
  dashboard: {
    root() {
      return pathKeys.root.concat('dashboard/');
    },
    home: {
      root() {
        return pathKeys.dashboard.root().concat('home/');
      },
    },
  },
  page404() {
    return pathKeys.root.concat('404/');
  },
  guide: {
    root() {
      return 'https://abc';
    },
  },
};
