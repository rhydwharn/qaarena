exports.shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

exports.calculatePercentage = (correct, total) => {
  if (total === 0) return 0;
  return Math.round((correct / total) * 100);
};

exports.formatDuration = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  if (hours > 0) {
    return `${hours}h ${minutes}m ${secs}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${secs}s`;
  }
  return `${secs}s`;
};

exports.getDateRange = (period) => {
  const now = new Date();
  const ranges = {
    today: new Date(now.setHours(0, 0, 0, 0)),
    week: new Date(now.setDate(now.getDate() - 7)),
    month: new Date(now.setMonth(now.getMonth() - 1)),
    year: new Date(now.setFullYear(now.getFullYear() - 1))
  };
  return ranges[period] || null;
};

exports.sanitizeUser = (user) => {
  const { password, ...sanitized } = user.toObject();
  return sanitized;
};