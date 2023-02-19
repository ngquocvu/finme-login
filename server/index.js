import express from "express";
import cors from "cors";
import morgan from "morgan";
import connect from "./database/conn.js";
import route from "./router/route.js";
import * as dotenv from "dotenv";

dotenv.config();
const app = express();

app.use(express.json());
app.use(express.static("public"));
app.use(cors());
app.use(morgan("tiny"));
app.disable("x-powered-by");

app.get("/", (req, res) => {
  res.sendFile("index.html", { root: path.join(__dirname, "public") });
});

app.use("/api", route);

connect().then(() => {
  try {
    app.listen(process.env.PORT, () => {
      console.log(`Server connected to http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Cannot connect to the server");
  }
});
module.exports = app;
