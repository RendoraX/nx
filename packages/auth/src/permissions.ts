import express from "express";
import helmet from "helmet";
import cors from "cors";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get("/health", (_, res) => {
  res.json({
    success: true,
  });
});

app.listen(4000, () => {
  console.log("API running on 4000");
});