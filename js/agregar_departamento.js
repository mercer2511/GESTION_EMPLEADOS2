document.addEventListener('DOMContentLoaded', () => {
    const btnAgregar = document.getElementById('btn-agregar-departamento');
    const modal = document.getElementById('modal-agregar-departamento');

    if (btnAgregar) {
        btnAgregar.addEventListener('click', () => {
            fetch('../pages/componentes/agregar_departamento.html')
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

                    // Llenar select de ubicaciones
                    fetch('https://g1314108f626eb5-undc.adb.sa-saopaulo-1.oraclecloudapps.com/ords/servicio_empleados/gestion_empleados/ubicaciones/')
                        .then(res => res.json())
                        .then(data => {
                            const selectLoc = document.getElementById('location_id');
                            data.items.forEach(loc => {
                                const option = document.createElement('option');
                                option.value = loc.location_id;
                                option.textContent = `${loc.city ?? ''} (${loc.location_id})`;
                                selectLoc.appendChild(option);
                            });
                        });

                    // Guardar nuevo departamento (POST)
                    document.getElementById('form-agregar-departamento').onsubmit = function(ev) {
                        ev.preventDefault();
                        const form = ev.target;
                        const data = {
                            p_department_id: Number(form.department_id.value),
                            p_department_name: form.department_name.value,
                            p_manager_id: form.manager_id.value ? Number(form.manager_id.value) : null,
                            p_location_id: form.location_id.value ? Number(form.location_id.value) : null
                        };

                        fetch('https://g1314108f626eb5-undc.adb.sa-saopaulo-1.oraclecloudapps.com/ords/servicio_empleados/gestion_empleados/departamentos/', {
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
                            alert('Departamento agregado correctamente');
                            modal.style.display = 'none';
                            modal.innerHTML = '';
                            window.location.reload();
                        })
                        .catch(error => {
                            let msg = 'Error al agregar departamento.';
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