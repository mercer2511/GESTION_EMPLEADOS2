document.addEventListener('DOMContentLoaded', () => {
    const btnEditar = document.getElementById('btn-editar');
    const modal = document.getElementById('modal-editar-empleado');

    if (btnEditar) {
        btnEditar.addEventListener('click', () => {
            fetch('../pages/componentes/editar_empleado.html')
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

                    // Llenar select de IDs de empleados
                    fetch('https://g1314108f626eb5-undc.adb.sa-saopaulo-1.oraclecloudapps.com/ords/servicio_empleados/gestion_empleados/empleados/')
                        .then(res => res.json())
                        .then(data => {
                            const select = document.getElementById('employee_id_editar');
                            data.items.forEach(emp => {
                                const option = document.createElement('option');
                                option.value = emp.employee_id;
                                option.textContent = `${emp.employee_id} - ${emp.first_name} ${emp.last_name}`;
                                select.appendChild(option);
                            });
                        });

                    // Llenar trabajos
                    fetch('https://g1314108f626eb5-undc.adb.sa-saopaulo-1.oraclecloudapps.com/ords/servicio_empleados/gestion_empleados/trabajos/')
                        .then(res => res.json())
                        .then(data => {
                            const selectJob = document.getElementById('job_id_editar');
                            data.items.forEach(job => {
                                const option = document.createElement('option');
                                option.value = job.job_id;
                                option.textContent = job.job_id;
                                selectJob.appendChild(option);
                            });
                        });

                    // Llenar departamentos
                    fetch('https://g1314108f626eb5-undc.adb.sa-saopaulo-1.oraclecloudapps.com/ords/servicio_empleados/gestion_empleados/departamentos/')
                        .then(res => res.json())
                        .then(data => {
                            const selectDept = document.getElementById('department_id_editar');
                            data.items.forEach(dep => {
                                const option = document.createElement('option');
                                option.value = dep.department_id;
                                option.textContent = dep.department_name + ' (' + dep.department_id + ')';
                                selectDept.appendChild(option);
                            });
                        });

                    // Al seleccionar un ID, cargar los datos del empleado
                    modal.addEventListener('change', function handler(e) {
                        if (e.target && e.target.id === 'employee_id_editar') {
                            const id = e.target.value;
                            if (!id) return;
                            fetch(`https://g1314108f626eb5-undc.adb.sa-saopaulo-1.oraclecloudapps.com/ords/servicio_empleados/gestion_empleados/empleados/${id}`)
                                .then(res => res.json())
                                .then(data => {
                                    const emp = data.items[0];
                                    const form = document.getElementById('form-editar-empleado');
                                    form.first_name.value = emp.first_name || '';
                                    form.last_name.value = emp.last_name || '';
                                    form.email.value = emp.email || '';
                                    form.phone_number.value = emp.phone_number || '';
                                    form.hire_date.value = emp.hire_date ? emp.hire_date.substring(0, 10) : '';
                                    form.job_id.value = emp.job_id || '';
                                    form.salary.value = emp.salary ?? '';
                                    form.commission_pct.value = emp.commission_pct ?? '';
                                    form.manager_id.value = emp.manager_id ?? '';
                                    form.department_id.value = emp.department_id || '';
                                    form.bonus.value = emp.bonus ?? '';
                                });
                        }
                    });

                    // Guardar cambios (PUT)
                    modal.addEventListener('submit', function handler(ev) {
                        if (ev.target && ev.target.id === 'form-editar-empleado') {
                            ev.preventDefault();
                            const form = ev.target;
                            const employeeId = document.getElementById('employee_id_editar').value;

                            const data = {
                                p_first_name: form.first_name.value,
                                p_last_name: form.last_name.value,
                                p_email: form.email.value,
                                p_phone_number: form.phone_number.value || null,
                                p_hire_date: form.hire_date.value,
                                p_job_id: form.job_id.value,
                                p_salary: form.salary.value ? Number(form.salary.value) : null,
                                p_commission_pct: form.commission_pct.value ? Number(form.commission_pct.value) : null,
                                p_manager_id: form.manager_id.value ? Number(form.manager_id.value) : null,
                                p_department_id: form.department_id.value ? Number(form.department_id.value) : null,
                                p_bonus: form.bonus.value || null
                            };

                            fetch(`https://g1314108f626eb5-undc.adb.sa-saopaulo-1.oraclecloudapps.com/ords/servicio_empleados/gestion_empleados/empleados/${employeeId}`, {
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
                                    alert('Empleado editado correctamente');
                                    modal.style.display = 'none';
                                    modal.innerHTML = '';
                                    window.location.reload();
                                })
                                .catch(error => {
                                    let msg = 'Error al editar empleado.';
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