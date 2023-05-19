import bodyParser from "body-parser";
import express, { query } from "express";
import mysql from "mysql";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
dotenv.config();

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

const connection = mysql.createConnection({
  host: "localhost",
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
});
const SECRET = process.env.SECRET || "topsecret";
//
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
//
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
connection.connect((err) => {
  if (err) console.log(`Database connection failed ${err}`);
  console.log("connection successfull..");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
