const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
const validEmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validateUserInputs = ({
  mobile,
  email,
  password,
  confirmPassword,
  firstName,
  lastName,
}) => {
  if (!mobile) return "Mobile number is required";
  if (!email) return "Email is required";
  if (!validEmailRegex.test(email)) return "Please enter a valid email address";
  if (!password) return "Password is required";
  if (!firstName) return "First name is required";
  if (!lastName) return "Last name is required";
  if (password !== confirmPassword) return "Passwords do not match";
  if (password.length < 6) return "Password must be at least 6 characters long";
  if (!strongPasswordRegex.test(password))
    return "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character";
};

module.exports = {validateUserInputs}
