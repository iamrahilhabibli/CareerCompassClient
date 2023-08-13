import { formatDistanceToNow } from "date-fns";

const formatDate = (dateValue) => {
  if (!dateValue) return "Invalid date";

  const date = new Date(dateValue);
  if (isNaN(date)) return "Invalid date";

  return formatDistanceToNow(date);
};
