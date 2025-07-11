import "./App.css";
import MainRoutes from "./page/Routes";
import Header from "./components/common/header";
import Footer from "./components/common/footer";
import ScrollToTop from "./components/common/ScrollToTop";

function App() {
  return (
    <>
      <ScrollToTop />  
      <Header />
      <MainRoutes />
      <Footer />
    </>
  );
}

export default App;
