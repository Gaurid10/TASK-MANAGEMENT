import { createSlice } from "@reduxjs/toolkit";
import Task from '../Task'; 


const loadTasksFromLocalStorage = () => {
  try {
    const savedTasks = localStorage.getItem("tasks");
    return savedTasks ? JSON.parse(savedTasks) : Task.tasks || [];
  } catch (error) {
    console.error("Error loading tasks from localStorage:", error);
    return Task.tasks || [];
  }
};


const saveTasksToLocalStorage = (tasks) => {
  try {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  } catch (error) {
    console.error("Error saving tasks to localStorage:", error);
  }
};


const formatDateToISO = (dateString) => {
  const date = new Date(dateString);
  return !isNaN(date) ? date.toISOString() : new Date().toISOString();
};

const taskSlice = createSlice({
  name: "tasks",
  initialState: {
    tasks: loadTasksFromLocalStorage(),
  },
  reducers: {
    addTask: (state, action) => {
      const newTask = {
        ...action.payload,
        createdAt: formatDateToISO(action.payload.createdAt), 
      };
      state.tasks.push(newTask);
      saveTasksToLocalStorage(state.tasks);
    },
    updateTask: (state, action) => {
      const index = state.tasks.findIndex((task) => task.id === action.payload.id);
      if (index !== -1) {
        state.tasks[index] = {
          ...action.payload,
          createdAt: formatDateToISO(action.payload.createdAt), 
        };
        saveTasksToLocalStorage(state.tasks);
      }
    },
    deleteTask: (state, action) => {
      state.tasks = state.tasks.filter((task) => task.id !== action.payload);
      saveTasksToLocalStorage(state.tasks);
    },
  },
});

export const { addTask, updateTask, deleteTask } = taskSlice.actions;
export default taskSlice.reducer;

