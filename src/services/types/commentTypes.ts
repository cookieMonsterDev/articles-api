export interface CommentTypes {
  user_id: string;
  author: string;
  author_picture: string;
  comment_content: string;
}

export interface InputCommentTypes {
  comment_content: string;
}

export interface OutputCommentTypes {
  user_id: string;
  author: string;
  author_picture: string;
  comment_content: string;
  createdAt: Date;
  updatedAt: Date;
}