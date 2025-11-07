import express from "express";
import ProductManager from "../productManager.js";

const productsRouter = express.Router();
const productManager = new ProductManager("./src/data/products.json")

productsRouter.get("/", async (req, res) => {
  try {
    const products = await productManager.getProducts();
    res.json({ products, message: "Lista de productos" });
  } catch (error) {
    res.json({message: error.message});
  }
});

productsRouter.delete("/:pid",async(req,res)=>{
    try {
        const pid = req.params.pid;
        const products = await productManager.deleteProductById(pid);
        res.json({products, message: "Producto Eliminado"})
    } catch (error) {
       res.json({message: error.message}); 
    }
})

productsRouter.post("/", async(req,res)=>{
  try {

    const newProduct = req.body;
    const products = await productManager.addProduct(newProduct);
    res.json({message:"Producto agregado", products})
  } catch (error) {
    res.json({message: error.message}); 
  }
})

productsRouter.put("/:pid", async (req, res)=>{
try {
  const pid = req.params.pid;
  const updates = req.body;

  const products = await productManager.setProductById(pid,updates);
  res.json({message:"Producto actualizado", products} )

} catch (error) {
   res.json({message: error.message}); 
}
})

export default productsRouter