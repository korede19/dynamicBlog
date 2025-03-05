import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";
import { app } from "@/lib/firebase";

const db = getFirestore(app);

interface BlogPost {
  id: string;
  title: string;
  imageUrl: string;
  content: string;
  categoryId: string;
  createdAt: Date;
  updatedAt: Date;
}

export async function fetchPostsByCategory(categoryId: string): Promise<BlogPost[]> {
  const postsRef = collection(db, "posts");
  const q = query(postsRef, where("categoryId", "==", categoryId));
  const querySnapshot = await getDocs(q);

  const posts: BlogPost[] = [];
  querySnapshot.forEach((doc) => {
    posts.push({ id: doc.id, ...doc.data() } as BlogPost);
  });

  return posts;
}