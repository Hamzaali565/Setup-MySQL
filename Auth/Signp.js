app.post("/api/v1/signup", async (req, res) => {
  try {
    let body = req.body;
    if (!body.email || !body.password || !body.username)
      throw new Error("All Fields Are Required");
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let emailCheck = emailRegex.test(body.email);
    if (emailCheck == false) {
      res.status(400).send({ message: "invalid email Address" });
      // console.log("jo", jo);
      return;
    }
    connection.query(
      "SELECT * FROM users WHERE email = ?",
      [body.email],
      async (err, rows, fields) => {
        if (!err) {
          if (rows.length > 0) {
            // throw new Error("Email Alreasy exist");
            res.status(400).send({ message: "Email already exists" });
            // console.log(rows.email);
            return;
          }
        }
        let saltRound = 10;
        const salt = await bcrypt.genSalt(saltRound);
        let hashedPass = await bcrypt.hash(body.password, salt);
        console.log(hashedPass);
        connection.query(
          "INSERT INTO users SET ?",
          // "INSERT INTO users SET ?"
          {
            email: body.email,
            password: hashedPass,
            username: body.username,
          },
          (err, result) => {
            if (!err) {
              res.status(200).send({ message: "User SignUp Successfully" });
            }
          }
        );
      }
    );
  } catch (error) {
    res.status(400).send({ message: `${error.message}` });
  }
});
