interface TopStatsBarProps {
    totalFocusSec: number;
    totalTasks: number;
    completedTasks: number;
    pendingTasks: number;
  }
  
  function formatDuration(sec: number) {
    const hours = Math.floor(sec / 3600);
    const minutes = Math.floor((sec % 3600) / 60);
    const seconds = sec % 60;
    if (hours > 0) return `${hours}h ${minutes}m`;
    if (minutes > 0) return `${minutes}m ${seconds}s`;
    return `${seconds}s`;
  }
  
  export function TopStatsBar({
    totalFocusSec,
    totalTasks,
    completedTasks,
    pendingTasks,
  }: TopStatsBarProps) {
    return (
      <section className="top-stats">
        <div className="top-stats__item">
          <span className="top-stats__label">Today's focus</span>
          <span className="top-stats__value">
            {formatDuration(totalFocusSec)}
          </span>
        </div>
        <div className="top-stats__item">
          <span className="top-stats__label">Total tasks</span>
          <span className="top-stats__value">{totalTasks}</span>
        </div>
        <div className="top-stats__item">
          <span className="top-stats__label">Completed</span>
          <span className="top-stats__value">{completedTasks}</span>
        </div>
        <div className="top-stats__item">
          <span className="top-stats__label">Remaining</span>
          <span className="top-stats__value">{pendingTasks}</span>
        </div>
      </section>
    );
  }