import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Header } from '../header';

vi.mock('antd', async () => {
  const actual = await vi.importActual<any>('antd');
  const ReactModule = await vi.importActual<any>('react');
  const React = ReactModule.default || ReactModule;
  const MockUpload = ({ beforeUpload, onChange, children }: any) => {
    const onlyChild = React.Children.only(children);
    return React.cloneElement(onlyChild, {
      onClick: async (...args: any[]) => {
        const file = new File(['# todo\n- [ ] Task'], 'todos.md', {
          type: 'text/markdown',
        });

        await beforeUpload?.(file);

        onChange?.({
          file: { originFileObj: file, status: 'done' },
          fileList: [{ originFileObj: file, status: 'done' }],
        });

        if (typeof (onlyChild as any).props?.onClick === 'function') {
          (onlyChild as any).props.onClick(...args);
        }
        return false;
      },
    });
  };
  return { ...actual, Upload: MockUpload };
});

const toggleTheme = vi.fn();
vi.mock('~entities/contexts/theme-context', () => ({
  useTheme: () => ({ isDarkTheme: false, toggleTheme }),
}));

const getMarkdownString = vi.fn();
const loadFromMarkdownText = vi.fn();
let todos: Array<{ id: string; text: string; completed: boolean }> = [];

vi.mock('~app/providers/TodoProvider', () => ({
  useTodos: () => ({
    getMarkdownString,
    loadFromMarkdownText,
    todos,
  }),
}));

vi.mock('~constants/colors', () => ({
  getThemeColors: () => ({
    headerBackground: '#fff',
    titleText: '#000',
  }),
}));

describe('Header', () => {
  beforeEach(() => {
    toggleTheme.mockReset();
    getMarkdownString.mockReset();
    loadFromMarkdownText.mockReset();
    todos = [];
  });

  it('renders title', () => {
    render(<Header />);
    expect(screen.getByText('made by github.com/mitrvm')).toBeDefined();
  });

  it('toggles theme when clicking the button', async () => {
    render(<Header />);
    const btn = screen.getByRole('button', { name: 'Toggle theme' });
    await userEvent.click(btn);
    expect(toggleTheme).toHaveBeenCalledTimes(1);
  });

  it('disables Export when no todos', () => {
    todos = [];
    render(<Header />);
    const exportBtn = screen.getByRole('button', { name: 'Export .md' });
    expect((exportBtn as HTMLButtonElement).disabled).toBe(true);
  });

  it('enables Export when todos exist and triggers download flow', async () => {
    todos = [{ id: '1', text: 'A', completed: false }];
    getMarkdownString.mockReturnValue('# title');

    if (!(URL as any).createObjectURL) {
      (URL as any).createObjectURL = () => 'blob:polyfill';
    }
    if (!(URL as any).revokeObjectURL) {
      (URL as any).revokeObjectURL = () => {};
    }
    const createUrl = vi
      .spyOn(URL, 'createObjectURL')
      .mockReturnValue('blob:fake');
    const revokeUrl = vi
      .spyOn(URL, 'revokeObjectURL')
      .mockImplementation(() => {});

    const clickMock = vi.fn();
    const originalCreateElement = document.createElement.bind(document);
    vi.spyOn(document, 'createElement').mockImplementation(((tag: string) => {
      if (tag === 'a') {
        return {
          href: '',
          download: '',
          click: clickMock,
        } as unknown as HTMLElement;
      }
      return originalCreateElement(tag);
    }) as unknown as typeof document.createElement);

    render(<Header />);
    const exportBtn = screen.getByRole('button', { name: 'Export .md' });
    expect((exportBtn as HTMLButtonElement).disabled).toBe(false);
    await userEvent.click(exportBtn);

    expect(getMarkdownString).toHaveBeenCalled();
    expect(clickMock).toHaveBeenCalled();
    expect(createUrl).toHaveBeenCalled();
    expect(revokeUrl).toHaveBeenCalled();

    createUrl.mockRestore();
    revokeUrl.mockRestore();
  });
});
