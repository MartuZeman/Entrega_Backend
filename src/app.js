import express from "express";
import ProductManager from "./productManager.js";
import CartManager from "./cartManager.js";

const app = express();

//habilitamos poder recibir json en nuestro servidor
app.use(express.json());

const productManager = new ProductManager("./src/products.json");
const cartManager = new CartManager("./src/carts.json")

//endpoint

app.get("/", (req, res) => {
  res.json({ status: "success", message: "Hola Mundo!" });
});

app.get("/api/products", async (req, res) => {
  try {
    const products = await productManager.getProducts();
    res.json({ products, message: "Lista de productos" });
  } catch (error) {
    res.json({message: error.message});
  }
});

app.delete("/api/products/:pid",async(req,res)=>{
    try {
        const pid = req.params.pid;
        const products = await productManager.deleteProductById(pid);
        res.json({products, message: "Producto Eliminado"})
    } catch (error) {
       res.json({message: error.message}); 
    }
})

app.post("/api/products", async(req,res)=>{
  try {

    const newProduct = req.body;
    const products = await productManager.addProduct(newProduct);
    res.json({message:"Producto agregado", products})
  } catch (error) {
    res.json({message: error.message}); 
  }
})

app.put("/api/products/:pid", async (req, res)=>{
try {
  const pid = req.params.pid;
  const updates = req.body;

  const products = await productManager.setProductById(pid,updates);
  res.json({message:"Producto actualizado", products} )

} catch (error) {
   res.json({message: error.message}); 
}
})

app.post("/api/carts", async(req,res)=>{
  try {

    //const newCart = req.body;
    const carts = await cartManager.addCart();
    res.json({message:"Carrito cargado", carts})

    
  } catch (error) {
    res.json({message: error.message});
  }
})

app.get("/api/carts/:cid", async (req, res)=> {
  try {
    const cid = req.params.cid
    const carts = await cartManager.selectCarById(cid);
    res.json({products: carts})

  } catch (error) {
    res.json({message: error.message});
  }
})

app.post("/api/carts/:cid/products/", async (req,res)=>{

const pid = req.body.pid
const cid = req.params.cid

const carts = await cartManager.addProductCart(cid,pid);

res.json({message:"Productos añadidos", carts})

});

app.listen(8080, () => {
  console.log("Servidor iniciado correctamente");
});
