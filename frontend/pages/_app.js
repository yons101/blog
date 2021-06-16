import "../styles/globals.css";
import Header from "@components/Header";
function MyApp({ Component, pageProps }) {
  return (
    <>
      <Header />
      <Component {...pageProps} />
      <footer className="bg-secondary text-center p-4 border-top mt-5">
        Blog101 © 2021
      </footer>
    </>
  );
}

export default MyApp;
