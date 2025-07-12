console.log("Starting minimal TS server");
import express from "express";
console.log("Express imported");

const app = express();
console.log("Express app created");

app.get("/", (req, res) => {
  res.send("Minimal server works!");
});

const port = 5000;
app.listen(port, "0.0.0.0", () => {
  console.log(`Minimal server on port ${port}`);
});
