// Taller de simulación de crédito - Parte 1.
// Los datos se conservan en memoria hasta recargar o cerrar la página.
let clientes = [];
let tasaInteres = 15;
let clienteSeleccionado = null;

function ocultarSecciones() {
  document.querySelectorAll("section").forEach(function(seccion) {
    seccion.classList.remove("activa");
  });
}

function mostrarSeccion(id) {
  const seccion = document.getElementById(id);
  if (!seccion || seccion.tagName !== "SECTION") return;
  ocultarSecciones();
  seccion.classList.add("activa");
  if (id === "listaCreditos") pintarCreditos(creditos);
}

function guardarTasa() {
  const texto = recuperaraTexto("tasaInteres").trim();
  const tasa = Number(texto);
  if (texto === "" || !Number.isFinite(tasa) || tasa < 10 || tasa > 20) {
    mostrarTexto("mensajeTasa", "La tasa debe estar entre 10% y 20%");
    return;
  }
  tasaInteres = tasa;
  limpiarResultadoCredito();
  mostrarTexto("mensajeTasa", "Tasa configurada correctamente: " + tasaInteres + "%");
}

function buscarCliente(cedula) {
  return clientes.find(function(cliente) {
    return cliente.cedula === cedula;
  }) || null;
}

function guardarCliente() {
  const cedula = clienteSeleccionado ? clienteSeleccionado.cedula : recuperaraTexto("cedula").trim();
  const nombre = recuperaraTexto("nombre").trim();
  const apellido = recuperaraTexto("apellido").trim();
  const textoIngresos = recuperaraTexto("ingresos").trim();
  const textoEgresos = recuperaraTexto("egresos").trim();
  const ingresos = Number(textoIngresos);
  const egresos = Number(textoEgresos);
  if (!cedula || !nombre || !apellido || !textoIngresos || !textoEgresos) {
    mostrarTexto("mensajeCliente", "Complete todos los campos.");
    return;
  }
  if (!Number.isFinite(ingresos) || !Number.isFinite(egresos) || ingresos < 0 || egresos < 0) {
    mostrarTexto("mensajeCliente", "Ingresos y egresos deben ser números mayores o iguales a cero.");
    return;
  }
  const existente = buscarCliente(cedula);
  if (existente) {
    // La cédula identifica al cliente y nunca se modifica al actualizar.
    existente.nombre = nombre;
    existente.apellido = apellido;
    existente.ingresos = ingresos;
    existente.egresos = egresos;
  } else {
    clientes.push({cedula, nombre, apellido, ingresos, egresos});
  }
  pintarClientes();
  invalidarBusquedaCredito();
  limpiar();
  mostrarTexto("mensajeCliente", existente ? "Cliente actualizado correctamente." : "Cliente registrado correctamente.");
}

function pintarClientes() {
  const tabla = document.getElementById("tablaClientes");
  tabla.replaceChildren();
  clientes.forEach(function(cliente) {
    const fila = document.createElement("tr");
    [cliente.cedula, cliente.nombre, cliente.apellido,
      cliente.ingresos.toFixed(2), cliente.egresos.toFixed(2)].forEach(function(valor) {
      const celda = document.createElement("td");
      // textContent evita interpretar como HTML los datos del formulario.
      celda.textContent = valor;
      fila.appendChild(celda);
    });
    const acciones = document.createElement("td");
    const boton = document.createElement("button");
    boton.textContent = "Actualizar";
    boton.addEventListener("click", function() {
      seleccionarCliente(cliente.cedula);
    });
    acciones.appendChild(boton);
    fila.appendChild(acciones);
    tabla.appendChild(fila);
  });
}

function seleccionarCliente(cedula) {
  const cliente = buscarCliente(cedula);
  if (!cliente) {
    mostrarTexto("mensajeCliente", "Cliente no encontrado.");
    return;
  }
  clienteSeleccionado = cliente;
  ["cedula", "nombre", "apellido", "ingresos", "egresos"].forEach(function(campo) {
    mostrarTextoEnCaja(campo, cliente[campo]);
  });
  document.getElementById("cedula").readOnly = true;
  mostrarTexto("btnGuardarCliente", "Guardar cambios");
  mostrarTexto("mensajeCliente", "Edite los datos y pulse Guardar cambios. La cédula no se modifica.");
}

