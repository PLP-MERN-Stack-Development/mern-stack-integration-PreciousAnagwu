import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function PostForm({ editMode = false }) {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/categories`)
      .then((res) => res.json())
      .then((data) => setCategories(data));
    
    if (editMode) {
      fetch(`${import.meta.env.VITE_API_URL}/posts/${id}`)
        .then((res) => res.json())
        .then((post) => {
          setTitle(post.title);
          setContent(post.content);
          setCategory(post.category?._id || "");
        });
    }
  }, [editMode, id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const method = editMode ? "PUT" : "POST";
    const url = editMode
      ? `${import.meta.env.VITE_API_URL}/posts/${id}`
      : `${import.meta.env.VITE_API_URL}/posts`;
    
    fetch(url, {
      method,
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}` },
      body: JSON.stringify({ title, content, category }),
    })
      .then((res) => res.json())
      .then(() => navigate("/"));
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>{editMode ? "Edit Post" : "Create Post"}</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        <br />
        <textarea placeholder="Content" value={content} onChange={(e) => setContent(e.target.value)} required />
        <br />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">Select Category</option>
          {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
        </select>
        <br />
        <button type="submit">{editMode ? "Update" : "Create"}</button>
      </form>
    </div>
  );
}

export default PostForm;
