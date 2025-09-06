
import React, { useState, useEffect, useRef } from 'react';
import './TodoList.css';

const TodoList = () => {
    const [todos, setTodos] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const isInitialMount = useRef(true);

    useEffect(() => {
        const todoList = localStorage.getItem('todos');
        try {
            const todo = JSON.parse(todoList);
            setTodos(todo || []);
        } catch (error) {
            console.log('json解析错误');
        }
    }, []);

    useEffect(() => {
        // 首次执行不加载
        if (isInitialMount.current) {
            isInitialMount.current = false;
        } else {
            // 每次todos变化保存到localStorage
            localStorage.setItem('todos', JSON.stringify(todos));
        }
    }, [todos])

    // 添加函数
    const handleAddTodo = () => {
        if (inputValue.length) {
            setTodos((pre) => pre.concat({
                id: new Date().getTime(),
                text: inputValue
            }));
            setInputValue(''); // 添加完成之后清空
        }
    }

    // 回车添加
    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            handleAddTodo()
        }
    }

    // 删除
    const handleDeleteTodo = (item) => {
        setTodos((pre) => pre.filter(it => it.id !== item.id));
    }

    const editStatus = (id, key) => {
        setTodos(() => todos.map(it => {
            if (it.id === id) {
                return {
                    ...it,
                    [key]: !it[key]
                }
            } else {
                return {
                    ...it,
                }
            }
        }))
    }

    // 保存
    const save = (id, key, value, isEdable) => {
        setTodos(() => todos.map(it => {
            if (it.id === id) {
                return {
                    ...it,
                    [key]: value,
                    isEditing: isEdable ? !it.isEditing : it.isEditing
                }
            } else {
                return {
                    ...it,
                }
            }
        }))
    }

    return (
        <div className="todo-container">
            <h2>待办事项</h2>
            <div className='todo-selection'>
                <input
                    type="text"
                    className="todo-input"
                    value={inputValue}
                    onChange={(e) => {
                        setInputValue(e.target.value);
                    }}
                    onKeyDown={handleKeyDown}
                    placeholder="请输入待办事项..."
                />
                <button disabled={!inputValue.length || todos.some(item => item.text === inputValue)} className="add-button" onClick={handleAddTodo}>
                    添加
                </button>
            </div>
            <div className='todo-list'>
                {
                    (todos || []).map(item => {
                        return <div key={item.id} className='todos-item'>
                            {
                                item.isEditing ? <>
                                    <input
                                        type="text"
                                        className="todo-input"
                                        defaultValue={item.text}
                                        onChange={(e) => {
                                            save(item.id, 'editValue', e.target.value, false)
                                        }}
                                        onKeyDown={(event) => {
                                            if (event.key === 'Enter') {
                                                event.preventDefault();
                                                save(item.id, 'text', item.editValue, true)
                                            }
                                        }}
                                    />
                                </> : <p>
                                    {item.text}
                                </p>
                            }
                            {
                                item?.isEditing ? <div>
                                    <button onClick={() => {
                                        save(item.id, 'text', item.editValue, true)
                                    }} className="edit-button">
                                        保存
                                    </button>
                                    <button onClick={() => {
                                        editStatus(item.id, 'isEditing')
                                    }} className="edit-button">
                                        取消
                                    </button>
                                </div> : <div>
                                    <button onClick={() => {
                                        editStatus(item.id, 'isEditing')
                                    }} className="edit-button">
                                        编辑
                                    </button>
                                    <button className="del-button" onClick={() => handleDeleteTodo(item)}>
                                        删除
                                    </button>
                                    <input checked={item.isComputed} onChange={() => {
                                        editStatus(item.id, 'isComputed')
                                    }} type='checkBox' />{item.isComputed ? '取消完成' : '完成待办'}
                                </div>
                            }
                        </div>
                    })
                }
            </div>
        </div>
    );
};

export default TodoList;