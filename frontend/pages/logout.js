import { useEffect } from "react";
import Head from "next/head";

export default function Login() {
  useEffect(async () => {
    localStorage.removeItem("token");
    localStorage.removeItem("UserId");
    window.location.href = `/login`;
  });

  return (
    <div>
      <Head>
        <title>Logout</title>
      </Head>

      <p>Login out...</p>
    </div>
  );
}
