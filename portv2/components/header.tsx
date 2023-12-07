import { useRouter } from "next/router";
import { useAuth } from "./AuthContext";

export default function Header() {
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <div>
      <h1>Portfolio Console</h1>
      <button onClick={() => router.push("/home")}>Home</button>
      <button onClick={handleLogout}>Log out</button>
      <a href="https://bassilyounes.com">Portfolio page</a>
    </div>
  );
}
