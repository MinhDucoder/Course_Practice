import express from "express";
import { engine } from "express-handlebars";
import morgan from "morgan";
import * as path from "path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";
import methodOverride from "method-override";
import db from "../src/config/db/index.js"
import SortMiddleWare from "./app/middlewares/SortMiddleWare.js";
import checkToken from "../src/app/middlewares/CheckToken.js";
import helpers from "./helper/handlebars.js";

import authRouter from "./routes/auth.js";
import route from "./routes/index.js";

// Tạo __dirname trong ES Module
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

db.connect();

app.use(express.static(path.join(__dirname, "public")));
app.use(morgan("dev"));

// Body parser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Cookie parser
app.use(cookieParser());

// Method override
app.use(methodOverride("_method"));

// Sắp xếp chung
app.use(SortMiddleWare);


app.use("/auth", authRouter);

app.use(checkToken);

app.engine(
  "hbs",
  engine({
    extname: ".hbs",
    defaultLayout: "main",
    layoutsDir: path.join(__dirname, "resource", "views", "layouts"),
    partialsDir: path.join(__dirname, "resource", "views", "layouts", "partials"),
    helpers,
  })
);
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "resource", "views"));

route(app)  


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server đang chạy trên cổng ${PORT}`);
});
