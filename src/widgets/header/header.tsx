import { Layout, Flex, Button, Upload, Tooltip, Typography } from 'antd';
import { SunOutlined, MoonOutlined } from '@ant-design/icons';
import { UploadProps } from 'antd/lib/upload';
import { useTodos } from '~app/providers/TodoProvider';
import { useTheme } from '~entities/contexts/theme-context';
import { getThemeColors } from '~constants/colors';

const { Header: HeaderAntd } = Layout;

const createHeaderStyle = (isDark: boolean): React.CSSProperties => {
  const colors = getThemeColors(isDark);
  return {
    backgroundColor: colors.headerBackground,
  };
};

const createTitleStyle = (isDark: boolean): React.CSSProperties => {
  const colors = getThemeColors(isDark);
  return {
    fontSize: '28px',
    margin: 0,
    color: colors.titleText,
  };
};

export function Header() {
  const { getMarkdownString, loadFromMarkdownText, todos } = useTodos();
  const exportDisabled = todos.length === 0;

  const { isDarkTheme, toggleTheme } = useTheme();

  const handleExport = () => {
    const content = getMarkdownString();
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'todos.md';
    a.click();
    URL.revokeObjectURL(url);
  };

  const uploadProps: UploadProps = {
    accept: '.md,text/markdown,text/plain',
    showUploadList: false,
    beforeUpload: async (file) => {
      try {
        const text = await file.text();
        loadFromMarkdownText(text);
      } catch (e) {
        // ignore
      }
      return false;
    },
  };
  return (
    <HeaderAntd style={createHeaderStyle(isDarkTheme)}>
      <Flex justify="space-between" align="center">
        <Typography.Title level={3} style={createTitleStyle(isDarkTheme)}>
          made by github.com/mitrvm
        </Typography.Title>
        <Flex gap={8} align="center">
          <Button
            aria-label="Toggle theme"
            onClick={toggleTheme}
            icon={isDarkTheme ? <SunOutlined /> : <MoonOutlined />}
            shape="circle"
          />
          <Upload {...uploadProps}>
            <Button>Import .md</Button>
          </Upload>
          <Tooltip
            title={exportDisabled ? 'Add at least one todo to export' : ''}
          >
            <span style={{ display: 'inline-block' }}>
              <Button onClick={handleExport} disabled={exportDisabled}>
                Export .md
              </Button>
            </span>
          </Tooltip>
        </Flex>
      </Flex>
    </HeaderAntd>
  );
}
