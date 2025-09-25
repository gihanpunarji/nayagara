// ✅ EXAMPLE: Validation Utilities
// This shows how to create reusable validation functions
// Usage: import { validateEmail, validatePassword } from '../utils/shared/validators';

// Email validation
export const validateEmail = (email) => {
  if (!email) return { valid: false, message: 'Email is required' };

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    return { valid: false, message: 'Please enter a valid email address' };
  }

  return { valid: true };
};

// Password validation with strength checking
export const validatePassword = (password, options = {}) => {
  const {
    minLength = 8,
    requireUppercase = true,
    requireLowercase = true,
    requireNumbers = true,
    requireSpecialChars = false,
    maxLength = 128
  } = options;

  if (!password) {
    return { valid: false, message: 'Password is required' };
  }

  if (password.length < minLength) {
    return {
      valid: false,
      message: `Password must be at least ${minLength} characters long`
    };
  }

  if (password.length > maxLength) {
    return {
      valid: false,
      message: `Password must be no more than ${maxLength} characters long`
    };
  }

  const checks = [];

  if (requireUppercase && !/[A-Z]/.test(password)) {
    checks.push('uppercase letter');
  }

  if (requireLowercase && !/[a-z]/.test(password)) {
    checks.push('lowercase letter');
  }

  if (requireNumbers && !/\d/.test(password)) {
    checks.push('number');
  }

  if (requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    checks.push('special character');
  }

  if (checks.length > 0) {
    return {
      valid: false,
      message: `Password must contain at least one ${checks.join(', ')}`
    };
  }

  return { valid: true };
};

// Calculate password strength
export const getPasswordStrength = (password) => {
  if (!password) return { score: 0, label: 'Very Weak', color: 'red' };

  let score = 0;
  const checks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    numbers: /\d/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    longLength: password.length >= 12
  };

  // Calculate score
  Object.values(checks).forEach(check => {
    if (check) score += 1;
  });

  const strengthLevels = {
    0: { label: 'Very Weak', color: 'red' },
    1: { label: 'Very Weak', color: 'red' },
    2: { label: 'Weak', color: 'orange' },
    3: { label: 'Fair', color: 'yellow' },
    4: { label: 'Good', color: 'blue' },
    5: { label: 'Strong', color: 'green' },
    6: { label: 'Very Strong', color: 'green' }
  };

  return { score, ...strengthLevels[score] };
};

// Phone number validation for Sri Lanka
export const validatePhoneNumber = (phone) => {
  if (!phone) return { valid: false, message: 'Phone number is required' };

  // Remove all non-digits
  const cleaned = phone.replace(/\D/g, '');

  // Sri Lankan mobile number patterns
  const patterns = [
    /^077\d{7}$/, // Dialog
    /^070\d{7}$/, // Dialog
    /^071\d{7}$/, // Mobitel
    /^072\d{7}$/, // Hutch
    /^074\d{7}$/, // Dialog
    /^075\d{7}$/, // Airtel
    /^076\d{7}$/, // Dialog
    /^078\d{7}$/  // Hutch
  ];

  // Check if it matches Sri Lankan format
  const isValidSriLankan = patterns.some(pattern => pattern.test(cleaned));

  // Check international format
  const isValidInternational = /^94(70|71|72|74|75|76|77|78)\d{7}$/.test(cleaned);

  if (!isValidSriLankan && !isValidInternational) {
    return {
      valid: false,
      message: 'Please enter a valid Sri Lankan mobile number'
    };
  }

  return { valid: true };
};

