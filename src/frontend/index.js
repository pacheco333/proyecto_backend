const API_URL = "http://localhost:3000/api";
let personas = [];

// Elementos del DOM
const personaForm = document.getElementById('personaForm');
const tablaPersonasBody = document.getElementById('tablaPersonasBody');
const btnCancelar = document.getElementById('btnCancelar');
const imagenInput = document.getElementById('imagen');
const previewImagen = document.getElementById('previewImagen');

document.addEventListener('DOMContentLoaded', cargarPersonas);
personaForm.addEventListener('submit', manejarSubmit);
btnCancelar.addEventListener('click', limpiarFormulario);
imagenInput.addEventListener('change', manejarImagen);

async function cargarPersonas() {
    try {
        const response = await fetch(`${API_URL}/personas`);
        personas = await response.json();
        console.log(personas); 
        await mostrarPersonas();
    } catch (error) {
        console.error('Error al cargar personas', error);
    }
}

async function mostrarPersonas() {
    // if (!Array.isArray(personas)) {
    //     console.error("Error: 'personas' no es un array válido", personas);
    //     return;
    // }
    tablaPersonasBody.innerHTML = '';

    for (const persona of personas) {
        const tr = document.createElement('tr');

        let imagenHTML = 'sin imagen';
        try {
            const response = await fetch(`${API_URL}/imagenes/obtener/personas/id_persona/${persona.id_persona}`);
            const data = await response.json();
            if (data.imagen) {
                imagenHTML = `<img src="data:image/jpeg;base64,${data.imagen}" style="max-width:100px; max-height:100px;">`;
            }
        } catch (error) {
            console.error('Error al cargar imagen:', error);
        }

        tr.innerHTML = `
            <th style="border: 1px solid #ddd;text-align:center;padding:8px">${persona.id_persona}</th>
            <th style="border: 1px solid #ddd;text-align:center;padding:8px">${persona.nombre}</th>
            <th style="border: 1px solid #ddd;text-align:center;padding:8px">${persona.apellido}</th>
            <th style="border: 1px solid #ddd;text-align:center;padding:8px">${persona.email}</th>
            <th style="border: 1px solid #ddd;text-align:center;padding:8px">${imagenHTML}</th>
            <th style="border: 1px solid #ddd;text-align:center;padding:8px">
                <button onclick="editarPersonas(${persona.id_persona})">Editar</button>
                <button onclick="eliminarPersonas(${persona.id_persona})">Eliminar</button>
            </th>
        `;
        tablaPersonasBody.appendChild(tr);
    }
}

async function manejarSubmit(e) {
    e.preventDefault();

    const persona = {
        id_persona: document.getElementById('id_persona').value || null,
        nombre: document.getElementById('nombre').value,
        apellido: document.getElementById('apellido').value,
        tipo_identificacion: document.getElementById('tipo_identificacion').value,
        nuip: parseInt(document.getElementById('nuip').value),
        email: document.getElementById('email').value,
        clave: document.getElementById('clave').value,
        salario: parseFloat(document.getElementById('salario').value),
        activo: document.getElementById('activo').checked
    };

    try {
        if (persona.id_persona) {
            if (imagenInput.files[0]) {
                const imagenBase64 = await convertirImagenABase64(imagenInput.files[0]);
                await fetch(`${API_URL}/imagenes/subir/personas/id_persona/${persona.id_persona}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ imagen: imagenBase64 })
                });
            }
            await actualizarPersona(persona);
        } else {
            const nuevaPersona = await crearPersona(persona);
            if (imagenInput.files[0]) {
                const imagenBase64 = await convertirImagenABase64(imagenInput.files[0]);
                await fetch(`${API_URL}/imagenes/insertar/personas/id_persona/${nuevaPersona.id}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ imagen: imagenBase64 })
                });
            }
        }
        limpiarFormulario();
        cargarPersonas();
    } catch (error) {
        console.error('Error al guardar persona: ', error);
        alert('Error al guardar datos: ' + error.message);
    }
}

async function crearPersona(persona) {
    const response = await fetch(`${API_URL}/personas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(persona)
    });
    return await response.json();
}

async function actualizarPersona(persona) {
    const response = await fetch(`${API_URL}/personas/${persona.id_persona}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(persona)
    });
    return await response.json();
}

async function eliminarPersonas(id) {
    if (confirm('¿Estás seguro de eliminar a esta persona?')) {
        try {
            await fetch(`${API_URL}/imagenes/eliminar/personas/id_persona/${id}`, {
                method: 'DELETE'
            });
            await fetch(`${API_URL}/personas/${id}`, {
                method: 'DELETE'
            });
            cargarPersonas();
        } catch (error) {
            console.error('Error al eliminar la persona: ', error);
            alert('Error al eliminar la persona: ' + error.message);
        }
    }
}

async function editarPersonas(id) {

    const persona = personas.find(p => p.id_persona === id);
    if (persona) {
        document.getElementById('id_persona').value = persona.id_persona;
        document.getElementById('nombre').value = persona.nombre;
        document.getElementById('apellido').value = persona.apellido;
        document.getElementById('tipo_identificacion').value = persona.tipo_identificacion;
        document.getElementById('nuip').value = persona.nuip;
        document.getElementById('email').value = persona.email;
        document.getElementById('clave').value = '';
        document.getElementById('salario').value = persona.salario;
        document.getElementById('activo').checked = persona.activo;

        try {
            const response = await fetch(`${API_URL}/imagenes/obtener/personas/id_persona/${id}`);
            const data = await response.json();
            if (data.imagen) {
                previewImagen.src = `data:image/jpeg;base64,${data.imagen}`;
                previewImagen.style.display = 'block';
            } else {
                previewImagen.style.display = 'none';
                previewImagen.src = '';
            }
        } catch (error) {
            console.error('Error al cargar la imagen:', error);
            previewImagen.style.display = 'none';
            previewImagen.src = '';
        }
    }
}

function limpiarFormulario() {
    personaForm.reset();
    document.getElementById('id_persona').value = '';
    previewImagen.style.display = 'none';
    previewImagen.src = '';
}

function manejarImagen(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            previewImagen.src = e.target.result;
            previewImagen.style.display = 'block';
        };
        reader.readAsDataURL(file);
    } else {
        previewImagen.style.display = 'none';
        previewImagen.src = '';
    }
}

function convertirImagenABase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const base64 = reader.result.split(',')[1];
            resolve(base64);
        };
        reader.onerror = error => reject(error);
    });
}
