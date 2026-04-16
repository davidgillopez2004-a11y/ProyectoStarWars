const naves = [
    { nombre: "X-Wing", tipo: "Caza", velocidad: 1050, tripulacion: 1, estado: "operativa", icono: "🚀" },
    { nombre: "Millennium Falcon", tipo: "Transporte", velocidad: 1500, tripulacion: 6, estado: "operativa", icono: "🛸" },
    { nombre: "Y-Wing", tipo: "Bombardero", velocidad: 1000, tripulacion: 2, estado: "en reparación", icono: "💣" },
    { nombre: "A-Wing", tipo: "Caza", velocidad: 1300, tripulacion: 1, estado: "operativa", icono: "⚡" }
];

// LocalStorage
let pilotos = JSON.parse(localStorage.getItem('pilotos')) || [];
let misiones = JSON.parse(localStorage.getItem('misiones')) || [];

// Guardamos su posición en el array
let indexEditando = -1;

// Navegacion
function irASeccion(idSeccion) {
    // 1. Buscamos en todas las secciones que haya del HTML
    const secciones = document.querySelectorAll('main > section');
    
    // 2. Las ocultamos todas
    for (let i = 0; i < secciones.length; i++) {
        secciones[i].style.display = "none";
    }

    // 3. Mostramos solo la que queremos
    secciones[idSeccion].style.display = "block";

    //Actualizamos las estadísticas
    if (idSeccion === 3) {
        actualizarDashboard();
    }
}

// HANGAR 
function pintarHangar() {
    const contenedor = document.querySelector('.grid');
    const buscador = document.querySelector('.filters input').value.toLowerCase();
    
    contenedor.innerHTML = ""; 
    let contador = 0;

    for (let i = 0; i < naves.length; i++) {
        const n = naves[i];

        // Filtrar: si el nombre de la nave incluye lo que hay en el buscador
        if (n.nombre.toLowerCase().includes(buscador)) {
            contenedor.innerHTML += `
                <article class="card">
                    <div class="card-header">
                        <div class="card-title">${n.icono} ${n.nombre}</div>
                    </div>
                    <div class="card-body">
                        <p>Velocidad: ${n.velocidad} MGLT</p>
                        <p>Estado: ${n.estado}</p>
                    </div>
                </article>
            `;
            contador++;
        }
    }
    document.querySelector('.pill:not(.pill-strong)').textContent = "Viendo " + contador + " naves";
}

// Pilotos (Añadir y Listar)
function pintarPilotos() {
    const cuerpoTabla = document.querySelector('table tbody');
    cuerpoTabla.innerHTML = "";

    for (let i = 0; i < pilotos.length; i++) {
        const p = pilotos[i];
        cuerpoTabla.innerHTML += `
            <tr>
                <td>${p.nombre}</td>
                <td>${p.nave}</td>
                <td>${p.victorias}</td>
                <td>
                    <button onclick="cargarPilotoParaEditar(${i})">Editar</button>
                    <button onclick="borrarPiloto(${i})">Borrar</button>
                </td>
            </tr>
        `;
    }
    
    localStorage.setItem('pilotos', JSON.stringify(pilotos));

    // Actualizacion de pilotos para las misiones
    actualizarSelectPilotos();
}

function añadirPiloto(event) {
    event.preventDefault(); 
    
    const formulario = event.target;
    const nuevoPiloto = {
        nombre: formulario[0].value,
        rango: formulario[1].value,
        nave: formulario[2].value,
        victorias: parseInt(formulario[3].value),
        estado: formulario[4].value
    };

    // Validación 
    if (nuevoPiloto.nombre === "" || nuevoPiloto.victorias < 0) {
        alert("Faltan datos o las victorias son negativas");
        return;
    }

    if (indexEditando === -1) {
        pilotos.push(nuevoPiloto); 
    } else {
        pilotos[indexEditando] = nuevoPiloto; 
        indexEditando = -1; 
        document.querySelector('section:nth-of-type(2) button').textContent = "Añadir Piloto";
    }

    formulario.reset();
    pintarPilotos();
}

