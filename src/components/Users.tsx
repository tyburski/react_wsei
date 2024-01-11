import React, { useState, useEffect } from "react";
import axios from "axios";
import "./style.css";

interface User {
  id: number;
  name: string;
  email: string;
}

interface Todo {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [lightboxOpen, setLightboxOpen] = useState<boolean>(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          "https://jsonplaceholder.typicode.com/users"
        );
        setUsers(response.data);
      } catch (error) {
        console.error("", error);
      }
    };

    fetchUsers();
  }, []);

  const handleOpenLightbox = async (userId: number) => {
    try {
      const response = await axios.get<Todo[]>(
        `https://jsonplaceholder.typicode.com/todos?userId=${userId}`
      );

      setTodos(response.data);
    } catch (error) {
      console.error("", error);
    }

    setLightboxOpen(true);
  };
  return (
    <div className="users">
      <h2>UŻYTKOWNICY</h2>
      <div className="user-grid">
        {users.map((user) => (
          <div
            key={user.id}
            className="user-item"
            onClick={() => handleOpenLightbox(user.id)}
          >
            <h4>{user.name}</h4>
            <p>{user.email}</p>
          </div>
        ))}
      </div>
      {lightboxOpen && (
        <div
          className="todo-lightbox-overlay"
          onClick={() => setLightboxOpen(false)}
        >
          <div className="todo-section">
            <ul>
              {todos.map((todo) => (
                <li key={todo.id} className="todo">
                  {todo.completed ? "✅" : "❌"}
                  {todo.title}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
