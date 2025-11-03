import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import PostDetail from "./components/PostDetail";
import PostForm from "./components/PostForm";
import LoginRegister from "./components/LoginRegister";
import Navbar from "./components/Navbar";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/posts/:id" element={<PostDetail />} />
        <Route path="/create" element={<PostForm />} />
        <Route path="/edit/:id" element={<PostForm />} />
        <Route path="/auth" element={<LoginRegister />} />
      </Routes>
    </>
  );
}

export default App;
