// 💰 EXAMPLE: Formatting Utilities
// This shows how to create reusable formatting functions
// Usage: import { formatCurrency, formatDate } from '../utils/shared/formatters';

// Format currency for Sri Lankan context
export const formatCurrency = (amount, options = {}) => {
  const {
    currency = 'LKR',
    locale = 'en-US',
    minimumFractionDigits = 2,
    maximumFractionDigits = 2
  } = options;

  // Handle null/undefined/NaN values
  if (amount == null || isNaN(amount)) {
    return currency === 'LKR' ? 'Rs. 0.00' : '$0.00';
  }

  // Convert to number if it's a string
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;

  if (currency === 'LKR') {
    // Sri Lankan Rupee formatting with "Rs." prefix
    return `Rs. ${numAmount.toLocaleString(locale, {
      minimumFractionDigits,
      maximumFractionDigits
    })}`;
  }

  // Use Intl.NumberFormat for other currencies
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits,
    maximumFractionDigits
  }).format(numAmount);
};

// Format large numbers with K, M, B suffixes
export const formatCompactNumber = (number) => {
  if (number == null || isNaN(number)) return '0';

  const num = parseFloat(number);

  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(1) + 'B';
  }
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }

  return num.toString();
};

// Format dates in different styles
export const formatDate = (date, style = 'medium') => {
  if (!date) return '';

  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) return '';

  const options = {
    short: {
      year: '2-digit',
      month: 'short',
      day: 'numeric'
    },
    medium: {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    },
    long: {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    },
    time: {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    },
    datetime: {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }
  };

  return dateObj.toLocaleDateString('en-US', options[style] || options.medium);
};

// Calculate and format time ago
export const formatTimeAgo = (date) => {
  if (!date) return '';

  const now = new Date();
  const past = new Date(date);
  const diffInSeconds = Math.floor((now - past) / 1000);

  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60
  };

  for (const [unit, seconds] of Object.entries(intervals)) {
    const interval = Math.floor(diffInSeconds / seconds);

    if (interval >= 1) {
      return `${interval} ${unit}${interval === 1 ? '' : 's'} ago`;
    }
  }

  return 'Just now';
};

// Format file sizes
export const formatFileSize = (bytes, decimals = 2) => {
  if (!bytes || bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

// Format phone numbers for Sri Lanka
export const formatPhoneNumber = (phoneNumber) => {
  if (!phoneNumber) return '';

  // Remove all non-digits
  const cleaned = phoneNumber.replace(/\D/g, '');

  // Sri Lankan mobile numbers
  if (cleaned.length === 10 && cleaned.startsWith('0')) {
    // Format: 077 123 4567
    return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`;
  }

  // International format
  if (cleaned.length === 12 && cleaned.startsWith('94')) {
    // Format: +94 77 123 4567
    return `+${cleaned.slice(0, 2)} ${cleaned.slice(2, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7)}`;
  }

  return phoneNumber; // Return original if format doesn't match
};

// Format percentage values
export const formatPercentage = (value, decimals = 1) => {
  if (value == null || isNaN(value)) return '0%';

  const num = parseFloat(value);
  return `${num.toFixed(decimals)}%`;
};

// Truncate text with ellipsis
export const truncateText = (text, maxLength = 100, suffix = '...') => {
  if (!text || text.length <= maxLength) return text || '';

  return text.substring(0, maxLength).trim() + suffix;
};

// Format product ratings
export const formatRating = (rating, maxRating = 5) => {
  if (rating == null || isNaN(rating)) return '0.0';

  const num = parseFloat(rating);
  const clamped = Math.max(0, Math.min(num, maxRating));

  return clamped.toFixed(1);
};

// 🎯 USAGE EXAMPLES:
/*
import {
  formatCurrency,
  formatDate,
  formatTimeAgo,
  formatCompactNumber,
  formatPhoneNumber,
  truncateText
} from '../utils/shared/formatters';

function ProductCard({ product }) {
  return (
    <div>
      <h3>{truncateText(product.name, 30)}</h3>
      <p>{formatCurrency(product.price)}</p>
      <p>{formatCompactNumber(product.views)} views</p>
      <p>Added {formatTimeAgo(product.createdAt)}</p>
    </div>
  );
}

function OrderDetails({ order }) {
  return (
    <div>
      <h2>Order #{order.id}</h2>
      <p>Total: {formatCurrency(order.total)}</p>
      <p>Date: {formatDate(order.createdAt, 'long')}</p>
      <p>Phone: {formatPhoneNumber(order.customerPhone)}</p>
    </div>
  );
}

function AnalyticsDashboard({ stats }) {
  return (
    <div>
      <div>Revenue: {formatCurrency(stats.revenue)}</div>
      <div>Users: {formatCompactNumber(stats.users)}</div>
      <div>Growth: {formatPercentage(stats.growth)}</div>
    </div>
  );
}
*/