function limpiar() {
  ["cedula", "nombre", "apellido", "ingresos", "egresos"].forEach(function(campo) {
    mostrarTextoEnCaja(campo, "");
  });
  clienteSeleccionado = null;
  document.getElementById("cedula").readOnly = false;
  mostrarTexto("btnGuardarCliente", "Guardar cliente");
  mostrarTexto("mensajeCliente", "");
}
pintarClientes();


// Parte 2. El cliente del crédito es independiente del cliente en edición.
let clienteCredito = null;

function limpiarResultadoCredito() {
  calculoPendiente = null;
  document.getElementById("btnAsignarCredito").disabled = true;
  mostrarTexto("mensajeAsignacion", "");
  const resultado = document.getElementById("resultadoCredito");
  resultado.replaceChildren();
  resultado.className = "";
}

function invalidarBusquedaCredito() {
  clienteCredito = null;
  document.getElementById("datosClienteCredito").replaceChildren();
  limpiarResultadoCredito();
}

function agregarDatoCredito(contenedor, titulo, valor) {
  const linea = document.createElement("p");
  const etiqueta = document.createElement("strong");
  etiqueta.textContent = titulo + ": ";
  linea.appendChild(etiqueta);
  const texto = document.createElement("span");
  texto.textContent = valor;
  linea.appendChild(texto);
  contenedor.appendChild(linea);
}

function buscarClienteCredito() {
  invalidarBusquedaCredito();
  const cedula = recuperaraTexto("buscarCedulaCredito").trim();
  const contenedor = document.getElementById("datosClienteCredito");
  if (!cedula) {
    contenedor.textContent = "Ingrese una cédula para buscar.";
    return;
  }
  clienteCredito = buscarCliente(cedula);
  if (!clienteCredito) {
    contenedor.textContent = "Cliente no encontrado. Regístrelo en la sección Clientes.";
    return;
  }
  const titulo = document.createElement("h3");
  titulo.textContent = "Datos del cliente";
  contenedor.appendChild(titulo);
  agregarDatoCredito(contenedor, "Cédula", clienteCredito.cedula);
  agregarDatoCredito(contenedor, "Nombre", clienteCredito.nombre);
  agregarDatoCredito(contenedor, "Apellido", clienteCredito.apellido);
  agregarDatoCredito(contenedor, "Ingresos", "$" + clienteCredito.ingresos.toFixed(2));
  agregarDatoCredito(contenedor, "Egresos", "$" + clienteCredito.egresos.toFixed(2));
}

// Funciones puras reutilizables. Tasa anual expresada en porcentaje.
function calcularCapacidadPago(ingresos, egresos) {
  return ingresos - egresos;
}

function calcularTotalPagar(monto, tasa, plazoMeses) {
  return monto * (1 + (tasa / 100) * (plazoMeses / 12));
}

function calcularCuotaMensual(total, plazoMeses) {
  return total / plazoMeses;
}

function evaluarCredito(capacidad, cuota) {
  return capacidad >= cuota;
}

