import express from "express";
import { Http2ServerRequest } from "http2";

const app = express();

app.get("/health", (_ : , res : Http2ServerRequest) => {
  res.json({
    status: "ok",
    message : "Server is running"
  });
});

app.listen(4000, () => {
  console.log("API running");
});