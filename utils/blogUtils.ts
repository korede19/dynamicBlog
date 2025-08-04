import { BlogPost, FirestoreTimestamp } from "@/types/blog";

export const stripHtmlTags = (html: string = "") => {
  return html.replace(/<[^>]*>?/gm, "");
};

export const formatDate = (dateValue: Date | FirestoreTimestamp | undefined) => {
  // Early return if no date provided
  if (!dateValue) return "No date";

  try {
    let date: Date;
    
    // Check if it's a Firestore Timestamp (has toDate method)
    if (dateValue && typeof dateValue === "object" && "toDate" in dateValue) {
      date = dateValue.toDate(); // Convert Firestore Timestamp to Date
    } else {
      date = dateValue as Date; // It's already a Date object
    }

    // Check if the date is valid (not NaN)
    if (isNaN(date.getTime())) {
      return "Invalid date";
    }

    // Format the date in US format
    return date.toLocaleDateString("en-US", {
      year: "numeric",    // 2024
      month: "short",     // Jan, Feb, etc.
      day: "numeric",     // 1, 2, 15, etc.
    });
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Invalid date";
  }
};

export const sortPostsByDate = (posts: BlogPost[]) => {
  return [...posts].sort((a, b) => {
    try {
      // Convert both dates to Date objects
      const dateA = a.createdAt && "toDate" in a.createdAt
        ? a.createdAt.toDate()
        : new Date(a.createdAt || 0); // Fallback to epoch if null
      
      const dateB = b.createdAt && "toDate" in b.createdAt
        ? b.createdAt.toDate()
        : new Date(b.createdAt || 0);
      return dateB.getTime() - dateA.getTime();
    } catch (error) {
      console.error("Error sorting dates:", error);
      return 0; // Keep original order if error
    }
  });
};

export const formatDateFlexible = (dateValue: any) => {
  if (!dateValue) return "No date";

  try {
    let date: Date;
    
    // Handle different date formats
    if (typeof dateValue === "string") {
      date = new Date(dateValue);
    } else if (dateValue instanceof Date) {
      date = dateValue;
    } else if (dateValue && typeof dateValue === "object") {
      // Check for Firestore Timestamp
      if ("toDate" in dateValue && typeof dateValue.toDate === "function") {
        date = dateValue.toDate();
      }
      // Check for seconds/nanoseconds format (another Firestore format)
      else if ("seconds" in dateValue) {
        date = new Date(dateValue.seconds * 1000);
      }
      // Try to convert object to date
      else {
        date = new Date(dateValue);
      }
    } else {
      return "Invalid date";
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

export const createPostExcerpt = (content: string = "", maxLength: number = 120) => {
  const cleanText = stripHtmlTags(content);
  
  if (cleanText.length <= maxLength) {
    return cleanText;
  }
  
  // Find the last space before maxLength to avoid cutting words
  const truncated = cleanText.substring(0, maxLength);
  const lastSpaceIndex = truncated.lastIndexOf(' ');
  
  const excerpt = lastSpaceIndex > 0 
    ? truncated.substring(0, lastSpaceIndex)
    : truncated;
    
  return excerpt + "...";
};


export const debugDate = (dateValue: any) => {
  console.log("Date debug info:", {
    value: dateValue,
    type: typeof dateValue,
    isDate: dateValue instanceof Date,
    hasToDate: dateValue && typeof dateValue === "object" && "toDate" in dateValue,
    hasSeconds: dateValue && typeof dateValue === "object" && "seconds" in dateValue,
  });
};