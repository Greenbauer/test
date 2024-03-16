export interface Comment {
  commentId: string;
  parentId: string | null;
  displayName: string;
  text: string;
  createdAt: string;
}

export interface Post {
  postId: string;
  postUrl: string;
  title: string;
  createdAt: string;
  numHugs: number;
  patientDescription: string;
  assessment: string;
  question: string;
  comments: Comment[];
}
