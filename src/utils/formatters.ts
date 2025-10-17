export const formatTime = (date: Date): string => {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

export const formatDate = (date: Date): string => {
  return date.toLocaleDateString();
};

export const formatChatDate = (date: Date): string => {
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return "Today";
  } else if (diffDays === 1) {
    return "Yesterday";
  } else if (diffDays <= 7) {
    return "Last 7 days";
  } else if (diffDays <= 30) {
    return "Last 30 days";
  } else {
    return date.toLocaleDateString();
  }
};
