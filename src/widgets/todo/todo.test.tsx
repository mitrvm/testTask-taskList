import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TodoApp } from './todo';

vi.mock('~entities/contexts/theme-context', () => ({
  useTheme: () => ({ isDarkTheme: false }),
}));

vi.mock('~constants/colors', () => ({
  getThemeColors: () => ({
    cardBackground: '#fff',
    titleText: '#000',
    subtleBorder: '#eee',
    filterButtonBorder: '#ddd',
    filterButtonBg: '#f7f7f7',
    filterButtonText: '#333',
  }),
}));

const addTodo = vi.fn();
const toggleTodo = vi.fn();
const clearCompleted = vi.fn();
let currentTodos: Array<{ id: string; text: string; completed: boolean }>;

vi.mock('~app/providers/TodoProvider', () => ({
  useTodos: () => ({
    todos: currentTodos,
    addTodo,
    toggleTodo,
    clearCompleted,
  }),
}));

describe('TodoApp', () => {
  beforeEach(() => {
    addTodo.mockReset();
    toggleTodo.mockReset();
    clearCompleted.mockReset();
    currentTodos = [
      { id: '1', text: 'First', completed: false },
      { id: '2', text: 'Second', completed: true },
      { id: '3', text: 'Third', completed: false },
    ];
  });

  it('renders input and list', () => {
    render(<TodoApp />);
    expect(screen.getByPlaceholderText('What needs to be done?')).toBeDefined();
    expect(screen.getByText('First')).toBeDefined();
    expect(screen.getByText('Second')).toBeDefined();
    expect(screen.getByText('Third')).toBeDefined();
  });

  it('adds a todo on Enter and clears input', async () => {
    render(<TodoApp />);
    const input = screen.getByPlaceholderText(
      'What needs to be done?',
    ) as HTMLInputElement;
    await userEvent.type(input, 'New task{enter}');
    expect(addTodo).toHaveBeenCalledWith('New task');
    expect(input.value).toBe('');
  });

  it('toggles a todo when clicking list item button', async () => {
    render(<TodoApp />);
    const firstRow = screen.getByText('First').closest('button');
    expect(firstRow).toBeTruthy();
    await userEvent.click(firstRow!);
    expect(toggleTodo).toHaveBeenCalledWith('1');
  });

  it('toggles a todo when clicking the custom checkbox', async () => {
    render(<TodoApp />);
    const row = screen.getByText('Third').closest('button')!;
    const cb = within(row).getByRole('checkbox');
    await userEvent.click(cb);
    expect(toggleTodo).toHaveBeenCalledWith('3');
  });

  it('filters by Active and Completed', async () => {
    render(<TodoApp />);
    await userEvent.click(screen.getByRole('button', { name: 'Active' }));
    expect(screen.queryByText('Second')).toBeNull();
    expect(screen.getByText('First')).toBeDefined();
    expect(screen.getByText('Third')).toBeDefined();

    await userEvent.click(screen.getByRole('button', { name: 'Completed' }));
    expect(screen.getByText('Second')).toBeDefined();
    expect(screen.queryByText('First')).toBeNull();
    expect(screen.queryByText('Third')).toBeNull();

    await userEvent.click(screen.getByRole('button', { name: 'All' }));
    expect(screen.getByText('First')).toBeDefined();
    expect(screen.getByText('Second')).toBeDefined();
    expect(screen.getByText('Third')).toBeDefined();
  });

  it('clears completed via footer button', async () => {
    render(<TodoApp />);
    const clearBtn = screen.getByRole('button', { name: 'Clear completed' });
    expect((clearBtn as HTMLButtonElement).disabled).toBe(false);
    await userEvent.click(clearBtn);
    expect(clearCompleted).toHaveBeenCalledTimes(1);
  });

  it('disables clear button when no completed todos', () => {
    currentTodos = [{ id: '1', text: 'Only', completed: false }];
    render(<TodoApp />);
    const clearBtn = screen.getByRole('button', { name: 'Clear completed' });
    expect((clearBtn as HTMLButtonElement).disabled).toBe(true);
  });

  it('shows correct remaining count and pluralization', () => {
    render(<TodoApp />);
    expect(screen.getByText('2 items left')).toBeDefined();

    currentTodos = [
      { id: '1', text: 'Only', completed: false },
      { id: '2', text: 'Done', completed: true },
    ];
    render(<TodoApp />);
    expect(screen.getByText('1 item left')).toBeDefined();
  });
});
