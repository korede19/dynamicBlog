import { BlogPost, FirestoreTimestamp } from "../types/blog";

export const stripHtmlTags = (html: string): string => {
  return html.replace(/<[^>]*>?/gm, "");
};

export const formatDate = (dateValue: Date | FirestoreTimestamp): string => {
  if (!dateValue) return "No date";

  let date: Date;

  if ("toDate" in dateValue) {
    date = dateValue.toDate();
  } else {
    date = dateValue as Date;
  }

  if (isNaN(date.getTime())) {
    return "Invalid date";
  }

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const sortPostsByDate = (posts: BlogPost[]): BlogPost[] => {
  return posts.sort((a, b) => {
    if (!a.createdAt || !b.createdAt) return 0;

    const dateA = "toDate" in a.createdAt 
      ? a.createdAt.toDate() 
      : new Date(a.createdAt);
    const dateB = "toDate" in b.createdAt 
      ? b.createdAt.toDate() 
      : new Date(b.createdAt);
    
    return dateB.getTime() - dateA.getTime();
  });
};

export type { FirestoreTimestamp };
