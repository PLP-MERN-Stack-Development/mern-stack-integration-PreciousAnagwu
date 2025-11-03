import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav style={{ padding: "10px", borderBottom: "1px solid #ccc" }}>
      <Link to="/">Home</Link> |{" "}
      <Link to="/create">Create Post</Link> |{" "}
      <Link to="/auth">Login/Register</Link>
    </nav>
  );
}

export default Navbar;
