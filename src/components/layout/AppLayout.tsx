// src/components/layout/AppLayout.tsx
import type { ReactNode } from "react"; // ✅ 타입용
import { useState } from "react";       // ✅ 값(import)
import { Sidebar } from "./Sidebar";
import { TopStatsBar } from "./TopStatsBar";
import type { PeriodFilter, Project } from "../../types/task";

interface AppLayoutProps {
  children: ReactNode;
  currentView: PeriodFilter;
  onChangeView: (view: PeriodFilter) => void;
  onAddNew: () => void;
  topStats?: {
    totalFocusSec: number;
    totalTasks: number;
    completedTasks: number;
    pendingTasks: number;
  };
  projects: Project[];   // ✅ 추가
}

export function AppLayout({
  children,
  currentView,
  onChangeView,
  onAddNew,
  topStats,
  projects,
}: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleToggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  const handleCloseSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="app-root">
      {/* 모바일 헤더 */}
      <header className="app-header">
        <button
          className="app-header__menu-button"
          onClick={handleToggleSidebar}
        >
          ☰
        </button>
        <h1 className="app-header__title">TimeRange</h1>
      </header>

      <div className="app-body">
        <Sidebar
          isOpen={sidebarOpen}
          currentView={currentView}
          onChangeView={(v) => {
            onChangeView(v);
            handleCloseSidebar();
          }}
          onAddNew={onAddNew}
          onClose={handleCloseSidebar}
          projects={projects}   // ✅ 추가
        />

        <main className="app-main">
          {topStats && (
            <TopStatsBar
              totalFocusSec={topStats.totalFocusSec}
              totalTasks={topStats.totalTasks}
              completedTasks={topStats.completedTasks}
              pendingTasks={topStats.pendingTasks}
            />
          )}
          <div className="app-main__content">{children}</div>
        </main>
      </div>
    </div>
  );
}