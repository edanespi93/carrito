const d = document;
const $template = d.getElementById("template-card").content,
  $templateFooter = d.getElementById("template-footer").content,
  $templateCar = d.getElementById("template-carrito").content,
  $cards = d.getElementById("cards"),
  $footer = d.getElementById("footer"),
  $fragment = d.createDocumentFragment(),
  $items = d.getElementById("items");
let carrito = {};

d.addEventListener("DOMContentLoaded", (e) => {
  getApi();
  if (localStorage.getItem("carrito")) {
    carrito = JSON.parse(localStorage.getItem("carrito"));
    addProduct();
  }
});

$cards.addEventListener("click", (e) => {
  addCard(e);
});
$items.addEventListener("click", (e) => {
  btnAccion(e);
});

const getApi = async () => {
  try {
    let res = await fetch("api.json"),
      data = await res.json();
    templateData(data);
  } catch (err) {
    console.log(err);
  }
};
const templateData = (data) => {
  data.forEach((producto) => {
    console.log(data);
    $template.querySelector("h5").textContent = producto.title;
    $template.querySelector("p").textContent = producto.precio;
    $template.querySelector("img").setAttribute("src", producto.thumbnailUrl);
    $template.querySelector(".btn").dataset.id = producto.id;

    let clone = $template.cloneNode(true);
    //let clone = d.importNode($template, true);
    $fragment.appendChild(clone);
  });
  $cards.appendChild($fragment);
};
const addCard = (e) => {
  if (e.target.matches(".btn")) {
    setCarrito(e.target.parentElement);
  }
  e.stopPropagation();
};

const setCarrito = (objeto) => {
  const producto = {
    id: objeto.querySelector(".btn-dark").dataset.id,
    title: objeto.querySelector("h5").textContent,
    precio: objeto.querySelector("p").textContent,
    cantidad: 1,
  };
  if (carrito.hasOwnProperty(producto.id)) {
    producto.cantidad = carrito[producto.id].cantidad + 1;
  }
  carrito[producto.id] = { ...producto };
  addProduct();
};
const addProduct = () => {
  $items.innerHTML = ``;
  Object.values(carrito).forEach((producto) => {
    $templateCar.querySelector("th").textContent = producto.id;
    $templateCar.querySelectorAll("td")[0].textContent = producto.title;
    $templateCar.querySelectorAll("td")[1].textContent = producto.cantidad;
    $templateCar.querySelector(".btn-info").dataset.id = producto.id;
    $templateCar.querySelector(".btn-danger").dataset.id = producto.id;

    $templateCar.querySelector("span").textContent =
      producto.precio * producto.cantidad;

    let clone = $templateCar.cloneNode(true);
    //let clone = d.importNode($template, true);
    $fragment.appendChild(clone);
  });
  $items.appendChild($fragment);
  pintarFooter();
  localStorage.setItem("carrito", JSON.stringify(carrito));
};
const pintarFooter = () => {
  $footer.innerHTML = ``;
  if (Object.keys(carrito).length === 0) {
    $footer.innerHTML = `<th scope="row" colspan="5">Carrito vacío - comience a comprar!</th>`;
    return;
  }
  const nCantidad = Object.values(carrito).reduce(
    (acc, { cantidad }) => acc + cantidad,
    0
  );
  const nTotal = Object.values(carrito).reduce(
    (acc, { cantidad, precio }) => acc + cantidad * precio,
    0
  );
  $templateFooter.querySelectorAll("td")[0].textContent = nCantidad;
  $templateFooter.querySelector("span").textContent = nTotal;

  let clone = $templateFooter.cloneNode(true);
  $fragment.appendChild(clone);
  $footer.appendChild($fragment);

  const $deleteFooter = d.getElementById("vaciarcarrito");
  $deleteFooter.addEventListener("click", () => {
    carrito = {};
    addProduct();
  });
};
const btnAccion = (e) => {
  if (e.target.matches(".btn-info")) {
    const producto = carrito[e.target.dataset.id];
    producto.cantidad = carrito[e.target.dataset.id].cantidad + 1;
    carrito[e.target.dataset.id] = { ...producto };
    addProduct();
  }
  if (e.target.matches(".btn-danger")) {
    const producto = carrito[e.target.dataset.id];
    producto.cantidad--;
    if (producto.cantidad === 0) {
      delete carrito[e.target.dataset.id];
    }
    // carrito[e.target.dataset.id] = { ...producto };

    addProduct();
  }
  e.stopPropagation();
};
