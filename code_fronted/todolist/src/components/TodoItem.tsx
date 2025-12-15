// src/components/TodoItem.tsx
import React from 'react';
import type { Todo } from '@/types/todo';

// 定义组件的 props 接口
interface TodoItemProps {
    todo: Todo;
    onToggleComplete: (id: number) => void;
    onDeleteTodo: (id: number) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggleComplete, onDeleteTodo }) => {
    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                padding: '10px',
                borderBottom: '1px solid #eee',
                backgroundColor: todo.completed ? '#f0f0f0' : 'white', // 完成的项背景色稍灰
            }}
        >
            {/* 复选框：点击切换完成状态 */}
            <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => onToggleComplete(todo.id)}
                style={{ marginRight: '10px' }}
            />

            {/* 待办事项文本 */}
            <span
                style={{
                    flexGrow: 1,
                    textDecoration: todo.completed ? 'line-through' : 'none', // 完成的项显示删除线
                    color: todo.completed ? '#999' : '#333',
                }}
            >
                {todo.text}
            </span>

            {/* 删除按钮 */}
            <button onClick={() => onDeleteTodo(todo.id)} style={{ marginLeft: '10px' }}>
                删除
            </button>
        </div>
    );
};

export default TodoItem;