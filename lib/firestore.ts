import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  orderBy,
} from "firebase/firestore";
import { app } from "@/lib/firebase";

const db = getFirestore(app);

interface FirestoreTimestamp {
  toDate(): Date;
}

interface BlogPost {
  id: string;
  title: string;
  imageUrl: string;
  content: string;
  categoryId: string;
  createdAt: Date | FirestoreTimestamp;
  updatedAt: Date | FirestoreTimestamp;
  slug?: string;
}

export async function fetchPostsByCategory(
  categoryId: string
): Promise<BlogPost[]> {
  try {
    const postsRef = collection(db, "posts");
    const q = query(postsRef, where("categoryId", "==", categoryId));
    const querySnapshot = await getDocs(q);

    const posts: BlogPost[] = [];
    querySnapshot.forEach((doc) => {
      if (doc.exists()) {
        const data = doc.data();
        posts.push({
          id: doc.id,
          title: data.title || "",
          imageUrl: data.imageUrl || "",
          content: data.content || "",
          categoryId: data.categoryId || "",
          createdAt: data.createdAt || new Date(),
          updatedAt: data.updatedAt || new Date(),
          slug: data.slug || ""
        });
      }
    });

    return posts;
  } catch (error) {
    console.error("Error fetching posts by category:", error);
    return []; // Return empty array instead of throwing
  }
}

export async function fetchAllPosts(): Promise<BlogPost[]> {
  try {
    const postsRef = collection(db, "posts");
    const q = query(postsRef, orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);

    const posts: BlogPost[] = [];
    querySnapshot.forEach((doc) => {
      if (doc.exists()) {
        const data = doc.data();
        posts.push({
          id: doc.id,
          title: data.title || "",
          imageUrl: data.imageUrl || "",
          content: data.content || "",
          categoryId: data.categoryId || "",
          createdAt: data.createdAt || new Date(),
          updatedAt: data.updatedAt || new Date(),
          slug: data.slug || ""
        });
      }
    });

    return posts;
  } catch (error) {
    console.error("Error fetching all posts:", error);
    return []; // Return empty array instead of throwing
  }
}