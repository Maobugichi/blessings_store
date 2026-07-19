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


export const formatDateOnly = (dateString: string) => {
  const date = new Date(dateString);
  
  return new Intl.DateTimeFormat('en-NG', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'Africa/Lagos',
  }).format(date);
};


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

// Returns a plain "YYYY-MM-DD" calendar date, anchored to Africa/Lagos
// regardless of what timezone the browser/runtime is in. Used wherever
// we need to compare "which shop-day" two instants fall on, rather than
// display formatting.
const getLagosDateString = (date: Date) =>
  new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Africa/Lagos',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);

export const formatDateRelative = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();

  // FIX: previously used setHours(0,0,0,0), which zeroes the time in the
  // *runtime's* local timezone — so "Today"/"Yesterday" could disagree
  // with every other label in this file for anyone outside Africa/Lagos.
  // Comparing Lagos calendar-date strings instead makes this consistent
  // with formatDate/formatDateOnly/formatDateLong above.
  const dateDay = getLagosDateString(date);
  const nowDay = getLagosDateString(now);

  const diffInMs = Date.parse(`${nowDay}T00:00:00Z`) - Date.parse(`${dateDay}T00:00:00Z`);
  const diffInDays = Math.round(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) return 'Today';
  if (diffInDays === 1) return 'Yesterday';
  if (diffInDays > 1 && diffInDays < 7) return `${diffInDays} days ago`;

  // Also covers diffInDays < 0 (a future-dated value reaching this
  // function somehow) — falls through to a plain date instead of the
  // old bug of printing e.g. "-2 days ago".
  return formatDateOnly(dateString);
};


export const formatDateSlash = (dateString: string) => {
  const date = new Date(dateString);

  // FIX: previously used date.getDate()/getMonth()/getFullYear(), which
  // read the runtime's local timezone instead of Africa/Lagos.
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Africa/Lagos',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
};


export const formatTimeOnly = (dateString: string) => {
  const date = new Date(dateString);
  
  return new Intl.DateTimeFormat('en-NG', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Africa/Lagos',
  }).format(date);
};