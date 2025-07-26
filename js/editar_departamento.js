document.addEventListener('DOMContentLoaded', () => {
    const btnEditar = document.getElementById('btn-editar-departamento');
    const modal = document.getElementById('modal-editar-departamento');

    if (btnEditar) {
        btnEditar.addEventListener('click', () => {
            fetch('../pages/componentes/editar_departamento.html')
                .then(res => res.text())
                .then(html => {
                    modal.innerHTML = html;
                    modal.style.display = 'flex';

                    // Cerrar modal
                    document.getElementById('cerrar-modal-editar').onclick = () => {
                        modal.style.display = 'none';
                        modal.innerHTML = '';
                    };
                    modal.onclick = (ev) => {
                        if (ev.target === modal) {
                            modal.style.display = 'none';
                            modal.innerHTML = '';
                        }
                    };

                    // Llenar select de departamentos
                    fetch('https://g1314108f626eb5-undc.adb.sa-saopaulo-1.oraclecloudapps.com/ords/servicio_empleados/gestion_empleados/departamentos/')
                        .then(res => res.json())
                        .then(data => {
                            const select = document.getElementById('department_id_editar');
                            data.items.forEach(dep => {
                                const option = document.createElement('option');
                                option.value = dep.department_id;
                                option.textContent = `${dep.department_id} - ${dep.department_name}`;
                                select.appendChild(option);
                            });
                        });

                    // Llenar select de ubicaciones
                    fetch('https://g1314108f626eb5-undc.adb.sa-saopaulo-1.oraclecloudapps.com/ords/servicio_empleados/gestion_empleados/ubicaciones/')
                        .then(res => res.json())
                        .then(data => {
                            const selectLoc = document.getElementById('location_id_editar');
                            data.items.forEach(loc => {
                                const option = document.createElement('option');
                                option.value = loc.location_id;
                                option.textContent = `${loc.city ?? ''} (${loc.location_id})`;
                                selectLoc.appendChild(option);
                            });
                        });

                    // Al seleccionar un departamento, cargar sus datos
                    modal.addEventListener('change', function handler(e) {
                        if (e.target && e.target.id === 'department_id_editar') {
                            const id = e.target.value;
                            if (!id) return;
                            fetch(`https://g1314108f626eb5-undc.adb.sa-saopaulo-1.oraclecloudapps.com/ords/servicio_empleados/gestion_empleados/departamentos/${id}`)
                                .then(res => res.json())
                                .then(data => {
                                    const dep = data.items[0];
                                    const form = document.getElementById('form-editar-departamento');
                                    form.department_name.value = dep.department_name || '';
                                    form.manager_id.value = dep.manager_id ?? '';
                                    form.location_id.value = dep.location_id ?? '';
                                });
                        }
                    });

                    // Guardar cambios (PUT)
                    modal.addEventListener('submit', function handler(ev) {
                        if (ev.target && ev.target.id === 'form-editar-departamento') {
                            ev.preventDefault();
                            const form = ev.target;
                            const departmentId = document.getElementById('department_id_editar').value;

                            const data = {
                                p_department_name: form.department_name.value,
                                p_manager_id: form.manager_id.value ? Number(form.manager_id.value) : null,
                                p_location_id: form.location_id.value ? Number(form.location_id.value) : null
                            };

                            fetch(`https://g1314108f626eb5-undc.adb.sa-saopaulo-1.oraclecloudapps.com/ords/servicio_empleados/gestion_empleados/departamentos/${departmentId}`, {
                                method: 'PUT',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify(data)
                            })
                                .then(response => {
                                    if (!response.ok) {
                                        return response.json().then(err => { throw err; });
                                    }
                                    return response.text();
                                })
                                .then(() => {
                                    alert('Departamento editado correctamente');
                                    modal.style.display = 'none';
                                    modal.innerHTML = '';
                                    window.location.reload();
                                })
                                .catch(error => {
                                    let msg = 'Error al editar departamento.';
                                    if (error && error.errorMessage) {
                                        msg += '\n' + error.errorMessage;
                                    } else if (error && error.message) {
                                        msg += '\n' + error.message;
                                    }
                                    alert(msg);
                                });
                        }
                    });
                });
        });
    }
});