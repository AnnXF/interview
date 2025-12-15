// src/components/TodoForm.tsx
import React, { useState } from 'react';

// 定义组件的 props 接口
interface TodoFormProps {
    onAddTodo: (text: string) => void;
}

const TodoForm: React.FC<TodoFormProps> = ({ onAddTodo }) => {
    // 用于存储用户输入的状态
    const [inputText, setInputText] = useState('');

    // 处理表单提交的函数
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault(); // 阻止表单默认提交行为
        const trimmedText = inputText.trim();

        if (trimmedText) {
            onAddTodo(trimmedText); // 调用父组件传入的添加函数
            setInputText(''); // 清空输入框
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
            <input
                type="text"
                placeholder="输入新的待办事项"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                style={{ padding: '8px', marginRight: '10px', width: '300px' }}
            />
            <button type="submit" disabled={!inputText.trim()}>
                添加
            </button>
        </form>
    );
};

export default TodoForm;