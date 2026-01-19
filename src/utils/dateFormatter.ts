
export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  

  return new Intl.DateTimeFormat('en-NG', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Africa/Lagos',
  }).format(date);
};

/**
 * Format date only (no time): "Jan 19, 2026"
 */
export const formatDateOnly = (dateString: string) => {
  const date = new Date(dateString);
  
  return new Intl.DateTimeFormat('en-NG', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'Africa/Lagos',
  }).format(date);
};

/**
 * Format to Nigerian long format: "Sunday, January 19, 2026"
 */
export const formatDateLong = (dateString: string) => {
  const date = new Date(dateString);
  
  return new Intl.DateTimeFormat('en-NG', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'Africa/Lagos',
  }).format(date);
};

/**
 * Format with relative time: "Today", "Yesterday", "2 days ago", or date
 */
export const formatDateRelative = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  
  // Reset time to midnight for accurate day comparison
  const dateAtMidnight = new Date(date);
  dateAtMidnight.setHours(0, 0, 0, 0);
  
  const nowAtMidnight = new Date(now);
  nowAtMidnight.setHours(0, 0, 0, 0);
  
  const diffInMs = nowAtMidnight.getTime() - dateAtMidnight.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  
  if (diffInDays === 0) return 'Today';
  if (diffInDays === 1) return 'Yesterday';
  if (diffInDays < 7) return `${diffInDays} days ago`;
  
  return formatDateOnly(dateString);
};

/**
 * Format to DD/MM/YYYY (common Nigerian format)
 */
export const formatDateSlash = (dateString: string) => {
  const date = new Date(dateString);
  
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  
  return `${day}/${month}/${year}`;
};

/**
 * Format time only: "11:30 PM"
 */
export const formatTimeOnly = (dateString: string) => {
  const date = new Date(dateString);
  
  return new Intl.DateTimeFormat('en-NG', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Africa/Lagos',
  }).format(date);
};