// Name validation
export const validateName = (name, options = {}) => {
  const { minLength = 2, maxLength = 50, allowNumbers = false } = options;

  if (!name || !name.trim()) {
    return { valid: false, message: 'Name is required' };
  }

  const trimmedName = name.trim();

  if (trimmedName.length < minLength) {
    return {
      valid: false,
      message: `Name must be at least ${minLength} characters long`
    };
  }

  if (trimmedName.length > maxLength) {
    return {
      valid: false,
      message: `Name must be no more than ${maxLength} characters long`
    };
  }

  // Check for invalid characters
  const validNameRegex = allowNumbers
    ? /^[a-zA-Z0-9\s'-]+$/
    : /^[a-zA-Z\s'-]+$/;

  if (!validNameRegex.test(trimmedName)) {
    return {
      valid: false,
      message: 'Name contains invalid characters'
    };
  }

  return { valid: true };
};

// Product price validation
export const validatePrice = (price, options = {}) => {
  const { min = 0, max = 10000000, currency = 'LKR' } = options;

  if (!price && price !== 0) {
    return { valid: false, message: 'Price is required' };
  }

  const numPrice = parseFloat(price);

  if (isNaN(numPrice)) {
    return { valid: false, message: 'Price must be a valid number' };
  }

  if (numPrice < min) {
    return {
      valid: false,
      message: `Price must be at least ${currency === 'LKR' ? 'Rs.' : '$'}${min}`
    };
  }

  if (numPrice > max) {
    return {
      valid: false,
      message: `Price cannot exceed ${currency === 'LKR' ? 'Rs.' : '$'}${max.toLocaleString()}`
    };
  }

  return { valid: true };
};

// URL validation
export const validateURL = (url, options = {}) => {
  const { allowEmpty = false, requireHttps = false } = options;

  if (!url) {
    return allowEmpty
      ? { valid: true }
      : { valid: false, message: 'URL is required' };
  }

  try {
    const urlObj = new URL(url);

    if (requireHttps && urlObj.protocol !== 'https:') {
      return { valid: false, message: 'URL must use HTTPS' };
    }

    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      return { valid: false, message: 'URL must use HTTP or HTTPS protocol' };
    }

    return { valid: true };
  } catch (error) {
    return { valid: false, message: 'Please enter a valid URL' };
  }
};

// Form validation helper
export const validateForm = (formData, validationRules) => {
  const errors = {};
  let isValid = true;

  Object.keys(validationRules).forEach(fieldName => {
    const rules = validationRules[fieldName];
    const value = formData[fieldName];

    for (const rule of rules) {
      const result = rule.validator(value, rule.options || {});

      if (!result.valid) {
        errors[fieldName] = result.message;
        isValid = false;
        break; // Stop at first error for this field
      }
    }
  });

  return { isValid, errors };
};

// 🎯 USAGE EXAMPLES:
/*
import {
  validateEmail,
  validatePassword,
  validatePhoneNumber,
  validateForm,
  getPasswordStrength
} from '../utils/shared/validators';

// Single field validation
function LoginForm() {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  const handleEmailChange = (value) => {
    setEmail(value);

    const validation = validateEmail(value);
    setEmailError(validation.valid ? '' : validation.message);
  };

  return (
    <input
      type="email"
      value={email}
      onChange={(e) => handleEmailChange(e.target.value)}
      className={emailError ? 'error' : ''}
    />
  );
}

// Password strength indicator
function PasswordInput() {
  const [password, setPassword] = useState('');
  const strength = getPasswordStrength(password);

  return (
    <div>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <div className={`strength-${strength.color}`}>
        Strength: {strength.label}
      </div>
    </div>
  );
}

// Complete form validation
function RegistrationForm() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: ''
  });
  const [errors, setErrors] = useState({});

  const validationRules = {
    firstName: [
      { validator: validateName, options: { minLength: 2 } }
    ],
    lastName: [
      { validator: validateName, options: { minLength: 2 } }
    ],
    email: [
      { validator: validateEmail }
    ],
    phone: [
      { validator: validatePhoneNumber }
    ],
    password: [
      {
        validator: validatePassword,
        options: { minLength: 8, requireUppercase: true }
      }
    ]
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const validation = validateForm(formData, validationRules);

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    // Form is valid, submit data
    console.log('Form data:', formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={formData.firstName}
        onChange={(e) => setFormData({...formData, firstName: e.target.value})}
        placeholder="First Name"
      />
      {errors.firstName && <span className="error">{errors.firstName}</span>}

      // ... other fields
    </form>
  );
}
*/