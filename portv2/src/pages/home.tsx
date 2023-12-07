import { useEffect } from "react";
import { useAuth } from "../../components/AuthContext";
import { useRouter } from "next/router";
import Header from "../../components/header";

export default function Home() {
  const { isLoggedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Check session storage for login status
    const storedLoginStatus = sessionStorage.getItem("isLoggedIn");
    if (typeof window !== "undefined" && storedLoginStatus !== "true") {
      router.push("/");
    }
  }, [router]);

  return (
    <>
      <Header />
      <div className="container mt-5">
        <h1>Dashboard</h1>
        <p>Welcome to Bassil&apos;s portfolio dashboard</p>

        <h2 className="mt-4">Your Portfolio Summary</h2>

        <table className="table table-bordered mt-3">
          <thead>
            <tr>
              <th>
                <a href="/projects">Projects</a>
              </th>
              <th>
                <a href="/skills">Skills</a>
              </th>
              <th>
                <a href="/education">Education</a>
              </th>
              <th>
                <a href="/experience">Experience</a>
              </th>
            </tr>
          </thead>
        </table>
      </div>
    </>
  );
}
