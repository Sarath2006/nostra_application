import { Link, useLocation } from "react-router-dom";
import { RiArrowRightWideFill } from "react-icons/ri";
import "./Breadcrumbs.css";

const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  // Don't render on homepage
  if (pathnames.length === 0) return null;

  return (
    <nav className="breadcrumbs">
      <Link to="/">Home</Link>

      {/* Always insert "Product" as first breadcrumb */}
      {pathnames[0] === "product" && (
  <span className="breadcrumb-item">
    <RiArrowRightWideFill className="breadcrumb-icon" />
    <span className="breadcrumb-current">Product</span>
  </span>
)}

{pathnames.length > 1 && (
  <span className="breadcrumb-item">
    <RiArrowRightWideFill className="breadcrumb-icon" />
    <span className="breadcrumb-current">{pathnames[1]}</span>
  </span>
)}
    </nav>
  );
};

export default Breadcrumbs;
