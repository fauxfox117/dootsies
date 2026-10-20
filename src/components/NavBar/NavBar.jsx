import React from "react";
import "./NavBar.css";

function NavBar() {
  return (
    <nav className="nav-bar">
      <p className="nav-link">menu</p>
      <p className="nav-link">about</p>
      <p className="nav-link">contact</p>
      <p className="nav-link">reservations</p>
      <p className="nav-link">gift cards</p>
    </nav>
  );
}

export default NavBar;
