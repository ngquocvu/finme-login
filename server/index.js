import express from "express";
import cors from "cors";
import morgan from "morgan";
import connect from "./database/conn.js";
import route from "./router/route.js";
import * as dotenv from "dotenv";

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan("tiny"));
app.disable("x-powered-by");

app.get("/", (req, res) => {
  res.send("Welcome to finme - backend");
});

app.use("/api", route);

connect().then(() => {
  try {
    app.listen(process.env.PORT || 8080, () => {
      console.log(`Server connected to http://localhost:${process.env.PORT}`);
    });
  } catch (error) {
    console.error("Cannot connect to the server");
  }
});
