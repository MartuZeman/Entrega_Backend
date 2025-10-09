import fs from "fs/promises";
import crypto from "crypto";
import { json } from "stream/consumers";
import { stringify } from "querystring";
import { error } from "console";

class CartManager {
  constructor(pathFile) {
    this.pathFile = pathFile;
  }

  generateNewId() {
    return crypto.randomUUID();
  }

  async addCart() {
    try {
      const fileData = await fs.readFile(this.pathFile, "utf-8");
      const carts = JSON.parse(fileData);

      const newId = this.generateNewId();
      // Creamos el nuevo producto y lo pusheamos al array de productos
      const cart = { id: newId, products: [] };
      carts.push(cart);

      //guardamos los productos en el json
      await fs.writeFile(
        this.pathFile,
        JSON.stringify(carts, null, 2),
        "utf-8"
      );

      return carts;
    } catch (error) {
      throw new Error("Error al añadir el nuevo carrito: " + error.message);
    }
  }

  async selectCarById(cid) {
    try {
      const fileData = await fs.readFile(this.pathFile, "utf-8");
      const carts = JSON.parse(fileData);

      const findCart = carts.find((cart) => cart.id === cid);

      return findCart.products;
    } catch (error) {
      throw new Error(
        "Error al cargar los productos del carrito: " + error.message
      );
    }
  }

  async addProductCart(cid, pid) {
    try {
      const fileData = await fs.readFile(this.pathFile, "utf-8");
      const carts = JSON.parse(fileData);
      const newId = this.generateNewId();
      const indexCart = carts.findIndex((cart) => cart.id === cid);
      
      if (!indexCart === -1) throw new Error("Carrito no encontrado");
      
      if (!pid) {
        const newProduct = { id: newId, quantity: 1 };
        carts[indexCart].products.push(newProduct);
      } else {
        const indexProduct = carts[indexCart].products.findIndex(
          (product) => product.id === pid
        );
        if (!indexProduct === -1) throw new Error("Producto no encontrado");
        carts[indexCart].products[indexProduct].quantity += 1;
      }

      await fs.writeFile(
        this.pathFile,
        JSON.stringify(carts, null, 2),
        "utf-8"
      );

      return carts;
    } catch (error) {
      throw new Error(
        "Error al añadir el producto al carrito: " + error.message
      );
    }
  }
}


export default CartManager;
