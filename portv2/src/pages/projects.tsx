import React, { useEffect, useState } from "react";
import { useAuth } from "../../components/AuthContext";
import { useRouter } from "next/router";
import Header from "../../components/header";

interface Project {
  id: number;
  image: string;
  title: string;
  url: string;
  content: string;
  skills: string[];
}

const Projects: React.FC = () => {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [deleted, setDeleted] = useState(false);

  useEffect(() => {
    // Check session storage for login status
    const storedLoginStatus = sessionStorage.getItem("isLoggedIn");
    if (typeof window !== "undefined" && storedLoginStatus !== "true") {
      router.push("/");
    }
  }, [router]);

  useEffect(() => {
    fetch("http://localhost:8888/api/listprojects")
      .then((res) => res.json())
      .then((data: Project[]) => setProjects(data))
      .catch((err) => console.log(err));
  }, [deleted]);

  const handleDeleteProject = (id: number) => {
    const confirmDelete = confirm(
      "Are you sure you want to delete this project?"
    );
    if (confirmDelete) {
      fetch(`http://localhost:8888/api/deleteproject/${id}`, {
        method: "DELETE",
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setDeleted(true);
          } else {
            alert("Project could not be deleted");
          }
        })
        .catch((err) => console.log(err));
    }
  };
  return (
    <>
      <Header />
      <div className="container mt-5">
        <h1>Projects</h1>
        <button onClick={() => router.push("projects/addproject")}>
          New Project
        </button>
        <table className="table mt-3">
          <thead>
            <tr>
              <th>Image</th>
              <th>Title</th>
              <th>URL</th>
              <th>Content</th>
              <th>Skills</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project.id}>
                <td>
                  <img
                    src={`data:image/jpeg;base64,${project.image.toString(
                      "base64"
                    )}`}
                    alt={project.title}
                    style={{ maxWidth: "100px", maxHeight: "100px" }}
                  />
                </td>
                <td>{project.title}</td>
                <td>{project.url}</td>
                <td>{project.content}</td>
                <td>
                  {project.skills ? project.skills.join(", ") : "No skills"}
                </td>
                <td>
                  <button
                    onClick={() =>
                      router.push(`/projects/editproject/${project.id}`)
                    }
                  >
                    Edit
                  </button>
                </td>
                <td>
                  <button onClick={() => handleDeleteProject(project.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Projects;
