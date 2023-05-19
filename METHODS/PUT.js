app.put("/api/v1/update", async (req, res) => {
  let body = req.body;
  try {
    if (!body?.name || !body?.email) throw new Error("All fields are required");
    connection.query(
      "UPDATE users SET ? WHERE id = ?",
      [{ username: body?.name, email: body?.email }, body?.id],
      (err, results) => {
        if (err) throw new Error("User Update failed");
        // console.log("hello");
        if (results) {
          res
            .status(200)
            .send({ message: "Data updated successfully", data: results });
        }
      }
    );
  } catch (error) {
    console.log("error", error.message);
    res.status(400).send({ message: `${error.message}` });
  }
});
