// ---------------------------
// Datos iniciales
// ---------------------------

let naves = [
    { nombre: "X-Wing", tipo: "caza", velocidad: 105, tripulacion: 1, estado: "operativa", emoji: "🚀" },
    { nombre: "Millennium Falcon", tipo: "transporte", velocidad: 120, tripulacion: 4, estado: "operativa", emoji: "🛸" }
];

let pilotos = JSON.parse(localStorage.getItem("pilotos")) || [];
let misiones = JSON.parse(localStorage.getItem("misiones")) || [];

// ---------------------------
// Navegación entre secciones
// ---------------------------

document.querySelectorAll(".navbar li").forEach(li => {
    li.addEventListener("click", () => {
        document.querySelectorAll(".section").forEach(s => s.classList.remove("active"));
        document.getElementById(li.dataset.section).classList.add("active");

        if (li.dataset.section === "dashboard") renderDashboard();
    });
});

// ---------------------------
// 1. Hangar de naves
// ---------------------------

function renderHangar() {
    const cont = document.getElementById("hangar");
    cont.innerHTML = `
        <h2>Hangar de Naves</h2>
        <input id="buscadorNaves" placeholder="Buscar nave...">
        <select id="filtroTipo">
            <option value="">Todos los tipos</option>
            <option value="caza">Caza</option>
            <option value="transporte">Transporte</option>
        </select>
        <button id="ordenarVelocidad">Ordenar por velocidad</button>
        <p id="contadorNaves"></p>
        <div id="listaNaves" class="grid"></div>
    `;

    document.getElementById("buscadorNaves").addEventListener("input", renderListaNaves);
    document.getElementById("filtroTipo").addEventListener("change", renderListaNaves);
    document.getElementById("ordenarVelocidad").addEventListener("click", toggleOrdenVelocidad);

    renderListaNaves();
}

let ordenAsc = true;

function toggleOrdenVelocidad() {
    ordenAsc = !ordenAsc;
    naves.sort((a, b) => ordenAsc ? a.velocidad - b.velocidad : b.velocidad - a.velocidad);
    renderListaNaves();
}

function renderListaNaves() {
    const lista = document.getElementById("listaNaves");
    const texto = document.getElementById("buscadorNaves").value.toLowerCase();
    const tipo = document.getElementById("filtroTipo").value;

    let filtradas = naves.filter(n =>
        n.nombre.toLowerCase().includes(texto) &&
        (tipo === "" || n.tipo === tipo)
    );

    document.getElementById("contadorNaves").textContent =
        `Mostrando ${filtradas.length} naves`;

    lista.innerHTML = filtradas.map(n => `
        <div class="card">
            <h3>${n.emoji} ${n.nombre}</h3>
            <p>Tipo: ${n.tipo}</p>
            <p>Velocidad: ${n.velocidad}</p>
            <p>Estado: ${n.estado}</p>
        </div>
    `).join("");
}

// ---------------------------
// 2. CRUD Pilotos
// ---------------------------
// (te lo genero cuando me digas)

// ---------------------------
// 3. Kanban Misiones
// ---------------------------
// (te lo genero cuando me digas)

// ---------------------------
// 4. Dashboard
// ---------------------------

function renderDashboard() {
    const cont = document.getElementById("dashboard");

    const totalNaves = naves.length;
    const operativas = naves.filter(n => n.estado === "operativa").length;

    const totalPilotos = pilotos.length;
    const activos = pilotos.filter(p => p.estado === "activo").length;

    const totalMisiones = misiones.length;
    const completadas = misiones.filter(m => m.estado === "completada").length;

    cont.innerHTML = `
        <h2>Mando de la Alianza</h2>
        <p>Total naves: ${totalNaves} (Operativas: ${operativas})</p>
        <p>Total pilotos: ${totalPilotos} (Activos: ${activos})</p>
        <p>Total misiones: ${totalMisiones} (Completadas: ${completadas})</p>

        <h3>Progreso de misiones</h3>
        <div style="background:#333; width:300px; height:20px;">
            <div style="background:var(--color-primario); width:${(completadas/totalMisiones)*100 || 0}%; height:100%;"></div>
        </div>
    `;
}

// Inicializar
renderHangar();
document.getElementById("hangar").classList.add("active");
