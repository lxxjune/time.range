import type { PeriodFilter, Project } from "../../types/task";

interface SidebarProps {
  isOpen: boolean;
  currentView: PeriodFilter;
  onChangeView: (view: PeriodFilter) => void;
  onAddNew: () => void;
  onClose: () => void;
  projects?: Project[];   // ← optional 로 바꾸기
}

const menuItems: { label: string; value: PeriodFilter }[] = [
  { label: "Today", value: "today" },
  { label: "This week", value: "week" },
  { label: "This month", value: "month" },
  { label: "Completed", value: "completed" },
];

export function Sidebar({
  isOpen,
  currentView,
  onChangeView,
  onAddNew,
  onClose,
  projects = [],
}: SidebarProps) {
  return (
    <aside
      className={`sidebar ${
        isOpen ? "sidebar--open" : "sidebar--collapsed-mobile"
      }`}
    >
      <div className="sidebar__inner">
        <div className="sidebar__header">
          <h2 className="sidebar__title">Menu</h2>
          <button className="sidebar__close" onClick={onClose}>
            ✕
          </button>
        </div>

        <nav className="sidebar__nav">
          <ul>
            {menuItems.map((item) => (
              <li key={item.value}>
                <button
                  className={`sidebar__nav-item ${
                    currentView === item.value
                      ? "sidebar__nav-item--active"
                      : ""
                  }`}
                  onClick={() => onChangeView(item.value)}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {projects.length > 0 && (
          <div className="sidebar__projects">
            <div className="sidebar__projects-label">Projects</div>
            <ul className="sidebar__projects-list">
              {projects.map((project) => (
                <li key={project.id} className="sidebar__projects-item">
                  {project.name}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="sidebar__footer">
          <button className="sidebar__add-button" onClick={onAddNew}>
            + Add new
          </button>
        </div>
      </div>
    </aside>
  );
}