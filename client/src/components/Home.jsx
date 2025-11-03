import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Home() {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchPosts = () => {
    setLoading(true);
    fetch(`${import.meta.env.VITE_API_URL}/posts?page=${page}&search=${search}`)
      .then((res) => res.json())
      .then((data) => {
        setPosts(data.posts || []);
        setTotalPages(data.pages || 1);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchPosts();
  }, [page, search]);

  return (
    <div style={{ padding: "20px" }}>
      <h1>MERN Blog 📰</h1>
      <input
        type="text"
        placeholder="Search posts..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ marginBottom: "10px", padding: "5px" }}
      />
      {loading ? (
        <p>Loading posts...</p>
      ) : posts.length === 0 ? (
        <p>No posts found.</p>
      ) : (
        posts.map((post) => (
          <div key={post._id} style={{ borderBottom: "1px solid #ccc", marginBottom: "10px" }}>
            <Link to={`/posts/${post._id}`}>
              <h2>{post.title}</h2>
            </Link>
            <p>{post.content.slice(0, 150)}...</p>
            <p>
              Author: {post.author?.name || "Unknown"} | Category: {post.category?.name || "None"}
            </p>
          </div>
        ))
      )}

      <div style={{ marginTop: "20px" }}>
        <button onClick={() => setPage((p) => Math.max(p - 1, 1))} disabled={page === 1}>
          Prev
        </button>
        <span style={{ margin: "0 10px" }}>{page} / {totalPages}</span>
        <button onClick={() => setPage((p) => Math.min(p + 1, totalPages))} disabled={page === totalPages}>
          Next
        </button>
      </div>
    </div>
  );
}

export default Home;
