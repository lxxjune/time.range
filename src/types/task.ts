export type PeriodFilter = "today" | "week" | "month" | "completed";

export interface FocusSession {
  id: string;
  taskId: string;
  startedAt: string;   // ISO string
  endedAt: string;     // ISO string
  durationSec: number; // seconds
}

export interface Task {
  id: string;
  title: string;
  date: string;        // YYYY-MM-DD
  tags: string[];
  totalFocusSec: number;
  isCompleted: boolean;
}

/** 사이드바에 쌓일 프로젝트 단위 */
export interface Project {
  id: string;
  name: string;
  createdAt: string;   // ISO string
}