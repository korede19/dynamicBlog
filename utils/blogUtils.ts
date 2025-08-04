export const stripHtmlTags = (html: string = "") => {
  return html.replace(/<[^>]*>?/gm, "");
};

export const formatDate = (dateValue: Date | FirestoreTimestamp | undefined) => {
  if (!dateValue) return "No date";

  try {
    let date: Date;
    
    if (dateValue && typeof dateValue === "object" && "toDate" in dateValue) {
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
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Invalid date";
  }
};

export const sortPostsByDate = (posts: BlogPost[]) => {
  return [...posts].sort((a, b) => {
    try {
      const dateA = a.createdAt && "toDate" in a.createdAt
        ? a.createdAt.toDate()
        : new Date(a.createdAt || 0);
      const dateB = b.createdAt && "toDate" in b.createdAt
        ? b.createdAt.toDate()
        : new Date(b.createdAt || 0);
      
      return dateB.getTime() - dateA.getTime();
    } catch (error) {
      console.error("Error sorting dates:", error);
      return 0;
    }
  });
};