import express from "express";
import cors from "cors";
import morgan from "morgan";
import connect from "./database/conn.js";
import route from "./router/route.js";
import * as dotenv from "dotenv";

dotenv.config();
const app = express();
const port = 8080;

app.use(express.json());
app.use(cors());
app.use(morgan("tiny"));
app.disable("x-powered-by");

app.get("/", (req, res) => {
  res.status(201).json("Home GET Request");
});

app.use("/api", route);

connect().then(() => {
  try {
    app.listen(port, () => {
      console.log(`Server connected to http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Cannot connect to the server");
  }
});
