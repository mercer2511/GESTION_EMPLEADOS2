document.addEventListener('DOMContentLoaded', () => {
    const btnAgregar = document.getElementById('btn-agregar');
    const modal = document.getElementById('modal-agregar-empleado');

    if (btnAgregar) {
        btnAgregar.addEventListener('click', () => {
            fetch('../pages/componentes/agregar_empleado.html')
                .then(res => res.text())
                .then(html => {
                    modal.innerHTML = html;
                    modal.style.display = 'flex';

                    // Cerrar modal
                    document.getElementById('cerrar-modal-agregar').onclick = () => {
                        modal.style.display = 'none';
                        modal.innerHTML = '';
                    };
                    modal.onclick = (ev) => {
                        if (ev.target === modal) {
                            modal.style.display = 'none';
                            modal.innerHTML = '';
                        }
                    };

                    // Llenar selects
                    fetch('https://g1314108f626eb5-undc.adb.sa-saopaulo-1.oraclecloudapps.com/ords/servicio_empleados/gestion_empleados/trabajos/')
                        .then(res => res.json())
                        .then(data => {
                            const selectJob = document.getElementById('job_id');
                            data.items.forEach(job => {
                                const option = document.createElement('option');
                                option.value = job.job_id;
                                option.textContent = job.job_id;
                                selectJob.appendChild(option);
                            });
                        });

                    fetch('https://g1314108f626eb5-undc.adb.sa-saopaulo-1.oraclecloudapps.com/ords/servicio_empleados/gestion_empleados/departamentos/')
                        .then(res => res.json())
                        .then(data => {
                            const selectDept = document.getElementById('department_id');
                            data.items.forEach(dep => {
                                const option = document.createElement('option');
                                option.value = dep.department_id;
                                option.textContent = dep.department_name + ' (' + dep.department_id + ')';
                                selectDept.appendChild(option);
                            });
                        });

                    // Guardar nuevo empleado (POST)
                    document.getElementById('form-agregar-empleado').onsubmit = function(ev) {
                        ev.preventDefault();
                        const form = ev.target;
                        const data = {
                            employee_id: Number(form.employee_id.value),
                            first_name: form.first_name.value,
                            last_name: form.last_name.value,
                            email: form.email.value,
                            phone_number: form.phone_number.value || null,
                            hire_date: form.hire_date.value,
                            job_id: form.job_id.value,
                            salary: form.salary.value ? Number(form.salary.value) : null,
                            commission_pct: form.commission_pct.value ? Number(form.commission_pct.value) : null,
                            manager_id: form.manager_id.value ? Number(form.manager_id.value) : null,
                            department_id: form.department_id.value ? Number(form.department_id.value) : null,
                            bonus: form.bonus.value || null
                        };

                        fetch('https://g1314108f626eb5-undc.adb.sa-saopaulo-1.oraclecloudapps.com/ords/servicio_empleados/gestion_empleados/empleados/', {
                            method: 'POST',
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
                            alert('Empleado agregado correctamente');
                            modal.style.display = 'none';
                            modal.innerHTML = '';
                            window.location.reload();
                        })
                        .catch(error => {
                            let msg = 'Error al agregar empleado.';
                            if (error && error.errorMessage) {
                                msg += '\n' + error.errorMessage;
                            } else if (error && error.message) {
                                msg += '\n' + error.message;
                            }
                            alert(msg);
                        });
                    };
                });
        });
    }
});