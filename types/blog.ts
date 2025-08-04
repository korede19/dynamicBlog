export interface FirestoreTimestamp {
  toDate: () => Date;
}

export interface BlogPost {
  id: string;
  title: string;
  imageUrl: string;
  content: string;
  categoryId: string;
  createdAt: Date | FirestoreTimestamp;
  updatedAt: Date | FirestoreTimestamp;
  slug?: string;
}

export interface CategorySliderProps {
  categoryId: string;
  categoryName: string;
}