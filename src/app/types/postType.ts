export type Post = {
  _id: string;
  author_id: string;
  commentsCount: number;
  content: string;
  title: string;
  upvoted: boolean;
  upvotesCount: number;
};