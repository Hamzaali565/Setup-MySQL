// get all users
app.get(`/api/v1/users`, (req, res) => {
  connection.query("SELECT * FROM hamzadb.users", (err, rows, fields) => {
    if (!err) res.status(200).send({ data: rows });
    else console.log(err);
  });
});
// get user by ID
app.get(`/api/v1/user/:id`, (req, res) => {
  connection.query(
    "SELECT * FROM hamzadb.users WHERE id = ?",
    [req.params.id],
    (err, rows, fields) => {
      if (!err) res.status(200).send({ data: rows });
      else console.log(err);
    }
  );
});
// last row of Table
app.get("/api/v1/last", (req, res) => {
  connection.query(
    "SELECT * FROM users ORDER BY id DESC LIMIT 1",
    (err, rows, fields) => {
      if (err) {
        console.error("Error fetching data:", err);
        res.status(500).send({ error: "Failed to fetch data" });
        return;
      }

      if (rows.length === 0) {
        res.status(404).send({ error: "No data found" });
        return;
      }

      res.status(200).send({ data: rows });
      console.log("Data retrieved successfully");
    }
  );
});
