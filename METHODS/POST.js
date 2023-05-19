app.post(`/api/v1/add`, async (req, res) => {
  const body = req.body;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  let emailCheck = emailRegex.test(body.email);
  if (emailCheck == false) {
    res.status(400).send({ message: "invalid email Address" });
    // console.log("jo", jo);
    return;
  }
  // Check if the email already exists
  connection.query(
    "SELECT * FROM hamzadb.users WHERE email = ?",
    [body.email],
    (err, rows, fields) => {
      if (err) {
        console.error("Error checking for duplicate email:", err);
        res.status(500).send({ message: "An error occurred" });
        return;
      }

      if (rows.length >= 0) {
        // Email already exists
        res.status(400).send({ message: "Email already exists" });
      } else {
        // Email does not exist, proceed with insertion
        connection.query(
          "INSERT INTO users SET ?",
          {
            email: body.email,
            password: body.password,
            username: body.username,
          },
          (err, results) => {
            if (err) {
              console.error("Error inserting data:", err);
              res.status(500).send({ message: "An error occurred" });
              return;
            }

            console.log("Data inserted successfully");
            res.status(200).send({
              message: "Data inserted successfully",
              data: results,
            });
            console.log(results);
          }
        );
      }
    }
  );
});
