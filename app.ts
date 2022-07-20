import express, { Request, Response, Express } from "express";
import fs from "fs";

const app: Express = express();
const port =  process.env.PORT || 8080;
const http = require("http").createServer(app);
const io = require("socket.io")(http)
const handlebars = require("express-handlebars");
const bodyParser = require("body-parser");

app.engine(
	"hbs",
	handlebars({
		extname: ".hbs",
		defaultLayout: "index.hbs",
		layoutsDir: __dirname + "/views/",
		partialsDir: __dirname + "/views/partials/",
	})
);
app.set("views", "./views");
app.set("view engine", "hbs");
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("views"));

let messages: any = [];
let productos: any = [];

app.get("/", (req: Request, res: Response) => {
	res.render("index");
});

http.listen(port, () => {
	console.log(`Listening to Port ${port}`);
});

io.on("connection", (socket: any) => {
	console.log("New Client has Connected");
	socket.emit("messages", messages);
	socket.on("new-message", function (data: any) {
		messages.push(data);
		io.sockets.emit("messages", messages);
		fs.writeFileSync("mensajes.txt", JSON.stringify(messages));
	});
	socket.emit("productos", productos);
	socket.on("new-producto", function (producto: any) {
		productos.push(producto);
		io.sockets.emit("productos", productos);
	});
});


