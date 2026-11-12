"use client";

import React from "react";
import { useState } from "react";
import Link from "next/link";
import { useViewTransition } from "@/hooks/useViewTransition";
import "./NavBar.css";

const LINKS = [
  { label: "menu", href: "/menu" },
  { label: "reservations", href: "/reservation" },
  { label: "gift cards", href: "#" },
];

const ABOUT_LINK = { label: "about", href: "/about" };
const CONTACT_LINK = { label: "contact", href: "#" };

function NavBar() {
  const { navigateWithTransition } = useViewTransition();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleClick = (event, href) => {
    setIsMenuOpen(false);
    if (href.startsWith("#")) return;
    event.preventDefault();
    navigateWithTransition(href);
  };

  const renderLink = ({ label, href }) => (
    <Link
      key={label}
      href={href}
      className="nav-bar-link"
      onClick={(event) => handleClick(event, href)}
    >
      {label}
    </Link>
  );

  return (
    <nav className="nav-bar">
      <div
        className={`nav-bar-menu${isMenuOpen ? " is-open" : ""}`}
        id="mobile-nav-menu"
      >
        <div className="nav-bar-links nav-bar-links-left">
          {renderLink(LINKS[0])}
          <div className="nav-bar-dropdown">
            <Link
              href={ABOUT_LINK.href}
              className="nav-bar-link"
              aria-haspopup="true"
              onClick={(event) => handleClick(event, ABOUT_LINK.href)}
            >
              {ABOUT_LINK.label}
            </Link>
            <div className="nav-bar-dropdown-menu">
              {renderLink(CONTACT_LINK)}
            </div>
          </div>
        </div>
        <div className="nav-bar-links nav-bar-links-right">
          {LINKS.slice(1).map(renderLink)}
        </div>
      </div>
      <Link
        href="/"
        className="nav-bar-logo"
        aria-label="Dootsie's home"
        onClick={(event) => handleClick(event, "/")}
      >
        <img src="/Dootsies.PNG" alt="Dootsie's" />
      </Link>
      <button
        type="button"
        className={`nav-bar-toggle${isMenuOpen ? " is-open" : ""}`}
        aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={isMenuOpen}
        aria-controls="mobile-nav-menu"
        onClick={() => setIsMenuOpen((isOpen) => !isOpen)}
      >
        <span />
        <span />
        <span />
      </button>
    </nav>
  );
}

export default NavBar;
