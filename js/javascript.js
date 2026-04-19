// ---------------------------
// Datos iniciales
// ---------------------------

let naves = [
    { nombre: "Transporte Rebelde", tipo: "transporte", velocidad: 700, tripulacion: 10, estado: "reparacion", emoji: "🚛" },
    { nombre: "Fragata Mon Calamari", tipo: "fragata", velocidad: 800, tripulacion: 500, estado: "operativa", emoji: "🚢" },
    { nombre: "Crucero Nebulon-B", tipo: "fragata", velocidad: 850, tripulacion: 800, estado: "desmantelada", emoji: "⚓" },
    { nombre: "Caza Z-95", tipo: "caza", velocidad: 900, tripulacion: 1, estado: "reparacion", emoji: "✈️" },
    { nombre: "B-Wing", tipo: "bombardero", velocidad: 950, tripulacion: 1, estado: "operativa", emoji: "🛸" },
    { nombre: "U-Wing", tipo: "transporte", velocidad: 950, tripulacion: 4, estado: "operativa", emoji: "🚁" },
    { nombre: "Y-Wing", tipo: "bombardero", velocidad: 1000, tripulacion: 2, estado: "reparacion", emoji: "🛫" },
    { nombre: "X-Wing", tipo: "caza", velocidad: 1050, tripulacion: 1, estado: "operativa", emoji: "🚀" },
    { nombre: "A-Wing", tipo: "caza", velocidad: 1300, tripulacion: 1, estado: "operativa", emoji: "💨" },
    { nombre: "Millennium Falcon", tipo: "transporte", velocidad: 1500, tripulacion: 6, estado: "operativa", emoji: "🛸" }
];

let pilotos = JSON.parse(localStorage.getItem("pilotos")) || [];
let misiones = JSON.parse(localStorage.getItem("misiones")) || [];

let ordenAsc = true;

// ---------------------------
// Navegación entre secciones
// ---------------------------

document.querySelectorAll(".topbar-nav span").forEach(span => {
    span.addEventListener("click", () => {
        // Actualizar clase active en navegación
        document.querySelectorAll(".topbar-nav span").forEach(s => s.classList.remove("active"));
        span.classList.add("active");
        
        // Mostrar sección correspondiente
        document.querySelectorAll(".section").forEach(s => s.classList.remove("active"));
        const sectionId = span.dataset.section;
        document.getElementById(sectionId).classList.add("active");

        // Renderizar según sección
        if (sectionId === "hangar") renderListaNaves();
        if (sectionId === "pilotos") {
            renderSelectNaves();
            renderTablaPilotos();
        }
        if (sectionId === "misiones") renderMisiones();
        if (sectionId === "dashboard") renderDashboard();
    });
});

// ---------------------------
// 1. Hangar de naves
// ---------------------------

function renderHangar() {
    const cont = document.getElementById("hangar");
    cont.innerHTML = `
        <section class="title-block">
          <h1>Hangar de Naves</h1>
          <p>Catálogo completo de la flota de la Alianza Rebelde</p>
        </section>

        <section class="filters">
          <div class="search">
            <input type="text" id="buscadorNaves" placeholder="Buscar por nombre..." />
          </div>
          <div class="pill pill-strong">Todos</div>
          <div class="pill" id="contadorNaves">Mostrando ${naves.length} de ${naves.length} naves</div>
          <div class="pill pill-ghost" id="ordenarVelocidad">Fil. Velocidad ↑</div>
        </section>

        <section class="grid" id="listaNaves"></section>
    `;

    document.getElementById("buscadorNaves").addEventListener("input", renderListaNaves);
    document.getElementById("ordenarVelocidad").addEventListener("click", toggleOrdenVelocidad);

    renderListaNaves();
}

function toggleOrdenVelocidad() {
    ordenAsc = !ordenAsc;
    naves.sort((a, b) => ordenAsc ? a.velocidad - b.velocidad : b.velocidad - a.velocidad);
    document.getElementById("ordenarVelocidad").textContent = ordenAsc ? "Fil. Velocidad ↑" : "Fil. Velocidad ↓";
    renderListaNaves();
}

