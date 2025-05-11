// ====================== VARIABLES GLOBALES ======================
const API_URL = 'http://localhost:3000/api'; // URL base de la API
let personas = []; // Arreglo donde se almacenan las personas

// ====================== ELEMENTOS DEL DOM ======================
const personaForm = document.getElementById('personaForm');
const tablaPersonasBody = document.getElementById('tablaPersonasBody');
const btnCancelar = document.getElementById('btnCancelar');
const imagenInput = document.getElementById('imagen');
const previewImagen = document.getElementById('previewImagen');

// ====================== EVENTOS ======================
document.addEventListener('DOMContentLoaded', cargarPersonas);
personaForm.addEventListener('submit', manejarSubmit);
btnCancelar.addEventListener('click', limpiarFormulario);
imagenInput.addEventListener('change', manejarImagen);

// ====================== FUNCIONES ======================

// Cargar todas las personas al inicio
async function cargarPersonas() {
  try {
    const response = await fetch(`${API_URL}/personas`);
    personas = await response.json();
    await mostrarPersonas();
  } catch (error) {
    console.error('Error al cargar personas:', error);
  }
}

// Mostrar personas en la tabla
async function mostrarPersonas() {
  tablaPersonasBody.innerHTML = '';
  const template = document.getElementById('template');

  for (const persona of personas) {
    const clone = template.content.cloneNode(true);
    const tds = clone.querySelectorAll('td');

    let imagenHTML = 'Sin imagen';

    try {
      const response = await fetch(`${API_URL}/imagenes/obtener/personas/id_persona/${persona.id_persona}`);
      const data = await response.json();
      if (data.imagen) {
        imagenHTML = `<img src="data:image/jpeg;base64,${data.imagen}" style="max-width: 100px; max-height: 100px;">`;
      }
    } catch (error) {
      console.error('Error al cargar imagen:', error);
    }

    // Llenar los datos en las celdas
    tds[0].textContent = persona.id_persona;
    tds[1].textContent = persona.nombre;
    tds[2].textContent = persona.apellido;
    tds[3].textContent = persona.email;
    tds[4].innerHTML = imagenHTML;

    // Botones
    const btnEditar = clone.querySelector('.btn-editar');
    const btnEliminar = clone.querySelector('.btn-eliminar');

    btnEditar.addEventListener('click', () => editarPersona(persona.id_persona));
    btnEliminar.addEventListener('click', () => eliminarPersona(persona.id_persona));

    tablaPersonasBody.appendChild(clone);
  }
}

// Manejar el envío del formulario
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
      // Editar persona
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
      // Crear nueva persona
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
    console.error('Error al guardar persona:', error);
    alert('Error al guardar los datos: ' + error.message);
  }
}

// Crear nueva persona
async function crearPersona(persona) {
  const response = await fetch(`${API_URL}/personas`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(persona)
  });
  return await response.json();
}

// Actualizar persona
async function actualizarPersona(persona) {
  const response = await fetch(`${API_URL}/personas/${persona.id_persona}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(persona)
  });
  return await response.json();
}

// Eliminar persona
async function eliminarPersona(id) {
  if (confirm('¿Está seguro de eliminar esta persona?')) {
    try {
      await fetch(`${API_URL}/imagenes/eliminar/personas/id_persona/${id}`, { method: 'DELETE' });
      await fetch(`${API_URL}/personas/${id}`, { method: 'DELETE' });
      cargarPersonas();
    } catch (error) {
      console.error('Error al eliminar persona:', error);
      alert('Error al eliminar la persona: ' + error.message);
    }
  }
}

// Editar persona (rellena el formulario con los datos)
async function editarPersona(id) {
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
      console.error('Error al cargar imagen:', error);
      previewImagen.style.display = 'none';
      previewImagen.src = '';
    }
  }
}

// Limpiar formulario
function limpiarFormulario() {
  personaForm.reset();
  document.getElementById('id_persona').value = '';
  previewImagen.style.display = 'none';
  previewImagen.src = '';
}

// Mostrar previsualización de imagen
function manejarImagen(e) {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function () {
      previewImagen.src = reader.result;
      previewImagen.style.display = 'block';
    };
    reader.readAsDataURL(file);
  } else {
    previewImagen.style.display = 'none';
    previewImagen.src = '';
  }
}

// Convertir imagen a base64
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
