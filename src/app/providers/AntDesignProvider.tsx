import { type ReactNode } from 'react';
import { ConfigProvider, theme } from 'antd';
import ruRU from 'antd/locale/ru_RU';
import { useTheme } from '~entities/contexts/theme-context';

export function AntDesignProvider({ children }: { children: ReactNode }) {
  const { isDarkTheme } = useTheme();

  return (
    <ConfigProvider
      locale={ruRU}
      theme={{
        token: {
          motionDurationSlow: '0s',
          fontFamily: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif',
        },
        algorithm: isDarkTheme ? theme.darkAlgorithm : theme.defaultAlgorithm,
      }}
    >
      {children}
    </ConfigProvider>
  );
}
