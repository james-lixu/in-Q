import React, { useState } from "react";
import MainLayout from "../pages/MainLayout";
import PostList from "../components/PostList";
import CreatePost from "../components/CreatePost";

const Home = () => {
  const [posts, setPosts] = useState([]);

  const handlePostCreated = (newPost) => {
    setPosts((prevPosts) => [newPost, ...prevPosts]); 
  };

  return (
    <MainLayout>
      <CreatePost onPostCreated={handlePostCreated} />
      <PostList posts={posts} setPosts={setPosts} />
    </MainLayout>
  );
};

export default Home;
