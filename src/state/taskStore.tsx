// src/state/taskStore.tsx
import type { ReactNode, Dispatch } from "react";  // 👈 Dispatch 추가
import {
  createContext,
  useContext,
  useReducer,
  useCallback,
} from "react";
import type { Task, FocusSession, Project } from "../types/task";

interface TaskState {
  tasks: Task[];
  sessions: FocusSession[];
  runningTaskId: string | null;
  timerSec: number;
  isRunning: boolean;
  projects: Project[];        // ✅ 추가
}

type TaskAction =
  | {
    type: "ADD_TASK";
    payload: { title: string; date: string; tags?: string[] };
  }
  | { type: "START_FOCUS"; payload: { taskId: string } }
  | { type: "STOP_FOCUS" }
  | { type: "TICK" }
  | { type: "COMPLETE_TASK"; payload: { taskId: string } }
  | { type: "ADD_PROJECT"; payload: { name: string } };   // ✅ 추가

const initialState: TaskState = {
  tasks: [],
  sessions: [],
  runningTaskId: null,
  timerSec: 0,
  isRunning: false,
  projects: [],        // ✅ 추가
};

function taskReducer(state: TaskState, action: TaskAction): TaskState {
  switch (action.type) {
    case "ADD_TASK": {
      const { title, date, tags = [] } = action.payload;
      const newTask: Task = {
        id: crypto.randomUUID(),
        title,
        date,
        tags,
        totalFocusSec: 0,
        isCompleted: false,
      };
      return {
        ...state,
        tasks: [newTask, ...state.tasks],
      };
    }

    case "START_FOCUS": {
      const { taskId } = action.payload;
      return {
        ...state,
        runningTaskId: taskId,
        timerSec: 0,
        isRunning: true,
      };
    }

    case "TICK": {
      if (!state.isRunning) return state;
      return {
        ...state,
        timerSec: state.timerSec + 1,
      };
    }

    case "STOP_FOCUS": {
      if (!state.runningTaskId || state.timerSec === 0) {
        return {
          ...state,
          runningTaskId: null,
          timerSec: 0,
          isRunning: false,
        };
      }

      const now = new Date();
      const durationSec = state.timerSec;

      const newSession: FocusSession = {
        id: crypto.randomUUID(),
        taskId: state.runningTaskId,
        startedAt: new Date(
          now.getTime() - durationSec * 1000
        ).toISOString(),
        endedAt: now.toISOString(),
        durationSec,
      };

      const updatedTasks = state.tasks.map((task) =>
        task.id === state.runningTaskId
          ? {
            ...task,
            totalFocusSec: task.totalFocusSec + durationSec,
          }
          : task
      );

      return {
        ...state,
        sessions: [newSession, ...state.sessions],
        tasks: updatedTasks,
        runningTaskId: null,
        timerSec: 0,
        isRunning: false,
      };
    }
    case "ADD_PROJECT": {
      const { name } = action.payload;
      const newProject: Project = {
        id: crypto.randomUUID(),
        name,
        createdAt: new Date().toISOString(),
      };

      return {
        ...state,
        projects: [...state.projects, newProject],
      };
    }

    case "COMPLETE_TASK": {
      const { taskId } = action.payload;
      return {
        ...state,
        tasks: state.tasks.map((t) =>
          t.id === taskId ? { ...t, isCompleted: true } : t
        ),
      };
    }

    default:
      return state;
  }
}

const TaskStateContext = createContext<TaskState | undefined>(undefined);
const TaskDispatchContext = createContext<Dispatch<TaskAction> | undefined>(
  undefined
);

export function TaskProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(taskReducer, initialState);

  return (
    <TaskStateContext.Provider value={state}>
      <TaskDispatchContext.Provider value={dispatch}>
        {children}
      </TaskDispatchContext.Provider>
    </TaskStateContext.Provider>
  );
}

export function useTaskState() {
  const ctx = useContext(TaskStateContext);
  if (!ctx) {
    throw new Error("useTaskState must be used within TaskProvider");
  }
  return ctx;
}

export function useTaskDispatch() {
  const ctx = useContext(TaskDispatchContext);
  if (!ctx) {
    throw new Error("useTaskDispatch must be used within TaskProvider");
  }
  return ctx;
}

export function useTaskActions() {
  const dispatch = useTaskDispatch();

  const addTask = useCallback(
    (args: { title: string; date: string; tags?: string[] }) => {
      dispatch({ type: "ADD_TASK", payload: args });
    },
    [dispatch]
  );

  const startFocus = useCallback(
    (taskId: string) => {
      dispatch({ type: "START_FOCUS", payload: { taskId } });
    },
    [dispatch]
  );

  const stopFocus = useCallback(() => {
    dispatch({ type: "STOP_FOCUS" });
  }, [dispatch]);

  const tick = useCallback(() => {
    dispatch({ type: "TICK" });
  }, [dispatch]);

  const completeTask = useCallback(
    (taskId: string) => {
      dispatch({ type: "COMPLETE_TASK", payload: { taskId } });
    },
    [dispatch]
  );

  const addProject = useCallback(
    (name: string) => {
      dispatch({ type: "ADD_PROJECT", payload: { name } });
    },
    [dispatch]
  );

  return { addTask, startFocus, stopFocus, tick, completeTask, addProject };
}