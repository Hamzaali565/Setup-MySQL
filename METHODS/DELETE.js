app.delete("/api/v1/delete", async (req, res) => {
  try {
    let body = req.body;
    if (!body?.id) throw new Error("Invalid Delete request");
    connection.query(
      // "SELECT * FROM hamzadb.users WHERE email = ?"
      "SELECT * FROM hamzadb.users WHERE id = ?",
      [body?.id],
      (err, rows, fields) => {
        if (rows.length === 0) {
          console.log("new error");
          // throw new Error("Data Not Found");
          res.status(300).send({ message: "user not found" });
          return;
        }
        if (!err) {
          connection.query(
            "DELETE FROM users WHERE id = ?",
            [body?.id],
            (err, results) => {
              if (err) throw new Error("Cannot Delete Data");
              if (results)
                res
                  .status(400)
                  .send({ message: "Data Delete Successfully", results });
            }
          );
        }
      }
    );
  } catch (error) {
    console.log("error", error.message);
    res.status(400).send({ message: `${error.message}` });
  }
});
