export type Post = {
  _id: string;
  author_id: string;
  author_username: string,
  commentsCount: number;
  content: string;
  title: string;
  upvoted: boolean;
  upvotesCount: number;
  createdAt: string;
};

export type Comment = {
  _id: string,
  author_id: string,
  author_username: string,
  content: string,
  upvotesCount: number,
  upvoted: boolean,
  createdAt: string,
}

export type User = {
  token: string;
  email: string;
  username: string;
  id: string;
};