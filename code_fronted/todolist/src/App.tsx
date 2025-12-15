// src/App.tsx
import { useState } from 'react';
import type { Todo } from '@/types/todo';
import TodoForm from '@/components/TodoForm';
import TodoItem from '@/components/TodoItem';

function App() {
  // 使用 useState 存储待办事项列表，初始为空数组
  const [todos, setTodos] = useState<Todo[]>([]);
  // 用于生成新的待办事项 ID
  const [nextId, setNextId] = useState(1);

  /**
   * 添加新的待办事项
   * @param text 待办事项的文本内容
   */
  const handleAddTodo = (text: string) => {
    const newTodo: Todo = {
      id: nextId,
      text: text,
      completed: false,
    };
    // 将新待办事项添加到列表的开头（通常是最新项在前）
    setTodos([newTodo, ...todos]);
    setNextId(nextId + 1); // ID 递增
  };

  /**
   * 切换待办事项的完成状态
   * @param id 待办事项的 ID
   */
  const handleToggleComplete = (id: number) => {
    setTodos(
      todos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  /**
   * 删除指定的待办事项
   * @param id 待办事项的 ID
   */
  const handleDeleteTodo = (id: number) => {
    // 过滤掉 ID 匹配的待办事项
    setTodos(todos.filter(todo => todo.id !== id));
  };

  return (
    <div style={{ maxWidth: '600px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h1>✅ 待办事项列表</h1>

      {/* 1. 添加待办事项的表单 */}
      <TodoForm onAddTodo={handleAddTodo} />

      {/* 2. 待办事项列表 */}
      <div>
        {todos.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#666' }}>暂无待办事项，快添加一个吧！</p>
        ) : (
          todos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggleComplete={handleToggleComplete}
              onDeleteTodo={handleDeleteTodo}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default App;