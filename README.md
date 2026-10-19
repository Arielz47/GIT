# Taller independiente GIT: simulador Parte 3
Abrir index.html. La guía original Ramas está disponible desde el encabezado.
Este proyecto es independiente de CREDITOS-. Incluye las funciones previas necesarias
para registrar clientes y calcular antes de asignar créditos.

## Funciones entregadas
- Asignar Crédito solo se habilita para cálculos aprobados.
- Registro con cédula, nombre, apellido, monto, tasa, plazo y cuota.
- Historial completo y filtro exacto por cédula.
- Cambio de datos invalida el cálculo; doble clic no duplica la asignación.
- Guía Git ampliada a partir del ZIP Ramas.
- Datos en memoria: se borran al recargar o cerrar.

## Fórmulas
El PDF remite a un simulador anterior sin adjuntar sus fórmulas.
Se conserva el supuesto explícito de la Parte 2:
capacidad = ingresos - egresos;
total = monto * (1 + tasaAnual/100 * meses/12);
cuota = total/meses. Se aprueba si cuota <= capacidad.
No es una evaluación bancaria real.

## Prueba y evidencias
Ejecutar node PRUEBAS.cjs para pruebas de lógica con DOM simulado.
Pruebas manuales:
1. Crear Juan Pérez, cédula 0101234567, ingresos 1200, egresos 500.
2. Crear Ana López, cédula 0100000002, ingresos 1500, egresos 600.
3. Tasa 15; buscar Juan; monto 1200, plazo 12: cuota 115, aprobado.
4. Asignar. Recalcular con otro monto y asignar un segundo crédito a Juan.
5. Buscar Ana, calcular 2400 en 12 meses: cuota 230. Asignar.
6. Historial: filtrar Juan; tomar captura. Ver todos; tomar otra captura.
7. Monto 12000 para Juan: cuota 1150, rechazado; no permite asignar.
Las capturas deben corresponder a su ejecución real. No se enviaron mensajes
por WhatsApp: el enunciado no identifica destinatario.
