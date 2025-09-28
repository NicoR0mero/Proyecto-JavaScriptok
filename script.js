const listasContainer = document.getElementById("listas-container");
const formLista = document.getElementById("form-lista");
const nombreListaInput = document.getElementById("nombre-lista");

let listas = JSON.parse(localStorage.getItem("listas")) || [];

function guardarListas() {
  localStorage.setItem("listas", JSON.stringify(listas));
}

function renderizarListas() {
  listasContainer.innerHTML = "";

  listas.forEach((lista, listaIndex) => {
    const div = document.createElement("div");
    div.className = "lista";

    const titulo = document.createElement("h3");
    titulo.textContent = lista.nombre;

    const ul = document.createElement("ul");
    let total = 0;

    lista.productos.forEach((producto, productoIndex) => {
      const li = document.createElement("li");

      const span = document.createElement("span");
      span.textContent = `${producto.nombre} - $${producto.precio}`;

      const eliminarBtn = document.createElement("button");
      eliminarBtn.textContent = "🗑️";
      eliminarBtn.className = "eliminar-producto";
      eliminarBtn.dataset.lista = listaIndex;
      eliminarBtn.dataset.producto = productoIndex;

      li.appendChild(span);
      li.appendChild(eliminarBtn);
      ul.appendChild(li);

      total += producto.precio;
    });

    const totalDiv = document.createElement("div");
    totalDiv.innerHTML = `<strong>Total:</strong> $${total}`;

    const formProducto = document.createElement("form");
    formProducto.className = "agregar-producto";
    formProducto.innerHTML = `
      <input type="text" placeholder="Producto" required />
      <input type="number" placeholder="Precio" required min="0" />
      <button type="submit">Agregar</button>
    `;

    formProducto.addEventListener("submit", (e) => {
      e.preventDefault();
      const nombre = formProducto
        .querySelector("input[type='text']")
        .value.trim();
      const precio = parseFloat(
        formProducto.querySelector("input[type='number']").value
      );
      if (nombre && !isNaN(precio)) {
        listas[listaIndex].productos.push({ nombre, precio });
        guardarListas();
        renderizarListas();
      }
    });

    const eliminarListaBtn = document.createElement("button");
    eliminarListaBtn.textContent = "Eliminar lista";
    eliminarListaBtn.className = "eliminar-lista";
    eliminarListaBtn.addEventListener("click", () => {
      listas.splice(listaIndex, 1);
      guardarListas();
      renderizarListas();
    });

    div.appendChild(titulo);
    div.appendChild(ul);
    div.appendChild(totalDiv);
    div.appendChild(formProducto);
    div.appendChild(eliminarListaBtn);
    listasContainer.appendChild(div);
  });
}

formLista.addEventListener("submit", (e) => {
  e.preventDefault();
  const nombre = nombreListaInput.value.trim();
  if (nombre) {
    listas.push({ nombre, productos: [] });
    nombreListaInput.value = "";
    guardarListas();
    renderizarListas();
  }
});

listasContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains("eliminar-producto")) {
    const listaIndex = e.target.dataset.lista;
    const productoIndex = e.target.dataset.producto;
    listas[listaIndex].productos.splice(productoIndex, 1);
    guardarListas();
    renderizarListas();
  }
});

renderizarListas();
