import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <footer className="bg-secondary text-center p-4 border-top mt-5">
        Blog101 © 2021
      </footer>
    </>
  );
}

export default MyApp;
