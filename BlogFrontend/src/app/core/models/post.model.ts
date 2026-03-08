export interface Post {
  id: number;
  title: string;
  extract?: string;
  content?: string;
  status?: number;
  userId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PostCategory {
  id: number;
  postId: number;
  categoryId: number;
}

export interface PostTag {
  id: number;
  postId: number;
  tagId: number;
}
