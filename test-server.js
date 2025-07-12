import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.send("Test server is working!");
});

app.get("/api/test", (req, res) => {
  res.json({ message: "API is working!" });
});

const port = 5000;
app.listen(port, "0.0.0.0", () => {
  console.log(`Test server running on port ${port}`);
});
