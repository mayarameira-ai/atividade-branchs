const input = document.getElementById("nova");
const add = document.getElementById("add");
const lista = document.getElementById("lista");
const filtros = document.querySelectorAll("[data-filtro]");
const btnTema = document.getElementById("alternar-tema");
let tarefas = JSON.parse(localStorage.getItem("tarefas")) || [];
let filtro = "todas";

let temaEscuro = localStorage.getItem("tema") === "escuro";
function aplicarTema() {
  if (temaEscuro) {
    document.body.classList.add("dark");
    btnTema.textContent = "Tema Claro";
  } else {
    document.body.classList.remove("dark");
    btnTema.textContent = "Tema Escuro";
  }
  localStorage.setItem("tema", temaEscuro ? "escuro" : "claro");
}
btnTema.onclick = () => { temaEscuro = !temaEscuro; aplicarTema(); };
aplicarTema();

function salvar() {
  localStorage.setItem("tarefas", JSON.stringify(tarefas));
}

function mostrar() {
  lista.innerHTML = "";
  tarefas.filter(t => filtro === "todas" ||
    (filtro === "pendentes" && !t.ok) ||
    (filtro === "concluidas" && t.ok))
  .forEach((t, i) => {
    const li = document.createElement("li");
    li.textContent = t.texto;
    if (t.ok) li.classList.add("concluida");
    li.onclick = () => { tarefas[i].ok = !tarefas[i].ok; salvar(); mostrar(); };
    const del = document.createElement("button");
    del.textContent = "X";
    del.onclick = e => {
      e.stopPropagation();
      if (confirm("Excluir?")) { tarefas.splice(i, 1); salvar(); mostrar(); }
    };
    li.appendChild(del);
    lista.appendChild(li);
  });
}

add.onclick = () => {
  if (input.value) {
    tarefas.push({ texto: input.value, ok: false });
    input.value = "";
    salvar();
    mostrar();
  }
};

filtros.forEach(b => b.onclick = () => { filtro = b.dataset.filtro; mostrar(); });
mostrar();