function renderListaNaves() {
    const lista = document.getElementById("listaNaves");
    const texto = document.getElementById("buscadorNaves").value.toLowerCase();

    let filtradas = naves.filter(n => n.nombre.toLowerCase().includes(texto));

    document.getElementById("contadorNaves").textContent = `Mostrando ${filtradas.length} de ${naves.length} naves`;

    lista.innerHTML = filtradas.map(n => `
        <article class="card">
          <div class="card-header">
            <div class="card-title">${n.emoji} ${n.nombre}</div>
            <div class="card-type">${n.tipo}</div>
          </div>
          <div class="card-body">
            <div><span class="label">Velocidad:</span> ${n.velocidad} megaluz</div>
            <div><span class="label">Tripulación:</span> ${n.tripulacion} personas</div>
          </div>
          <div class="card-footer">
            <span class="status ${n.estado}">${n.estado === "operativa" ? "Operativa" : n.estado === "reparacion" ? "En Reparación" : "Desmantelada"}</span>
          </div>
        </article>
    `).join("");
}

// ---------------------------
// 2. CRUD Pilotos
// ---------------------------

// Renderizar select de naves dinámicamente
function renderSelectNaves() {
    const select = document.getElementById("pilotoNave");
    select.innerHTML = '<option value="">Seleccionar nave...</option>' + 
        naves.map(n => `<option value="${n.nombre}">${n.emoji} ${n.nombre}</option>`).join("");
}

// Renderizar tabla de pilotos
function renderTablaPilotos() {
    const tbody = document.getElementById("tbodyPilotos");
    
    if (pilotos.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6">No hay pilotos registrados. ¡Añade el primero!</td></tr>';
        return;
    }

    tbody.innerHTML = pilotos.map((p, index) => `
        <tr>
            <td>${p.nombre}</td>
            <td>${p.rango}</td>
            <td>${p.nave}</td>
            <td>${p.victorias}</td>
            <td><span class="status-piloto ${p.estado}">${p.estado === "activo" ? "Activo" : p.estado === "herido" ? "Herido" : "KIA"}</span></td>
            <td>
                <button class="btn btn-small btn-edit" onclick="editarPiloto(${index})">Editar</button>
                <button class="btn btn-small btn-delete" onclick="eliminarPiloto(${index})">Eliminar</button>
            </td>
        </tr>
    `).join("");
}

// Validar formulario
function validarFormulario() {
    const nombre = document.getElementById("pilotoNombre").value.trim();
    const rango = document.getElementById("pilotoRango").value.trim();
    const nave = document.getElementById("pilotoNave").value;
    const victorias = document.getElementById("pilotoVictorias").value;
    const estado = document.getElementById("pilotoEstado").value;

    if (!nombre || !rango || !nave || !victorias || !estado) {
        alert("Todos los campos son obligatorios.");
        return false;
    }

    if (parseInt(victorias) < 0) {
        alert("Las victorias deben ser un número positivo.");
        return false;
    }

    return true;
}

// Guardar piloto (añadir o editar)
document.getElementById("formPiloto").addEventListener("submit", function(e) {
    e.preventDefault();
    
    if (!validarFormulario()) return;

    const index = document.getElementById("pilotoIndex").value;
    const piloto = {
        nombre: document.getElementById("pilotoNombre").value.trim(),
        rango: document.getElementById("pilotoRango").value.trim(),
        nave: document.getElementById("pilotoNave").value,
        victorias: parseInt(document.getElementById("pilotoVictorias").value),
        estado: document.getElementById("pilotoEstado").value
    };

    if (index !== "") {
        // Editar piloto existente
        pilotos[parseInt(index)] = piloto;
    } else {
        // Añadir nuevo piloto
        pilotos.push(piloto);
    }

    // Guardar en localStorage
    localStorage.setItem("pilotos", JSON.stringify(pilotos));

    // Limpiar formulario
    this.reset();
    document.getElementById("pilotoIndex").value = "";
    document.getElementById("formTitle").textContent = "Añadir Nuevo Piloto";
    document.getElementById("btnSubmit").textContent = "Añadir Piloto";
    document.getElementById("btnCancel").style.display = "none";

    // Actualizar tabla
    renderTablaPilotos();
});

