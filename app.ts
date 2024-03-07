import express from "express";
import { router as movie } from "./api/movie";
import { router as person } from "./api/person";
import { router as star } from "./api/star";

import bodyParser from "body-parser";

export const app = express();
import cors from "cors";
app.use(
  cors({
    origin: "*",
  })
);

app.use(bodyParser.text());
app.use(bodyParser.json());

app.use("/movie", movie);
app.use("/person", person);
app.use("/star", star);