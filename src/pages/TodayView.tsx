import { useTaskState } from "../state/taskStore";

export function TodayView() {
  const { tasks } = useTaskState();

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
    </div>
  );
}