// Editar piloto
function editarPiloto(index) {
    const piloto = pilotos[index];
    
    document.getElementById("pilotoIndex").value = index;
    document.getElementById("pilotoNombre").value = piloto.nombre;
    document.getElementById("pilotoRango").value = piloto.rango;
    document.getElementById("pilotoNave").value = piloto.nave;
    document.getElementById("pilotoVictorias").value = piloto.victorias;
    document.getElementById("pilotoEstado").value = piloto.estado;

    document.getElementById("formTitle").textContent = "Editar Piloto";
    document.getElementById("btnSubmit").textContent = "Guardar Cambios";
    document.getElementById("btnCancel").style.display = "inline-block";

    // Scroll al formulario
    document.querySelector(".form-section").scrollIntoView({ behavior: "smooth" });
}

// Cancelar edición
document.getElementById("btnCancel").addEventListener("click", function() {
    document.getElementById("formPiloto").reset();
    document.getElementById("pilotoIndex").value = "";
    document.getElementById("formTitle").textContent = "Añadir Nuevo Piloto";
    document.getElementById("btnSubmit").textContent = "Añadir Piloto";
    this.style.display = "none";
});

// Eliminar piloto con confirmación
function eliminarPiloto(index) {
    const piloto = pilotos[index];
    const confirmar = confirm(`¿Estás seguro de que deseas eliminar al piloto "${piloto.nombre}"?`);
    
    if (confirmar) {
        pilotos.splice(index, 1);
        localStorage.setItem("pilotos", JSON.stringify(pilotos));
        renderTablaPilotos();
    }
}

// ---------------------------
// 3. Kanban Misiones
// ---------------------------

// Inicializar fecha actual en el formulario
function initFormularioMisiones() {
    const hoy = new Date().toISOString().split('T')[0];
    document.getElementById("misionFecha").value = hoy;
}

// Renderizar select de pilotos activos para misiones
function renderSelectPilotosMision() {
    const select = document.getElementById("misionPiloto");
    const pilotosActivos = pilotos.filter(p => p.estado === "activo");
    
    select.innerHTML = '<option value="">Seleccionar piloto...</option>' + 
        pilotosActivos.map(p => `<option value="${p.nombre}">${p.nombre} (${p.rango})</option>`).join("");
}

// Validar formulario de misión
function validarFormularioMision() {
    const nombre = document.getElementById("misionNombre").value.trim();
    const descripcion = document.getElementById("misionDescripcion").value.trim();
    const piloto = document.getElementById("misionPiloto").value;
    const dificultad = document.getElementById("misionDificultad").value;
    const fecha = document.getElementById("misionFecha").value;

    if (!nombre || !descripcion || !piloto || !dificultad || !fecha) {
        alert("Todos los campos son obligatorios.");
        return false;
    }

    return true;
}

// Crear nueva misión
document.getElementById("formMision").addEventListener("submit", function(e) {
    e.preventDefault();
    
    if (!validarFormularioMision()) return;

    const mision = {
        id: Date.now(),
        nombre: document.getElementById("misionNombre").value.trim(),
        descripcion: document.getElementById("misionDescripcion").value.trim(),
        piloto: document.getElementById("misionPiloto").value,
        dificultad: document.getElementById("misionDificultad").value,
        fecha: document.getElementById("misionFecha").value,
        estado: "pendiente" // Siempre empieza en pendiente
    };

    // Añadir al array de misiones
    misiones.push(mision);
    
    // Guardar en localStorage
    localStorage.setItem("misiones", JSON.stringify(misiones));

    // Limpiar formulario
    this.reset();
    initFormularioMisiones();

    // Actualizar Kanban
    renderKanban();
});

// Renderizar el Kanban completo
function renderKanban() {
    const filtroDificultad = document.getElementById("filtroDificultad").value;
    
    // Filtrar misiones por dificultad
    const misionesFiltradas = filtroDificultad 
        ? misiones.filter(m => m.dificultad === filtroDificultad)
        : misiones;

    // Obtener misiones por columna
    const pendiente = misionesFiltradas.filter(m => m.estado === "pendiente");
    const enCurso = misionesFiltradas.filter(m => m.estado === "encurso");
    const completada = misionesFiltradas.filter(m => m.estado === "completada");

    // Actualizar contadores
    document.getElementById("count-pendiente").textContent = pendiente.length;
    document.getElementById("count-encurso").textContent = enCurso.length;
    document.getElementById("count-completada").textContent = completada.length;

    // Renderizar tarjetas en cada columna
    renderColumna("cards-pendiente", pendiente);
    renderColumna("cards-encurso", enCurso);
    renderColumna("cards-completada", completada);
}

