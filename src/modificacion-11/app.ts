import express from "express";
import "./db/mongoose.js";

import { sportsRouter } from "./routers/sportsRouter.js";

const port = process.env.PORT || 3000;

export const app: express.Application = express();
app.use(express.json());
app.use(sportsRouter);


app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
  console.log(`http://localhost:${port}`);
});