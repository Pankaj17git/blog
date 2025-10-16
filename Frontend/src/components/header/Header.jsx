import React, { useState } from "react";
import { Link, useLocation } from "react-router";
import { Menu, X, PenTool } from "lucide-react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import "./Header.css";
import { logout } from "../../features/auth/authSlice";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  const location = useLocation();
  const isAuthenticated = !!user;

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Categories", href: "/categories" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  const isActive = (path) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="header">
      <div className="header-container">
        {/* Logo */}
        <Link to="/" className="logo">
          <PenTool className="icon logo-icon" />
          <span className="logo-text">BlogSpace</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="nav-desktop">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`nav-link ${isActive(item.href) ? "active" : ""}`}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="menu-button"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="icon" /> : <Menu className="icon" />}
        </button>

        <div className="mobile-auth">
        {isAuthenticated ? (
          <>
            
            <button
              onClick={() => {
                dispatch(logout())
                setIsMenuOpen(false);
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              onClick={() => setIsMenuOpen(false)}
            >
              Login
            </Link>
            <Link
              to="/signup"
              onClick={() => setIsMenuOpen(false)}
            >
              Sign Up
            </Link>
          </>
        )}
      </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="nav-mobile">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`nav-link-mobile ${isActive(item.href) ? "active" : ""
                }`}
              onClick={() => setIsMenuOpen(false)}
            >
              {item.name}
            </Link>
          ))}
        </div>
      )}

      
    </header>
  );
}
