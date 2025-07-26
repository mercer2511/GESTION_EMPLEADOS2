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

                    // Autocompletado de departamentos
                    let departamentos = [];
                    fetch('https://g1314108f626eb5-undc.adb.sa-saopaulo-1.oraclecloudapps.com/ords/servicio_empleados/gestion_empleados/departamentos/')
                        .then(res => res.json())
                        .then(data => {
                            departamentos = data.items;
                        });

                    const searchInput = modal.querySelector('#department_search');
                    const suggestions = modal.querySelector('#department_suggestions');

                    searchInput.addEventListener('input', function () {
                        const value = this.value.trim().toLowerCase();
                        suggestions.innerHTML = '';
                        if (value.length === 0) return;
                        const filtered = departamentos.filter(dep =>
                            dep.department_id.toString().includes(value) ||
                            (dep.department_name && dep.department_name.toLowerCase().includes(value))
                        );
                        filtered.slice(0, 8).forEach(dep => {
                            const li = document.createElement('li');
                            li.textContent = `${dep.department_id} - ${dep.department_name}`;
                            li.dataset.id = dep.department_id;
                            li.classList.add('autocomplete-item');
                            suggestions.appendChild(li);
                        });
                    });

                    suggestions.addEventListener('click', function (e) {
                        if (e.target && e.target.matches('li.autocomplete-item')) {
                            const id = e.target.dataset.id;
                            searchInput.value = e.target.textContent;
                            suggestions.innerHTML = '';
                            // Cargar datos del departamento seleccionado
                            fetch(`https://g1314108f626eb5-undc.adb.sa-saopaulo-1.oraclecloudapps.com/ords/servicio_empleados/gestion_empleados/departamentos/${id}`)
                                .then(res => res.json())
                                .then(data => {
                                    const dep = data.items[0];
                                    const form = document.getElementById('form-editar-departamento');
                                    form.department_name.value = dep.department_name || '';
                                    form.manager_id.value = dep.manager_id ?? '';
                                    form.location_id.value = dep.location_id ?? '';
                                    form.dataset.selectedId = dep.department_id;
                                });
                        }
                    });

                    // Guardar cambios (PUT)
                    modal.addEventListener('submit', function handler(ev) {
                        if (ev.target && ev.target.id === 'form-editar-departamento') {
                            ev.preventDefault();
                            const form = ev.target;
                            const departmentId = form.dataset.selectedId;
                            if (!departmentId) {
                                alert('Seleccione un departamento válido.');
                                return;
                            }
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