// Renderizar tarjetas de una columna
function renderColumna(containerId, listaMisiones) {
    const container = document.getElementById(containerId);
    
    if (listaMisiones.length === 0) {
        container.innerHTML = '<div class="kanban-empty">No hay misiones</div>';
        return;
    }

    container.innerHTML = listaMisiones.map(m => `
        <div class="kanban-card" data-id="${m.id}">
            <div class="kanban-card-header">
                <span class="kanban-dificultad ${m.dificultad}">${m.dificultad === "facil" ? "Fácil" : m.dificultad === "media" ? "Media" : m.dificultad === "dificil" ? "Difícil" : "Suicida"}</span>
                <button class="btn-delete-card" onclick="eliminarMision(${m.id})" title="Eliminar">✕</button>
            </div>
            <h4>${m.nombre}</h4>
            <p class="kanban-desc">${m.descripcion}</p>
            <div class="kanban-info">
                <span>👤 ${m.piloto}</span>
                <span>📅 ${formatearFecha(m.fecha)}</span>
            </div>
            <div class="kanban-actions">
                ${m.estado !== "pendiente" ? `<button class="btn-move" onclick="moverMision(${m.id}, 'atras')">◀ Atrás</button>` : ""}
                ${m.estado !== "completada" ? `<button class="btn-move" onclick="moverMision(${m.id}, 'adelante')">Adelante ▶</button>` : ""}
            </div>
        </div>
    `).join("");
}

// Formatear fecha para mostrar
function formatearFecha(fechaStr) {
    const fecha = new Date(fechaStr);
    return fecha.toLocaleDateString("es-ES");
}

// Mover misión entre columnas
function moverMision(id, direccion) {
    const index = misiones.findIndex(m => m.id === id);
    if (index === -1) return;

    const mision = misiones[index];
    
    if (direccion === "adelante") {
        if (mision.estado === "pendiente") {
            mision.estado = "encurso";
        } else if (mision.estado === "encurso") {
            mision.estado = "completada";
        }
    } else {
        if (mision.estado === "completada") {
            mision.estado = "encurso";
        } else if (mision.estado === "encurso") {
            mision.estado = "pendiente";
        }
    }

    // Guardar en localStorage
    localStorage.setItem("misiones", JSON.stringify(misiones));

    // Actualizar Kanban
    renderKanban();
}

// Eliminar misión con confirmación
function eliminarMision(id) {
    const mision = misiones.find(m => m.id === id);
    const confirmar = confirm(`¿Estás seguro de que deseas eliminar la misión "${mision.nombre}"?`);
    
    if (confirmar) {
        const index = misiones.findIndex(m => m.id === id);
        if (index !== -1) {
            misiones.splice(index, 1);
            localStorage.setItem("misiones", JSON.stringify(misiones));
            renderKanban();
        }
    }
}

// Event listener para filtro de dificultad
document.getElementById("filtroDificultad").addEventListener("change", renderKanban);

// Inicializar sección de misiones
function renderMisiones() {
    initFormularioMisiones();
    renderSelectPilotosMision();
    renderKanban();
}

// ---------------------------
// 4. Dashboard
// ---------------------------

