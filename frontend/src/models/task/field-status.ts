export type TaskStatus = 'todo' | 'in_progress' | 'done';

export const TaskStatusOptions = {
  TODO: 'todo',
  IN_PROGRESS: 'in_progress',
  DONE: 'done',
};

//export type TaskStatus = ValueOf<typeof TaskOptions>;
//export type ValueOf<T> = T[keyof T];
