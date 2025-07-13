import express from "express";

const app = express();
const port = 5000;

app.get("/test", (req, res) => {
  res.json({ status: "Server is working!" });
});

app.listen(port, () => {
  console.log(`Test server running on port ${port}`);
});
