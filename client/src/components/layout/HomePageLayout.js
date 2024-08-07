import React, { useEffect } from "react";
import Header from "./header";
import Footer from "./footer";

function HomeLayout({ children }) {
  return (
    <div>
      <Header></Header>
      <main
        style={{ height: "100%", scrollbarWidth: "none" }}
        className="overflow-auto homebg"
      >
        {children}
      </main>

      <Footer></Footer>
    </div>
  );
}

export default HomeLayout;
