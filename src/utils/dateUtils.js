// Format date for input fields (YYYY-MM-DD)
export const formatDate = (date) => {
  return date.toISOString().split('T')[0];
};

// Get date X days ago/ahead
export const getDateDaysAgo = (days) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
};

// Format date for display
export const formatDisplayDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Get relative time (e.g., "3 days ago")
export const getRelativeTime = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now - date);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 1) {
    return date < now ? 'Yesterday' : 'Tomorrow';
  } else if (diffDays < 7) {
    return date < now ? `${diffDays} days ago` : `In ${diffDays} days`;
  } else if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return date < now ? `${weeks} week${weeks > 1 ? 's' : ''} ago` : `In ${weeks} week${weeks > 1 ? 's' : ''}`;
  } else {
    const months = Math.floor(diffDays / 30);
    return date < now ? `${months} month${months > 1 ? 's' : ''} ago` : `In ${months} month${months > 1 ? 's' : ''}`;
  }
};

// Check if date is today
export const isToday = (dateString) => {
  const date = new Date(dateString);
  const today = new Date();
  return date.toDateString() === today.toDateString();
};

// Get random date within range
export const getRandomDateInRange = (startDate, endDate) => {
  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();
  const randomTime = start + Math.random() * (end - start);
  return new Date(randomTime);
};