function borrarPiloto(i) {
    if (confirm("¿Seguro?")) {
        pilotos.splice(i, 1); 
        pintarPilotos();
    }
}

function cargarPilotoParaEditar(i) {
    const p = pilotos[i];
    const form = document.querySelector('section:nth-of-type(2) form');
    
    form[0].value = p.nombre;
    form[1].value = p.rango;
    form[2].value = p.nave;
    form[3].value = p.victorias;
    form[4].value = p.estado;

    indexEditando = i;
    document.querySelector('section:nth-of-type(2) button').textContent = "Guardar Cambios";
}

// Kanban
function actualizarSelectPilotos() {
    const select = document.querySelector('section:nth-of-type(3) select');
    select.innerHTML = '<option>Seleccionar piloto...</option>';
    
    for (let i = 0; i < pilotos.length; i++) {
        if (pilotos[i].estado === "Activo") {
            select.innerHTML += `<option>${pilotos[i].nombre}</option>`;
        }
    }
}

function crearMision(event) {
    event.preventDefault();
    const f = event.target;
    const mision = {
        titulo: f[0].value,
        piloto: f[1].value,
        estado: "Pendiente" 
    };
    misiones.push(mision);
    f.reset();
    pintarMisiones();
}

function pintarMisiones() {
   
    const colPendiente = document.querySelectorAll('.columna')[0];
    const colCurso = document.querySelectorAll('.columna')[1];
    const colFin = document.querySelectorAll('.columna')[2];

    colPendiente.innerHTML = "<h3>Pendiente</h3>";
    colCurso.innerHTML = "<h3>En Curso</h3>";
    colFin.innerHTML = "<h3>Completada</h3>";

    for (let i = 0; i < misiones.length; i++) {
        const m = misiones[i];
        const tarjeta = `
            <div class="card" style="margin: 5px; padding: 5px; border: 1px solid gray">
                <p><strong>${m.titulo}</strong></p>
                <p>Piloto: ${m.piloto}</p>
                <button onclick="moverMision(${i})">Siguiente</button>
            </div>
        `;

        if (m.estado === "Pendiente") colPendiente.innerHTML += tarjeta;
        else if (m.estado === "En Curso") colCurso.innerHTML += tarjeta;
        else colFin.innerHTML += tarjeta;
    }
    localStorage.setItem('misiones', JSON.stringify(misiones));
}

function moverMision(i) {
    if (misiones[i].estado === "Pendiente") misiones[i].estado = "En Curso";
    else if (misiones[i].estado === "En Curso") misiones[i].estado = "Completada";
    pintarMisiones();
}

// Dashboard
function actualizarDashboard() {
    const h1s = document.querySelectorAll('section:nth-of-type(4) h1');
    
    h1s[0].textContent = naves.length; // Naves
    h1s[1].textContent = pilotos.length; // Pilotos
    h1s[2].textContent = misiones.length; // Misiones

    // Piloto con más victorias 
    let maxV = -1;
    let nombreP = "Nadie";
    for (let i = 0; i < pilotos.length; i++) {
        if (pilotos[i].victorias > maxV) {
            maxV = pilotos[i].victorias;
            nombreP = pilotos[i].nombre;
        }
    }
    
    console.log("Mejor piloto: " + nombreP); 
}

// Funciones de los botones
const botonesMenu = document.querySelectorAll('.topbar-nav span');
botonesMenu[0].onclick = () => irASeccion(0);
botonesMenu[1].onclick = () => irASeccion(1);
botonesMenu[2].onclick = () => irASeccion(2);
botonesMenu[3].onclick = () => irASeccion(3);

// Buscador del hangar
document.querySelector('.filters input').oninput = pintarHangar;

// Formularios
document.querySelector('section:nth-of-type(2) form').onsubmit = añadirPiloto;
document.querySelector('section:nth-of-type(3) form').onsubmit = crearMision;

// Al arrancar la web:
irASeccion(0);
pintarHangar();
pintarPilotos();
pintarMisiones();