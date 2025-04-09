
import React, { useState, useEffect } from "react";
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/todos", 
});

function TodoApp() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [alertModal, setAlertModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(null);
  const [reversed, setReversed] = useState(false);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await api.get("/");
        setTasks(response.data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };
    fetchTasks();
  }, []);

  const handleAdd = async () => {
    if (!title.trim()) {
      setAlertModal(true);
      return;
    }
  
    try {
      const response = await api.post("/", {
        task: title,
        completed: false,
      });
  
      setTasks([...tasks, response.data]); 
      setTitle(""); 
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const handleComplete = async (id) => {
    try {
      const task = tasks.find(task => task._id === id);
      const updatedTask = { ...task, completed: !task.completed };
  
      await api.patch(`/${id}`, updatedTask);  
  
      setTasks(tasks.map(t => t._id === id ? updatedTask : t));
    } catch (error) {
      console.error("Error completing task:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/${deleteModal}`);
      setTasks(tasks.filter(task => task._id !== deleteModal));
      setDeleteModal(null);
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  return (
    <div className="max-w-[640px] mx-auto p-5 bg-gray-100 rounded-lg shadow-lg border border-gray-300">
      <h1 className="text-4xl mb-5 text-center font-bold text-blue-600">Tasks</h1>

      {}
      <div className="flex justify-center gap-3 mb-4">
        <input
          className="p-2 border rounded shadow w-full"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter task title..."
        />
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded shadow"
          onClick={handleAdd}
        >
          Add
        </button>
      </div>

      {}
      <div className="space-y-3">
        {tasks.length === 0 && <p className="text-center text-gray-500">No tasks</p>}
        {(reversed ? [...tasks].reverse() : tasks).map(task => (
          <div
            className={`border rounded shadow p-3 flex justify-between items-center bg-white ${task.completed ? 'bg-green-200' : ''}`}
            key={task._id}
          >
            <span className={`text-lg ${task.completed ? 'line-through text-gray-500' : ''}`}>
              {reversed ? task.task.split('').reverse().join('') : task.task}
            </span>

            <div className="flex gap-2">
              <button
                className="bg-green-500 text-white px-3 py-1 rounded"
                onClick={() => handleComplete(task._id)}
              >
                {task.completed ? "Undo" : "Complete"}
              </button>
              <button
                className="bg-red-500 text-white px-3 py-1 rounded"
                onClick={() => setDeleteModal(task._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {}
      {alertModal && (
        <div className="absolute z-10 p-5 rounded-lg shadow-lg border border-gray-300 bg-white" style={{ top: '20%', left: '50%', transform: 'translate(-50%, -20%)' }}>
          <p className="mb-4">Task title cannot be empty!</p>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={() => setAlertModal(false)}
          >
            OK
          </button>
        </div>
      )}

      {}
      {deleteModal && (
        <div className="absolute z-10 p-5 rounded-lg shadow-lg border border-gray-300 bg-white" style={{ top: '20%', left: '50%', transform: 'translate(-50%, -20%)' }}>
          <p className="mb-4">Are you sure you want to delete this task?</p>
          <div className="flex gap-3">
            <button
              className="bg-gray-400 text-white px-4 py-2 rounded"
              onClick={() => setDeleteModal(null)}
            >
              Cancel
            </button>
            <button
              className="bg-red-500 text-white px-4 py-2 rounded"
              onClick={handleDelete}
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default TodoApp 