import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useEffect,
  useState,
} from 'react';

export type TodoItem = {
  id: string;
  text: string;
  completed: boolean;
};

type TodoContextValue = {
  todos: TodoItem[];
  addTodo: (text: string) => void;
  toggleTodo: (id: string) => void;
  clearCompleted: () => void;
  replaceTodos: (todos: TodoItem[]) => void;
  getMarkdownString: () => string;
  loadFromMarkdownText: (markdownText: string) => void;
};

const TodoContext = createContext<TodoContextValue | undefined>(undefined);

function generateId(): string {
  return Math.random().toString(36).slice(2, 10);
}

function serializeTodosToMarkdown(todos: TodoItem[]): string {
  return todos
    .map((t) => `- [${t.completed ? 'x' : ' '}] ${t.text}`)
    .join('\n');
}

function parseMarkdownToTodos(markdownText: string): TodoItem[] {
  return markdownText
    .split(/\r?\n/)
    .map((rawLine) => rawLine.trim())
    .filter((line) => line.length > 0)
    .map((line) => {
      const match = /^-\s*\[( |x|X)\]\s*(.*)$/.exec(line);
      if (match) {
        const completed = match[1].toLowerCase() === 'x';
        const text = match[2].trim();
        return text ? { id: generateId(), text, completed } : null;
      }
      return { id: generateId(), text: line, completed: false } as TodoItem;
    })
    .filter((t): t is TodoItem => t !== null);
}

export function TodoProvider({ children }: { children: React.ReactNode }) {
  const STORAGE_KEY = 'todo_app.todos';

  const [todos, setTodos] = useState<TodoItem[]>(() => {
    try {
      if (typeof window === 'undefined') return [];
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw) as unknown;
      if (!Array.isArray(parsed)) return [];
      return parsed
        .map((item) => {
          if (
            item &&
            typeof item === 'object' &&
            'id' in item &&
            'text' in item &&
            'completed' in item
          ) {
            const id = String((item as any).id);
            const text = String((item as any).text);
            const completed = Boolean((item as any).completed);
            return { id, text, completed } as TodoItem;
          }
          return null;
        })
        .filter((t): t is TodoItem => t !== null);
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      if (typeof window === 'undefined') return;
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    } catch {
      // ignore
    }
  }, [todos]);

  const addTodo = useCallback((text: string) => {
    const value = text.trim();
    if (!value) return;
    setTodos((prev) => [
      ...prev,
      { id: generateId(), text: value, completed: false },
    ]);
  }, []);

  const toggleTodo = useCallback((id: string) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
    );
  }, []);

  const clearCompleted = useCallback(() => {
    setTodos((prev) => prev.filter((t) => !t.completed));
  }, []);

  const replaceTodos = useCallback((next: TodoItem[]) => {
    setTodos(next);
  }, []);

  const getMarkdownString = useCallback(
    () => serializeTodosToMarkdown(todos),
    [todos],
  );

  const loadFromMarkdownText = useCallback((markdownText: string) => {
    const parsed = parseMarkdownToTodos(markdownText);
    setTodos(parsed);
  }, []);

  const value = useMemo<TodoContextValue>(
    () => ({
      todos,
      addTodo,
      toggleTodo,
      clearCompleted,
      replaceTodos,
      getMarkdownString,
      loadFromMarkdownText,
    }),
    [
      todos,
      addTodo,
      toggleTodo,
      clearCompleted,
      replaceTodos,
      getMarkdownString,
      loadFromMarkdownText,
    ],
  );

  return <TodoContext.Provider value={value}>{children}</TodoContext.Provider>;
}

export function useTodos(): TodoContextValue {
  const ctx = useContext(TodoContext);
  if (!ctx) throw new Error('useTodos must be used within TodoProvider');
  return ctx;
}
