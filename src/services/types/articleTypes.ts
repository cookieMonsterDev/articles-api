export interface ArticleTypes {
  user_id: string;
  author: string;
  author_picture: string;
  title: string;
  description: string;
  article_content: string;
  tags: string[];
  comments: [];
}

export interface InputArticleTypes {
  title: string;
  description?: string;
  article_content: string;
  tags?: string[];
}

export interface OutputArticleTypes {
  id: string;
  user_id: string;
  author: string;
  author_picture: string;
  title: string;
  description: string;
  article_content: string;
  tags: string[];
  comments: any[];
  createdAt: Date;
  updatedAt: Date;
}
