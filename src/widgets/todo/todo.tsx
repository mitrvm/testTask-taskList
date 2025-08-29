import { useMemo, useState, useCallback } from 'react';
import { Input, Button } from 'antd';
import { useTodos } from '~app/providers/TodoProvider';
import { DownOutlined } from '@ant-design/icons';
import { useTheme } from '~entities/contexts/theme-context';
import { getThemeColors } from '~constants/colors';

type FilterType = 'all' | 'active' | 'completed';

const wrapperStyle: React.CSSProperties = {
  position: 'relative',
  display: 'flex',
  justifyContent: 'center',
};

const appContainerStyle: React.CSSProperties = {
  minWidth: 540,
  maxWidth: 600,
  boxShadow: '0 2px 2px rgba(0, 0, 0, 0.1)',
};

const headerStyle: React.CSSProperties = {
  padding: '16px 20px 16px 10px',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  fontSize: 18,
  outline: 'none',
};

const listStyle: React.CSSProperties = {
  listStyle: 'none',
  margin: 0,
  padding: 0,
};

const listItemStyle: React.CSSProperties = {
  display: 'flex',
  gap: 16,
  padding: '12px 0',
};

const listItemButtonStyle: React.CSSProperties = {
  display: 'flex',
  gap: 12,
  background: 'transparent',
  justifyContent: 'flex-start',
};

const footerStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '10px 20px',
};

const filtersContainerStyle: React.CSSProperties = {
  display: 'flex',
  gap: 8,
};

const filterButtonStyle: React.CSSProperties = {
  padding: '4px 10px',
  borderRadius: 6,
  cursor: 'pointer',
};

function getStackBarStyle(
  index: number,
  background: string,
): React.CSSProperties {
  const offset = (index + 1) * 6;
  return {
    position: 'absolute',
    bottom: -offset,
    left: offset,
    right: offset,
    height: 8,
    background,
    boxShadow: '0 2px 2px rgba(0,0,0,0.1)',
    zIndex: 3 - index,
    pointerEvents: 'none',
  };
}

function getCheckboxStyle(checked: boolean): React.CSSProperties {
  return {
    width: 22,
    height: 22,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    border: `2px solid ${checked ? '#8cc5b5' : '#e0e0e0'}`,
    backgroundColor: checked ? 'transparent' : 'transparent',
    transition: 'all 120ms ease',
  };
}

export function TodoApp() {
  const { todos, addTodo, toggleTodo, clearCompleted } = useTodos();
  const [text, setText] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');
  const { isDarkTheme } = useTheme();
  const themeColors = getThemeColors(isDarkTheme);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setText(e.target.value);
    },
    [],
  );

  const remainingCount = useMemo(
    () => todos.filter((t) => !t.completed).length,
    [todos],
  );

  const filteredTodos = useMemo(() => {
    if (filter === 'active') return todos.filter((t) => !t.completed);
    if (filter === 'completed') return todos.filter((t) => t.completed);
    return todos;
  }, [todos, filter]);

  const handlePressEnter = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      const value = (e.currentTarget as HTMLInputElement).value.trim();
      if (!value) return;
      addTodo(value);
      setText('');
    },
    [addTodo],
  );

  return (
    <div style={wrapperStyle}>
      <div style={getStackBarStyle(0, themeColors.cardBackground)} />
      <div style={getStackBarStyle(1, themeColors.cardBackground)} />
      <div
        style={{
          ...appContainerStyle,
          position: 'relative',
          zIndex: 5,
          backgroundColor: themeColors.cardBackground,
          color: themeColors.titleText,
        }}
      >
        <div
          style={{
            ...headerStyle,
            borderBottom: `2px solid ${themeColors.subtleBorder}`,
          }}
        >
          <Input
            style={{ ...inputStyle, color: themeColors.titleText }}
            variant="borderless"
            size="large"
            placeholder="What needs to be done?"
            prefix={
              <DownOutlined
                style={{
                  color: isDarkTheme
                    ? themeColors.filterButtonBorder
                    : '#E6E6E6',
                }}
              />
            }
            value={text}
            onChange={handleInputChange}
            onPressEnter={handlePressEnter}
          />
        </div>
        <ul style={listStyle}>
          {filteredTodos.map((todo) => (
            <li
              key={todo.id}
              style={{
                ...listItemStyle,
                borderBottom: `1px solid ${themeColors.subtleBorder}`,
              }}
            >
              <Button
                type="text"
                style={listItemButtonStyle}
                onClick={() => toggleTodo(todo.id)}
                block
              >
                <div
                  role="checkbox"
                  aria-checked={todo.completed}
                  tabIndex={0}
                  style={getCheckboxStyle(todo.completed)}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleTodo(todo.id);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleTodo(todo.id);
                    }
                  }}
                  aria-label={
                    todo.completed ? 'Mark as active' : 'Mark as completed'
                  }
                >
                  {todo.completed ? (
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M20 6L9 17L4 12"
                        stroke="#8cc5b5"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : null}
                </div>
                <span
                  style={{
                    textDecoration: todo.completed ? 'line-through' : 'none',
                    color: todo.completed ? '#9e9e9e' : 'inherit',
                    fontSize: 18,
                  }}
                >
                  {todo.text}
                </span>
              </Button>
            </li>
          ))}
        </ul>
        <div style={footerStyle}>
          <div style={{ color: '#858585' }}>
            {remainingCount} {remainingCount === 1 ? 'item' : 'items'} left
          </div>
          <div style={filtersContainerStyle}>
            {(['all', 'active', 'completed'] as const).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                style={{
                  ...filterButtonStyle,
                  border: `1px solid ${themeColors.filterButtonBorder}`,
                  background:
                    filter === f
                      ? themeColors.cardBackground
                      : themeColors.filterButtonBg,
                  color: themeColors.filterButtonText,
                }}
              >
                {f[0].toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
          <Button
            onClick={clearCompleted}
            disabled={todos.every((t) => !t.completed)}
            type="text"
            style={{
              ...filterButtonStyle,
              opacity: todos.some((t) => t.completed) ? 1 : 0.5,
            }}
          >
            Clear completed
          </Button>
        </div>
      </div>
    </div>
  );
}
