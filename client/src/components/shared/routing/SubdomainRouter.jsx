import { Navigate, useLocation } from "react-router-dom";
import { isSellerSubDomain, isCustomerSubDomain } from "../../../utils/subdomain";


const SubdomainRouter = ({ children }) => {
  const location = useLocation();
  const isSellerSub = isSellerSubDomain();
  const isCustomerSub = isCustomerSubDomain();

  // Preserve query parameters during redirects
  const queryString = location.search;

  // On seller subdomain
  if (isSellerSub) {
    if (location.pathname.startsWith("/seller")) {
      return children;
    }

    return <Navigate to={`/seller/dashboard${queryString}`} replace />;
  }

  if (isCustomerSub) {
    if (location.pathname.startsWith("/seller")) {
      return <Navigate to={`/${queryString}`} replace />;
    }

    // Allow all other routes
    return children;
  }

  // Default: render children
  return children;
};

export default SubdomainRouter;
