"use client";

import React from "react";
import Link from "next/link";
import { useViewTransition } from "@/hooks/useViewTransition";
import "./NavBar.css";

const LINKS = [
  { label: "menu", href: "/menu" },
  { label: "about", href: "/about" },
  // { label: "home", href: "/" },
  { label: "contact", href: "#" },
  { label: "reservations", href: "/reservation" },
  { label: "gift cards", href: "#" },
];

function NavBar() {
  const { navigateWithTransition } = useViewTransition();

  const handleClick = (event, href) => {
    if (href.startsWith("#")) return;
    event.preventDefault();
    navigateWithTransition(href);
  };

  return (
    <nav className="nav-bar">
      {LINKS.map(({ label, href }) => (
        <Link
          key={label}
          href={href}
          className="nav-bar-link"
          onClick={(event) => handleClick(event, href)}
        >
          {label}
        </Link>
      ))}
    </nav>
  );
}

export default NavBar;
