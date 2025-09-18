import { Link } from "react-router-dom";
function Header() {
  return (
    <>
      <div className="Container">
        <Link to="/" className="Heading">
          <span>
            <img className="header-logo" src="./cat.png" alt="logo" />
          </span>
          Study Flow
        </Link>
        <div className="nav-links">
          <Link to="/progress-chart" className="nav-link">
            Progress Chart
          </Link>
          <Link to="/timer" className="nav-link">
            Timer
          </Link>
        </div>
      </div>
    </>
  );
}
export default Header;
