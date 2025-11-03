// client/src/contexts/DataContext.jsx
import React, { createContext, useState } from 'react';

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [meta, setMeta] = useState({ page: 1, pages: 1, total: 0 });

  return (
    <DataContext.Provider value={{ posts, setPosts, categories, setCategories, meta, setMeta }}>
      {children}
    </DataContext.Provider>
  );
};
