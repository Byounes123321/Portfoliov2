const connection = require("./sqlConnect");

// Function to fetch hashed password from the database
function fetchPasswordFromDatabase(username) {
  return new Promise((resolve, reject) => {
    connection.query(
      `SELECT * FROM users WHERE username = "${username}"`,
      (err, result) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(result);
      }
    );
  });
}

module.exports = {
  fetchPasswordFromDatabase,
};
