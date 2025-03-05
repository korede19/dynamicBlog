import * as React from "react";
import Header from "@/components/header";
import CategorySlider from "@/components/postSlider";


const LandingPage = () => {
  return (
    <>
      <Header />
      <CategorySlider categoryId="category5" />
    </>
  );
};

export default LandingPage;
