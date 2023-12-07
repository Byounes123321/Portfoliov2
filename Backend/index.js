const express = require("express");
const app = express();
const connection = require("./Utils/sqlConnect");
const { fetchPasswordFromDatabase } = require("./Utils/functions");
const port = 8888 || process.env.PORT;
const cors = require("cors");
const bodyParser = require("body-parser");
app.use(express.json());
app.use(bodyParser.json());
const bcrypt = require("bcryptjs");
const formData = require("express-form-data");

/*
AHHHH FUCKKK AHHHHHHHH i cant get the images to upload to the MOTHER FUCKING SERVER!!!!!
on the bright side pretty much everything else works and once get the image to upload it should be mainly copy paste
then i need to create the skillsXproject connection and integrate it thought the app/DB
*/

// Allow CORS
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(formData.parse());

app.post("/api/auth", async (req, res) => {
  const userName = req.body.username;
  const hashedPasswordFromFrontend = req.body.password;

  try {
    // Fetch the hashed password from the database
    const result = await fetchPasswordFromDatabase(userName);

    if (result.length > 0) {
      const hashedPasswordFromDB = result[0].password;

      // Use bcrypt.compare to check if passwords match
      const match = await bcrypt.compare(
        hashedPasswordFromFrontend,
        hashedPasswordFromDB
      );

      if (match) {
        // Passwords match
        res
          .status(200)
          .json({ success: true, message: "Authentication successful" });
        console.log("Authentication successful");
      } else {
        // Passwords do not match
        res
          .status(401)
          .json({ success: false, message: "Authentication failed" });
        console.log("Authentication failed");
      }
    } else {
      // No user found with the given username
      res.status(404).json({ success: false, message: "User not found" });
    }
  } catch (error) {
    console.error("Error during authentication:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

app.post("/api/newproject", (req, res) => {
  const { image, title, url, content } = req.body;
  console.log(req.body);
  console.log(image);

  console.log("New project added");
  connection.query(
    `INSERT INTO projects (image, title, url, content) VALUES (?, ?, ?, ?)`,
    [image, title, url, content],
    (err, result) => {
      if (err) {
        console.log(err);
        return res
          .status(500)
          .json({ success: false, message: "Error adding project" });
      }
      console.log("Project added successfully");

      const responseData = {
        success: true,
        message: "Project added successfully",
      };

      res.json(responseData);
    }
  );
});

app.get("/api/listprojects", (req, res) => {
  connection.query(`SELECT * FROM projects`, (err, result) => {
    if (err) {
      console.log(err);
      return;
    }
    res.json(result);
  });
});

app.delete("/api/deleteproject/:id", (req, res) => {
  const id = req.params.id;
  connection.query(`DELETE FROM projects WHERE id = ${id}`, (err, result) => {
    if (err) {
      console.log(err);
      const responseData = {
        success: false,
        message: "Project deletion failed",
      };
      res.json(responseData);
      return;
    }
    console.log("Project deleted successfully");
  });
  const responseData = {
    success: true,
    message: "Project deleted successfully",
  };
  res.json(responseData);
});

app.get("/api/getproject/:id", (req, res) => {
  const id = req.params.id;
  console.log(id);

  connection.query(`SELECT * FROM projects WHERE id = ${id}`, (err, result) => {
    if (err) {
      console.log(err);
      res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
      return;
    }

    if (result.length > 0) {
      console.log(result);
      res.json({
        success: true,
        message: "Project retrieved successfully",
        data: result,
      });
    } else {
      res.status(404).json({ success: false, message: "Project not found" });
    }
  });
});

app.put("/api/updateproject/:id", (req, res) => {
  const id = req.params.id;
  const { image, title, url, content } = req.body;
  //   console.log(req.body);

  connection.query(
    `UPDATE projects SET image = "${image}", title = "${title}", url = "${url}", content = "${content}" WHERE id = ${id}`,
    (err, result) => {
      if (err) {
        console.log(err);
        res
          .status(500)
          .json({ success: false, message: "Internal Server Error" });
        return;
      }
      console.log("Project updated successfully");
    }
  );
  const responseData = {
    success: true,
    message: "Project updated successfully",
  };
  res.json(responseData);
});

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
