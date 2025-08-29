import { Layout } from 'antd';
import { Header } from '~widgets/header';
import { TodoProvider } from '~app/providers/TodoProvider';
import { useTheme } from '~entities/contexts/theme-context';
import { getThemeColors } from '~constants/colors';

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isDarkTheme } = useTheme();
  const themeColors = getThemeColors(isDarkTheme);
  return (
    <TodoProvider>
      <Layout
        style={{
          backgroundColor: themeColors.pageBackground,
          minHeight: '100vh',
        }}
      >
        <Header />
        {children}
      </Layout>
    </TodoProvider>
  );
}
