export type Project = {
  id: number;
  title: string;
  description: string | null;
  ownerId: number | null;
  //owner: User | null;
  //tasks: Task[];
};
