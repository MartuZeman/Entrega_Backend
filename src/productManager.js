import fs from "fs/promises";
import crypto from "crypto";
import { json } from "stream/consumers";
import { stringify } from "querystring";
import { error } from "console";
import { title } from "process";

class ProductManager {
  constructor(pathFile) {
    this.pathFile = pathFile;
  }

  generateNewId() {
    return crypto.randomUUID();
  }

  async addProduct(newProduct) {
    try {
      //recuperar los productos
      const fileData = await fs.readFile(this.pathFile, "utf-8");
      const products = JSON.parse(fileData);

      const newId = this.generateNewId();
      // Creamos el nuevo producto y lo pusheamos al array de productos
      
      const thumbnails = Array.isArray(newProduct.thumbnails)
        ? newProduct.thumbnails
        : newProduct.thumbnails
        ? [newProduct.thumbnails] // 👈 lo convierte en array con un solo elemento
        : [];

      const product = { id: newId, title: newProduct.title, description: newProduct.description, code: newProduct.code, price: newProduct.price, status: Boolean(newProduct.status), stock: newProduct.stock, category: newProduct.category, thumbnails: thumbnails};
      products.push(product);

      //guardamos los productos en el json
      await fs.writeFile(
        this.pathFile,
        JSON.stringify(products, null, 2),
        "utf-8"
      );

      return products;
    } catch (error) {
      throw new Error("Error al añadir el nuevo producto: " + error.message);
    }
  }

  async getProducts() {
    try {
      const fileData = await fs.readFile(this.pathFile, "utf-8");
      const products = JSON.parse(fileData);

      return products;
    } catch (error) {
      throw new Error("Error al traer los productos: " + error.message);
    }
  }

  async setProductById(pid, updates) {
    try {
      const fileData = await fs.readFile(this.pathFile, "utf-8");
      const products = JSON.parse(fileData);

      const indexProduct = products.findIndex((product) => product.id === pid);

      if (!indexProduct === -1) throw new Error("Producto no encontrado");

      products[indexProduct] = { ...products[indexProduct], ...updates };

      await fs.writeFile(
        this.pathFile,
        JSON.stringify(products, null, 2),
        "utf-8"
      );
    return products;
    
  } catch (error) {
      throw new Error("Error al actualizar los productos: " + error.message);
    }
  }

  async deleteProductById(pid) {
    try {
      const fileData = await fs.readFile(this.pathFile, "utf-8");
      const products = JSON.parse(fileData);

      const filteredProducts = products.filter((product) => product.id !== pid);

      await fs.writeFile(
        this.pathFile,
        JSON.stringify(filteredProducts, null, 2),
        "utf-8"
      );
      return products;
    } catch (error) {
      throw new Error("Error al actualizar los productos: " + error.message);
    }
  }
}

export default ProductManager;
