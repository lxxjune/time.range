import "./App.css";
import {
  TaskProvider,
  useTaskState,
  useTaskActions,
} from "./state/taskStore";
import type { PeriodFilter } from "./types/task";
import { AppLayout } from "./components/layout/AppLayout";
import { TodayView } from "./pages/TodayView";
import { useState } from "react";

function AppInner() {
  const [currentView, setCurrentView] = useState<PeriodFilter>("today");
  const [focusTaskId] = useState<string | null>(null);
  const { tasks, sessions, projects } = useTaskState();   // ✅ projects 추가
  const { addProject } = useTaskActions();                // ✅ 액션 사용

  const totalFocusSec = sessions.reduce(
    (sum, s) => sum + s.durationSec,
    0
  );
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.isCompleted).length;
  const pendingTasks = totalTasks - completedTasks;

  const handleAddNew = () => {
    const name = window.prompt("New project name");
    if (!name) return;
    const trimmed = name.trim();
    if (!trimmed) return;
    addProject(trimmed);
  };

  if (focusTaskId) {
    // 나중에 FocusScreen 붙일 자리
    return <div>Focus screen placeholder</div>;
  }

  return (
    <AppLayout
      currentView={currentView}
      onChangeView={setCurrentView}
      onAddNew={handleAddNew}
      topStats={{
        totalFocusSec,
        totalTasks,
        completedTasks,
        pendingTasks,
      }}
      projects={projects}   // ✅ 추가
    >
      {currentView === "today" && <TodayView />}
      ...
    </AppLayout>
  );
}

function App() {
  return (
    <TaskProvider>
      <AppInner />
    </TaskProvider>
  );
}

export default App;