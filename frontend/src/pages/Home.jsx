import React from "react";
import MainLayout from "../pages/MainLayout";
import PostList from "../components/PostList";

const Home = () => {
  return (
    <MainLayout>
      <PostList />
    </MainLayout>
  );
};

export default Home;
