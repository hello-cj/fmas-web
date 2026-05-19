import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function Layout({ children }) {
  return (
    <div style={styles.wrapper}>
      <Sidebar />

      <div style={styles.mainArea}>
        <Navbar />

        <div style={styles.content}>
          {children}
        </div>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    display: "flex",
    height: "100vh",
    overflow: "hidden",
  },

  mainArea: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },

  content: {
    flex: 1,
    padding: "20px",
    background: "#0a0d14",
    color: "#fff",
    overflowY: "auto",
  },
};