import express from "express";
import { parallel_matrix_multiply } from "./matrixMultiply";

const PORT = 3000;

const app = express();
app.use(express.json());

// start server
app.listen(PORT, () => {
  console.log(`AyaTask-Matrix running at http://localhost:${PORT}`);
});

const Router = express.Router();

Router.get("/", (req, res) => {
  const { a, b, c } = req.body;

  const solved = parallel_matrix_multiply(a, b, c);

  console.log(solved);

  return res.status(200).json({ solved });
});

app.use(Router);
