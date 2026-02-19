import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { v4 as uuid } from 'uuid'

export interface Todo {
  id: string
  text: string
  completed: boolean
  createdAt: number
}

interface TodoStore {
  todos: Todo[]
  inputDraft: string
  addTodo: (text: string) => void
  setInputDraft: (text: string) => void
  toggleTodo: (id: string) => void
  deleteTodo: (id: string) => void
}

export const useTodoStore = create<TodoStore>()(
  persist(
    (set) => ({
      todos: [],
      inputDraft: '',
      addTodo: (text) => set((state) => ({
        todos: [
          { id: uuid(), text, completed: false, createdAt: Date.now() },
          ...state.todos
        ],
        inputDraft: '' 
      })),
      setInputDraft: (text) => set({ inputDraft: text }),
      toggleTodo: (id) => set((state) => ({
        todos: state.todos.map(t => 
          t.id === id ? { ...t, completed: !t.completed } : t
        )
      })),
      deleteTodo: (id) => set((state) => ({
        todos: state.todos.filter(t => t.id !== id)
      })),
    }),
    {
      name: 'todo-storage', // unique name for localStorage
    }
  )
)
