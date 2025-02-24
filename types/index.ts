// src/types/index.ts
export interface BlogPost {
  id: string;
  title: string;
  content: string;
  slug: string;
  categoryId: string;
  createdAt: Date;
  updatedAt: Date;
  imageUrl?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
}