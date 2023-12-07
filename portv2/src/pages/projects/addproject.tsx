import React, { FormEvent, useState } from "react";
import Header from "../../../components/header";
import { useRouter } from "next/router";

export default function AddProject() {
  const router = useRouter();
  const [image, setImage] = useState<File | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      setImage(file);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const data = new FormData(e.currentTarget);

    // Check if an image is selected
    if (image) {
      data.append("image", image, image.name); // Append the image with its original name
    }

    const title = data.get("title") as string;
    const url = data.get("url") as string;
    const content = data.get("content") as string;

    // Convert skills to an array
    const skills = Array.from(data.getAll("skills"));

    const formData = { title, url, content, skills, image };
    console.log(image);
    console.log(formData);
    console.log(data);
    try {
      const response = await fetch("http://localhost:8888/api/newproject", {
        method: "POST",
        body: data,
      });

      if (response.ok) {
        const jsonData = await response.json();
        if (jsonData.success) {
          router.push("/projects");
        } else {
          alert("Project could not be added");
        }
      } else {
        alert("Error uploading the image");
      }
    } catch (error) {
      console.error("Error during form submission:", error);
      alert("An unexpected error occurred");
    }
  };

  return (
    <>
      <Header />
      <div>
        <h1>Add Project</h1>
      </div>
      <form
        action="/submit"
        method="post"
        onSubmit={handleSubmit}
        encType="multipart/form-data"
      >
        <div>
          <label htmlFor="image">Image:</label>
          <input
            type="file"
            id="image"
            name="image"
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>
        {image && (
          <div>
            <img
              src={URL.createObjectURL(image)}
              alt="Preview"
              style={{ maxWidth: "200px", maxHeight: "200px" }}
            />
          </div>
        )}
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
