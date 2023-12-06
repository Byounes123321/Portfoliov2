import { useEffect } from "react";
import { useAuth } from "../../components/AuthContext";
import { useRouter } from "next/router";

export default function Home() {
  const { isLoggedIn } = useAuth();
  const { logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Check if we're on the client side before using router
    if (typeof window !== "undefined") {
      // If the user is not logged in, redirect them to the login page
      if (!isLoggedIn) {
        router.push("/"); // Update the path to your login page
      }
    }
  }, [isLoggedIn, router]);

  // If the user is not logged in, prevent rendering content
  if (!isLoggedIn) {
    return null; // You can also render a loading spinner or message here
  }

  return (
    <div>
      <h1>Home</h1>
      <p>Welcome, you are logged in!</p>
      <button onClick={() => logout()}>Log out</button>
    </div>
  );
}
