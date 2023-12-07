import { useRouter } from "next/router";
import Header from "../../../../components/header";
import { useEffect } from "react";

export default function EditProject() {
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    // Check session storage for login status
    const storedLoginStatus = sessionStorage.getItem("isLoggedIn");
    if (typeof window !== "undefined" && storedLoginStatus !== "true") {
      router.push("/");
    }
  }, [router]);

  useEffect(() => {
    if (id) {
      fetch(`http://localhost:8888/api/getproject/${id}`)
        .then((res) => res.json())
        .then((data) => {
          //   console.log(data.success);
          //   console.log(data.data[0]);
          if (data.success) {
            // Populate the form
            const project = data.data[0];
            const titleInput = document.querySelector(
              "#title"
            ) as HTMLInputElement;
            const urlInput = document.querySelector("#url") as HTMLInputElement;
            const contentInput = document.querySelector(
              "#content"
            ) as HTMLInputElement;
            const skillsInput = document.querySelector(
              "#skills"
            ) as HTMLInputElement;

            titleInput.value = project.title;
            urlInput.value = project.url;
            contentInput.value = project.content;
            skillsInput.value = project.skills.join(", ");
          } else {
            alert("Project not found");
          }
        })
        .catch((err) => console.log(err));
    }
  }, [id]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const title = data.get("title") as string;
    const url = data.get("url") as string;
    const content = data.get("content") as string;
    const skills = data.get("skills") as string;
    const image = data.get("image") as string;
    const formData = { title, url, content, skills, image };
    // console.log(formData);
    fetch(`http://localhost:8888/api/updateproject/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((data) => {
        if (data.headers.get("content-type")?.includes("application/json")) {
          return data.json();
        } else {
          return { success: false, message: "Response is not JSON" };
        }
      })
      .then((jsonData) => {
        if (jsonData.success) {
          // alert("Project updated successfully");
          router.push("/projects");
        } else {
          alert("Project could not be updated");
        }
      })
      .catch((error) => {
        console.error("Error during login:", error);
        alert("An unexpected error occurred");
      });
  };

  return (
    <>
      <Header />
      <div>
        <h1>Edit Project</h1>
      </div>
      <form action="/submit" method="post" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="image">Image:</label>
          <input type="file" id="image" name="image" accept="image/*" />
        </div>
        <div>
          <label htmlFor="title">Title:</label>
          <input type="text" id="title" name="title" required />
        </div>

        {/* URL */}
        <div>
          <label htmlFor="url">URL:</label>
          <input type="url" id="url" name="url" required />
        </div>

        {/* Content */}
        <div>
          <label htmlFor="content">Content:</label>
          <textarea id="content" name="content" rows={4} required></textarea>
        </div>

        {/* Skills (Radio Buttons) */}
        <div>
          <label>Skills:</label>
          <div>
            <input type="radio" id="html" name="skills" value="HTML" />
            <label htmlFor="html">HTML</label>

            <input type="radio" id="css" name="skills" value="CSS" />
            <label htmlFor="css">CSS</label>

            <input type="radio" id="js" name="skills" value="JavaScript" />
            <label htmlFor="js">JavaScript</label>
            {/* Add more skills as needed */}
          </div>
        </div>

        {/* Submit Button */}
        <button type="submit">Submit</button>
      </form>
    </>
  );
}
