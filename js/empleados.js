document.addEventListener('DOMContentLoaded', () => {
    const url = 'https://g1314108f626eb5-undc.adb.sa-saopaulo-1.oraclecloudapps.com/ords/servicio_empleados/gestion_empleados/empleados/';
    const tbody = document.querySelector('#tabla-empleados tbody');

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.items && Array.isArray(data.items)) {
                // Ordenar por employee_id ascendente
                data.items.sort((a, b) => a.employee_id - b.employee_id);
                data.items.forEach(emp => {
                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                        <td>${emp.employee_id ?? ''}</td>
                        <td>${emp.first_name ?? ''}</td>
                        <td>${emp.last_name ?? ''}</td>
                        <td>${emp.email ?? ''}</td>
                        <td>${emp.phone_number ?? ''}</td>
                        <td>${emp.hire_date ? new Date(emp.hire_date).toLocaleDateString() : ''}</td>
                        <td>${emp.job_id ?? ''}</td>
                        <td>${emp.salary ?? ''}</td>
                        <td>${emp.commission_pct ?? ''}</td>
                        <td>${emp.manager_id ?? ''}</td>
                        <td>${emp.department_id ?? ''}</td>
                        <td>${emp.bonus ?? ''}</td>
                    `;
                    tbody.appendChild(tr);
                });
            } else {
                tbody.innerHTML = '<tr><td colspan="12">No hay empleados para mostrar.</td></tr>';
            }
        })
        .catch(error => {
            tbody.innerHTML = `<tr><td colspan="12">Error al cargar los empleados.</td></tr>`;
            console.error('Error al obtener empleados:', error);
        });
});