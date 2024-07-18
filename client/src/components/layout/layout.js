import Header from "./header";

function Layout({ children }) {
  return (
    <div>
      <Header></Header>
      <main
        style={{ height: "88vh", scrollbarWidth: "none" }}
        className="overflow-auto"
      >
        {children}
      </main>
    </div>
  );
}

export default Layout;
