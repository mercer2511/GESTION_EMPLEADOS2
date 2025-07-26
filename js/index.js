// Navegación a empleados.html y departamentos.html usando JS (opcional, ya que los <a> ya lo hacen)
// Este código solo previene el comportamiento por defecto y navega usando JS

document.addEventListener('DOMContentLoaded', () => {
    const empleadosBtn = document.querySelector('a[href="empleados.html"]');
    const departamentosBtn = document.querySelector('a[href="departamentos.html"]');

    if (empleadosBtn) {
        empleadosBtn.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = 'empleados.html';
        });
    }

    if (departamentosBtn) {
        departamentosBtn.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = 'departamentos.html';
        });
    }
});