const express = require('express');
const Contenedor = require('./Desafio 3 Clase')
const {engine} = require('express-handlebars')

const fs = require("fs");

const app = express()
const server = require("http").Server(app);
const io = require("socket.io")(server);

const ContenedorEx =  new Contenedor('texto1.txt')

//establecemos la configuración de handlebars
app.use(express.static("public"));
app.engine(
    "hbs",
    engine({
        extname: ".hbs",
        defaultLayout: "index.hbs",
        layoutsDir: __dirname + "/views/layouts",
        partialsDir: __dirname + "/views/",
      })
);


app.set("view engine", "hbs");
app.set("views", "./views");

app.use(express.json())
app.use(express.urlencoded({extended: true}))

const PORT = process.env.PORT || 8080;
const messages = []

io.on("connection", async (socket) => {
    console.log("Se ha conectado un nuevo usuario");
  
    socket.emit("messages", messages);
    socket.on("new-message", function (data) {
      messages.push(data);
      io.sockets.emit("messages", messages);
      fs.writeFileSync("messages.txt", JSON.stringify(messages));
    });
  
    const productArray = await ContenedorEx.getAll();
  
    socket.emit("products", productArray);
    socket.on("new-product", async function (newProduct) {
      await ContenedorEx.save(newProduct);
      const updatedproductArray = await ContenedorEx.getAll();
      io.sockets.emit("products", updatedproductArray);
    });
  });


app.get('/', async (req, res) => {
    res.render('createProduct');
})


app.get('/productos', async (req, res) => {
    const arrayAll = await ContenedorEx.getAll()
    //return res.send( arrayAll)
    console.log(arrayAll)
    if (arrayAll && arrayAll.length > 0) {
        res.render("productList", {productList: arrayAll, listExists: true});
    }else {
        res.render("noProducts.hbs")
    }
})

app.post('/productos', async (req, res) => {
    console.log(req.body)
    await ContenedorEx.save(req.body)
    const arrayAll = await ContenedorEx.getAll()
    console.log(arrayAll)
    res.render("productList", { productList: arrayAll, listExists: true });
})

const instance = server.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`)
})
instance.on("error", (error) => console.log(`Error en servidor ${error}`))
