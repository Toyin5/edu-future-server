import express from "express";
import database from "./utils/db.js";
import "dotenv/config";
import cors from "cors";
import studentRoute from "./routes/student.js";

const app = express();
const PORT = 8080;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded());
app.use("/api", studentRoute);

await database();

app.use("/", (_, res) => {
  res.status(404).json({
    status: 404,
    error: "Page not found",
  });
});

app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);

export default app;
