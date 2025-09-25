const strongPasswordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
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

const validateSellerInputs = ({
  email,
  password,
  confirmPassword,
  firstName,
  lastName,
  nic,
  address1,
  address2,
  city,
  district,
  province,
  country,
  postalCode
}) => {
  if (!email) return "Email is required";
  if (!validEmailRegex.test(email)) return "Please enter a valid email address";
  if (!password) return "Password is required";
  if (!firstName) return "First name is required";
  if (!lastName) return "Last name is required";
  if (password !== confirmPassword) return "Passwords do not match";
  if (password.length < 6) return "Password must be at least 6 characters long";
  if (!strongPasswordRegex.test(password))
    return "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character";
  if (!nic) return "NIC number is required";
  if (!address1) return "Address line 1 is required";
  if (!address2) return "Address line 2 is required";
  if (!city) return "City is required";
  // if (!district) return "District is required";
  // if (!province) return "Province is required";
  // if (!country) return "Country is required";
  if (!postalCode) return "Postal code is required";

};

module.exports = { validateUserInputs, validateSellerInputs };
