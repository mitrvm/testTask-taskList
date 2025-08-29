import { DashboardLayout } from '~pages/dashboard/ui/layout';
import { TodoApp } from '~widgets/todo';
import { Typography, Flex } from 'antd';
import { useTheme } from '~entities/contexts/theme-context';
import { getThemeColors } from '~constants/colors';

const { Title } = Typography;

const createTitleStyle = (isDark: boolean): React.CSSProperties => ({
  color: getThemeColors(isDark).mainTitleText,
  fontSize: 84,
  fontWeight: 200,
});

export function MainPage() {
  const { isDarkTheme } = useTheme();
  return (
    <DashboardLayout>
      <Flex vertical align="center" style={{ padding: 16 }}>
        <Title style={createTitleStyle(isDarkTheme)}>todos</Title>
        <TodoApp />
      </Flex>
    </DashboardLayout>
  );
}
