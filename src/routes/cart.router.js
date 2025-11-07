import express from "express"
import CartManager from "../cartManager.js"

const cartRouter = express.Router();
const cartManager = new CartManager("./src/data/.carts.json")

cartRouter.post("/", async(req,res)=>{
  try {

    //const newCart = req.body;
    const carts = await cartManager.addCart();
    res.json({message:"Carrito cargado", carts})

    
  } catch (error) {
    res.json({message: error.message});
  }
})

cartRouter.get("/:cid", async (req, res)=> {
  try {
    const cid = req.params.cid
    const carts = await cartManager.selectCarById(cid);
    res.json({products: carts})

  } catch (error) {
    res.json({message: error.message});
  }
})

cartRouter.post("/:cid/products/", async (req,res)=>{

const pid = req.body.pid
const cid = req.params.cid

const carts = await cartManager.addProductCart(cid,pid);

res.json({message:"Productos añadidos", carts})

});

export default cartRouter;