function renderDashboard() {
    const cont = document.getElementById("dashboard");

    // --- Estadísticas de Naves ---
    const totalNaves = naves.length;
    const navesOperativas = naves.filter(n => n.estado === "operativa").length;
    const navesReparacion = naves.filter(n => n.estado === "reparacion").length;
    const navesDestruidas = naves.filter(n => n.estado === "desmantelada").length;

    // Nave más rápida
    const naveMasRapida = [...naves].sort((a, b) => b.velocidad - a.velocidad)[0];

    // --- Estadísticas de Pilotos ---
    const totalPilotos = pilotos.length;
    const pilotosActivos = pilotos.filter(p => p.estado === "activo").length;
    const pilotosHeridos = pilotos.filter(p => p.estado === "herido").length;
    const pilotosKIA = pilotos.filter(p => p.estado === "KIA").length;

    // Piloto con más victorias
    const pilotoTop = [...pilotos].sort((a, b) => b.victorias - a.victorias)[0];

    // --- Estadísticas de Misiones ---
    const totalMisiones = misiones.length;
    const misionesPendientes = misiones.filter(m => m.estado === "pendiente").length;
    const misionesEnCurso = misiones.filter(m => m.estado === "encurso").length;
    const misionesCompletadas = misiones.filter(m => m.estado === "completada").length;

    // Porcentaje de misiones completadas
    const porcentajeCompletado = totalMisiones > 0 
        ? Math.round((misionesCompletadas / totalMisiones) * 100) 
        : 0;

    cont.innerHTML = `
        <section class="title-block">
          <h1>Mando de la Alianza</h1>
          <p>Resumen de la flota y operaciones</p>
        </section>
        
        <!-- Estadísticas de Naves -->
        <div class="dashboard-section">
            <h2 class="dashboard-title">📡 Estado del Hangar</h2>
            <div class="dashboard-stats">
                <div class="stat-card">
                    <h3>Total Naves</h3>
                    <p class="stat-number">${totalNaves}</p>
                </div>
                <div class="stat-card stat-operativa">
                    <h3>Operativas</h3>
                    <p class="stat-number">${navesOperativas}</p>
                </div>
                <div class="stat-card stat-reparacion">
                    <h3>En Reparación</h3>
                    <p class="stat-number">${navesReparacion}</p>
                </div>
                <div class="stat-card stat-destruida">
                    <h3>Destruidas</h3>
                    <p class="stat-number">${navesDestruidas}</p>
                </div>
            </div>
            <div class="stat-highlight">
                <span class="highlight-label">🚀 Nave más rápida:</span>
                <span class="highlight-value">${naveMasRapida ? `${naveMasRapida.nombre} (${naveMasRapida.velocidad} megaluz)` : "N/A"}</span>
            </div>
        </div>

        <!-- Estadísticas de Pilotos -->
        <div class="dashboard-section">
            <h2 class="dashboard-title">👨‍🚀 Registro de Pilotos</h2>
            <div class="dashboard-stats">
                <div class="stat-card">
                    <h3>Total Pilotos</h3>
                    <p class="stat-number">${totalPilotos}</p>
                </div>
                <div class="stat-card stat-operativa">
                    <h3>Activos</h3>
                    <p class="stat-number">${pilotosActivos}</p>
                </div>
                <div class="stat-card stat-reparacion">
                    <h3>Heridos</h3>
                    <p class="stat-number">${pilotosHeridos}</p>
                </div>
                <div class="stat-card stat-destruida">
                    <h3>KIA</h3>
                    <p class="stat-number">${pilotosKIA}</p>
                </div>
            </div>
            <div class="stat-highlight">
                <span class="highlight-label">⭐ Piloto con más victorias:</span>
                <span class="highlight-value">${pilotoTop ? `${pilotoTop.nombre} (${pilotoTop.victorias} victorias)` : "N/A"}</span>
            </div>
        </div>

        <!-- Estadísticas de Misiones -->
        <div class="dashboard-section">
            <h2 class="dashboard-title">🎯 Operaciones</h2>
            <div class="dashboard-stats">
                <div class="stat-card">
                    <h3>Total Misiones</h3>
                    <p class="stat-number">${totalMisiones}</p>
                </div>
                <div class="stat-card">
                    <h3>Pendientes</h3>
                    <p class="stat-number">${misionesPendientes}</p>
                </div>
                <div class="stat-card">
                    <h3>En Curso</h3>
                    <p class="stat-number">${misionesEnCurso}</p>
                </div>
                <div class="stat-card stat-operativa">
                    <h3>Completadas</h3>
                    <p class="stat-number">${misionesCompletadas}</p>
                </div>
            </div>
            
            <!-- Barra de progreso -->
            <div class="progress-section">
                <div class="progress-header">
                    <span>Progreso de Misiones</span>
                    <span>${porcentajeCompletado}%</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${porcentajeCompletado}%"></div>
                </div>
            </div>
        </div>
    `;
}

// ---------------------------
// Inicializar
// ---------------------------

// Ocultar todas las secciones excepto hangar
document.querySelectorAll(".section").forEach(s => s.classList.remove("active"));
document.getElementById("hangar").classList.add("active");

renderHangar();

// modo oscuro
document.addEventListener("DOMContentLoaded", function () {
    
    let boton = document.getElementById("btn-modo");

    boton.addEventListener("click", function () {
        document.body.classList.toggle("modo-oscuro");
        if (document.body.classList.contains("modo-oscuro")) {
            boton.textContent = "Cambiar a modo claro";
        } else {
            boton.textContent = "Cambiar a modo oscuro";
        }
    });
});
