document.addEventListener('DOMContentLoaded', () => {
    const url = 'https://g1314108f626eb5-undc.adb.sa-saopaulo-1.oraclecloudapps.com/ords/servicio_empleados/gestion_empleados/departamentos/';
    const tbody = document.querySelector('#tabla-departamentos tbody');

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.items && Array.isArray(data.items)) {
                // Ordenar por department_id ascendente
                data.items.sort((a, b) => a.department_id - b.department_id);
                data.items.forEach(dep => {
                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                        <td>${dep.department_id ?? ''}</td>
                        <td>${dep.department_name ?? ''}</td>
                        <td>${dep.manager_id ?? ''}</td>
                        <td>${dep.location_id ?? ''}</td>
                    `;
                    tbody.appendChild(tr);
                });
            } else {
                tbody.innerHTML = '<tr><td colspan="4">No hay departamentos para mostrar.</td></tr>';
            }
        })
        .catch(error => {
            tbody.innerHTML = `<tr><td colspan="4">Error al cargar los departamentos.</td></tr>`;
            console.error('Error al obtener departamentos:', error);
        });
});