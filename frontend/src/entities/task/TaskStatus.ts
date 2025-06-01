export type TaskStatus = 'todo' | 'in_progress' | 'done';

export enum TaskStatusOptions {
  todo = 'To Do',
  in_progress = 'In Progress',
  done = 'Done',
}

export const taskStatusKeys = Object.keys(TaskStatusOptions) as [keyof typeof TaskStatusOptions]
