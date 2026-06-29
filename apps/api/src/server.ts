import express from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from 'cookie-parser'
import authRoutes from './routes/auth.routes'

const app = express();

app.use(helmet());
app.use(cookieParser())
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());

app.get("/health", (_, res) => {
  res.json({
    success: true,
  });
});

//AUTH ROUTES
app.use("/api" , authRoutes);


app.listen(4000, () => {
  console.log("API running on 4000");
});