function calcularCredito() {
  limpiarResultadoCredito();
  const resultado = document.getElementById("resultadoCredito");
  const cedula = recuperaraTexto("buscarCedulaCredito").trim();
  if (!clienteCredito || clienteCredito.cedula !== cedula) {
    resultado.textContent = "Busque primero un cliente registrado.";
    return;
  }
  const monto = Number(recuperaraTexto("montoCredito"));
  const plazo = Number(recuperaraTexto("plazoCredito"));
  if (!Number.isFinite(monto) || monto <= 0 || !Number.isSafeInteger(plazo) || plazo <= 0) {
    resultado.textContent = "Ingrese un monto mayor que cero y un plazo entero positivo en meses.";
    return;
  }
  const capacidad = calcularCapacidadPago(clienteCredito.ingresos, clienteCredito.egresos);
  const total = calcularTotalPagar(monto, tasaInteres, plazo);
  const cuota = calcularCuotaMensual(total, plazo);
  if (!Number.isFinite(total) || !Number.isFinite(cuota)) {
    resultado.textContent = "Los valores ingresados exceden el rango de cálculo.";
    return;
  }
  const aprobado = evaluarCredito(capacidad, cuota);
  resultado.className = aprobado ? "aprobado" : "rechazado";
  if (aprobado) {
    // Instantánea de los valores aprobados, validada otra vez al asignar.
    calculoPendiente = {cedula: clienteCredito.cedula,
      nombre: clienteCredito.nombre, apellido: clienteCredito.apellido,
      monto, tasa: tasaInteres, plazo, cuota,
      ingresos: clienteCredito.ingresos, egresos: clienteCredito.egresos};
    document.getElementById("btnAsignarCredito").disabled = false;
  }
  agregarDatoCredito(resultado, "Capacidad de pago mensual", "$" + capacidad.toFixed(2));
  agregarDatoCredito(resultado, "Tasa anual", tasaInteres + "%");
  agregarDatoCredito(resultado, "Total a pagar", "$" + total.toFixed(2));
  agregarDatoCredito(resultado, "Cuota mensual", "$" + cuota.toFixed(2));
  agregarDatoCredito(resultado, "RESULTADO", aprobado ? "APROBADO" : "RECHAZADO");
}


// Parte 3: créditos asignados e historial.
let creditos = [];
let calculoPendiente = null;

function asignarCredito() {
  const calculo = calculoPendiente;
  if (!calculo) {
    mostrarTexto("mensajeAsignacion", "Calcule primero un crédito aprobado.");
    return;
  }
  const cliente = buscarCliente(calculo.cedula);
  if (!cliente || !clienteCredito || clienteCredito.cedula !== calculo.cedula ||
      recuperaraTexto("buscarCedulaCredito").trim() !== calculo.cedula ||
      Number(recuperaraTexto("montoCredito")) !== calculo.monto ||
      Number(recuperaraTexto("plazoCredito")) !== calculo.plazo ||
      tasaInteres !== calculo.tasa || cliente.ingresos !== calculo.ingresos ||
      cliente.egresos !== calculo.egresos || cliente.nombre !== calculo.nombre ||
      cliente.apellido !== calculo.apellido) {
    limpiarResultadoCredito();
    mostrarTexto("mensajeAsignacion", "Los datos cambiaron. Busque al cliente y calcule nuevamente.");
    return;
  }
  creditos.push({
    cedula: calculo.cedula, nombre: calculo.nombre, apellido: calculo.apellido,
    monto: calculo.monto, tasa: calculo.tasa,
    plazo: calculo.plazo, cuota: calculo.cuota
  });
  // Evita registrar dos veces el mismo cálculo por doble clic.
  calculoPendiente = null;
  document.getElementById("btnAsignarCredito").disabled = true;
  pintarCreditos(creditos);
  mostrarTexto("mensajeAsignacion", "Crédito asignado correctamente. Consulte Créditos Registrados.");
}

function buscarCreditos(cedula) {
  return creditos.filter(function(credito) {
    return credito.cedula === cedula;
  });
}

function pintarCreditos(lista) {
  const tabla = document.getElementById("tablaCreditos");
  tabla.replaceChildren();
  lista.forEach(function(credito) {
    const fila = document.createElement("tr");
    [credito.cedula, credito.nombre, credito.apellido,
      "$" + credito.monto.toFixed(2), credito.tasa + "%",
      credito.plazo + " meses", "$" + credito.cuota.toFixed(2)].forEach(function(valor) {
        const celda = document.createElement("td");
        celda.textContent = valor;
        fila.appendChild(celda);
      });
    tabla.appendChild(fila);
  });
  mostrarTexto("mensajeHistorial", lista.length ?
    "Créditos mostrados: " + lista.length : "No hay créditos registrados para esta consulta.");
}

function buscarCreditosCliente() {
  const cedula = recuperaraTexto("buscarCedulaListado").trim();
  pintarCreditos(buscarCreditos(cedula));
  if (!cedula) mostrarTexto("mensajeHistorial", "Ingrese una cédula o pulse Ver todos.");
}
pintarCreditos(creditos);
