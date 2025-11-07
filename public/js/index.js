const socket = io();

const formNewProduct = document.getElementById("formNewProduct");

formNewProduct.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(formNewProduct);

  const productData = {};

  formData.forEach((value, key) => {
    productData[key] = value;

    inputs = formNewProduct.querySelectorAll("input");
    inputs.forEach((input) => {
      if (input.type === "checkbox" || input.type === "radio") {
        input.checked = false;
      } else {
        input.value = "";
      }
    });
  });

  console.log(productData);

  socket.emit("newProduct", productData);
});

socket.on("productAdded", (newProduct) => {
  const productsList = document.getElementById("productsList");
  //productsList.innerHTML += `<li id="${newProduct.id}"> ${newProduct.title} - ${newProduct.price} <button type="button" class="btnDelete" data-id="${newProduct.id}"="">Eliminar</button> </li>`;
  productsList.innerHTML += `<li id="${newProduct.id}" class="product-card">
          <h3>${newProduct.title}</h3>
          <p><strong>Descripción:</strong> ${newProduct.description}</p>
          <p><strong>Código:</strong> ${newProduct.code}</p>
          <p><strong>Precio:</strong> $${newProduct.price}</p>
          <p><strong>Stock:</strong> ${newProduct.stock}</p>
          <p><strong>Categoria:</strong> ${newProduct.category}</p>
          <button type="button" class="btnDelete" data-id="${newProduct.id}"="">Eliminar</button>
      </li>`;

});

const buttons = document.querySelectorAll(".btn-delete");

addEventListener("click", (event) => {
  if (event.target.classList.contains("btnDelete")) {
    event.preventDefault();

    const idProduct = event.target.dataset.id;

    socket.emit("buttonDelete", idProduct);
  }
});

socket.on("productDelete", (deleteProduct) => {
  const productItem = document.getElementById(`${deleteProduct}`);
  console.log(productItem);
  if (productItem) {
    productItem.remove();
  }
});
