import { useState } from "react";
import { useTaskState, useTaskActions } from "../state/taskStore";

export function TodayView() {
  const { tasks } = useTaskState();
  const { addTask } = useTaskActions();

  const [isAdding, setIsAdding] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDate, setNewTaskDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    addTask({ title: newTaskTitle, date: newTaskDate });
    setNewTaskTitle("");
    setIsAdding(false);
  };

  return (
    <div className="today-view">
      <h2 className="today-view__title">Today</h2>
      {tasks.length === 0 ? (
        <p className="today-view__empty">No tasks yet. Add a new one!</p>
      ) : (
        <ul className="today-view__list">
          {tasks.map((task) => (
            <li key={task.id} className="today-view__item">
              <div className="today-view__item-main">
                <span className="today-view__item-title">{task.title}</span>
                <span className="today-view__item-date">{task.date}</span>
              </div>
              <div className="today-view__item-meta">
                {task.tags.map((tag) => (
                  <span key={tag} className="today-view__tag">
                    #{tag}
                  </span>
                ))}
              </div>
            </li>
          ))}
        </ul>
      )}

      {isAdding ? (
        <form className="task-form" onSubmit={handleSubmit}>
          <input
            type="text"
            className="task-form__input"
            placeholder="Task title..."
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            autoFocus
          />
          <div className="task-form__row">
            <input
              type="date"
              className="task-form__date"
              value={newTaskDate}
              onChange={(e) => setNewTaskDate(e.target.value)}
            />
            <div className="task-form__actions">
              <button
                type="button"
                className="task-form__button task-form__button--cancel"
                onClick={() => setIsAdding(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="task-form__button task-form__button--submit"
              >
                Add
              </button>
            </div>
          </div>
        </form>
      ) : (
        <button
          className="today-view__add-button"
          onClick={() => setIsAdding(true)}
          aria-label="Add Task"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          <span>Add New Task</span>
        </button>
      )}
    </div>
  );
}