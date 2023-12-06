const express = require("express");
const app = express();
const connection = require("./Utils/sqlConnect");
const port = 8888 || process.env.PORT;
const cors = require("cors");
const bodyParser = require("body-parser");
app.use(express.json());
app.use(bodyParser.json());
const bcrypt = require("bcryptjs");

// Login works! I need to add auth thought the front end
// allow cors
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

app.post("/api/auth", (req, res) => {
  const userName = req.body.username;
  const hashedPasswordFromFrontend = req.body.password;
  //   console.log(userName, hashedPasswordFromFrontend);

  connection.query(
    `SELECT * FROM users WHERE username = "${userName}"`,
    (err, result) => {
      if (err) {
        console.error(err);
        res
          .status(500)
          .json({ success: false, message: "Internal Server Error" });
        return;
      }

      if (result.length > 0) {
        const hashedPasswordFromDB = result[0].password;

        // Use bcrypt.compare to check if passwords match
        bcrypt.compare(
          hashedPasswordFromFrontend,
          hashedPasswordFromDB,
          (bcryptErr, match) => {
            if (bcryptErr) {
              console.error(bcryptErr);
              res
                .status(500)
                .json({ success: false, message: "Internal Server Error" });
              return;
            }

            if (match) {
              // Passwords match
              res
                .status(200)
                .json({ success: true, message: "Authentication successful" });
            } else {
              // Passwords do not match
              res
                .status(401)
                .json({ success: false, message: "Authentication failed" });
            }
          }
        );
      } else {
        // No user found with the given username
        res.status(404).json({ success: false, message: "User not found" });
      }
    }
  );
});

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
