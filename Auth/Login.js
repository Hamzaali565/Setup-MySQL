app.post("/api/v1/login", async (req, res) => {
  try {
    let body = req.body;
    if (!body.email || !body.password)
      throw new Error("All parameters are required");
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
        if (err) {
          res.status(400).send({ message: "DB Error" });
        }
        if (rows.length > 0) {
          console.log(rows[0].password);
          const isMatched = await bcrypt.compare(
            body.password,
            rows[0].password
          );
          if (!isMatched) {
            res.status(400).send({ message: "Incorrect Password" });
            return;
          }
          if (isMatched) {
            const token = jwt.sign(
              {
                id: rows[0].id,
                email: rows[0].email,
                iat: Math.floor(Date.now() / 1000) - 30,
              },
              SECRET
            );
            res.cookie("token", token, { httpOnly: true });
            res.status(200).send({
              message: "user login",
              data: {
                username: rows[0].username,
                email: rows[0].email,
                // password: rows[0].password,
                token,
              },
            });
            console.log("rows", rows);
            return;
          }
          return;
        }
        res.send({ message: "user login" });
      }
    );
  } catch (error) {
    res.status(400).send({ message: `${error.message}` });
  }
});
