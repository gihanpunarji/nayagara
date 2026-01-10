import { Navigate, useLocation } from "react-router-dom";
import { isSellerSubDomain, isCustomerSubDomain } from "../../../utils/subdomain";


const SubdomainRouter = ({ children }) => {
  const location = useLocation();
  const isSellerSub = isSellerSubDomain();
  const isCustomerSub = isCustomerSubDomain();

  // On seller subdomain
  if (isSellerSub) {
    // Allow seller routes
    if (location.pathname.startsWith("/seller")) {
      return children;
    }

    // Redirect non-seller routes to seller dashboard
    return <Navigate to="/seller/dashboard" replace />;
  }

  // On customer subdomain (main domain)
  if (isCustomerSub) {
    // Block seller routes on customer subdomain
    if (location.pathname.startsWith("/seller")) {
      return <Navigate to="/" replace />;
    }

    // Allow all other routes
    return children;
  }

  // Default: render children
  return children;
};

export default SubdomainRouter;
