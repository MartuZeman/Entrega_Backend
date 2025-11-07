import express from "express";
import productsRouter from "./routes/products.router.js";
import cartRouter from "./routes/cart.router.js";
import viewsRouter from "./routes/views.router.js";
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import http from "http";
import ProductManager from "./productManager.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server);

//habilitamos poder recibir json en nuestro servidor y el lugar de guardado
app.use(express.json());
app.use(express.static("public"));

//configuracion de handlebars
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

//endpoint

app.use("/api/products", productsRouter);
app.use("/api/carts", cartRouter);
app.use("/", viewsRouter);

//websockets

const productManager = new ProductManager("./src/data/products.json");

io.on("connection", (socket) => {
  console.log("Nuevo usuario conectado" + socket.id);

  socket.on("newProduct", async (productData) => {
    try {
      const newProduct = await productManager.addProduct(productData);
      io.emit("productAdded", newProduct)
    } catch (error) {
      console.error("error al añadir un producto");
    }
  });

  socket.on("buttonDelete", async (idProduct)=>{
    try {
        await productManager.deleteProductById(idProduct);
        io.emit("productDelete", idProduct)
    } catch (error) {
      console.error("error al eliminar un producto");
    }
  });
});

//inicia el servidor
server.listen(8080, () => {
  console.log("Servidor iniciado correctamente");
});
