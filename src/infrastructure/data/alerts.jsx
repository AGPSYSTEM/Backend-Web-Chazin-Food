import Swal from 'sweetalert2';

export const showDeleteConfirm = async (
  title,
  text,
  confirmButtonText = 'Sí, eliminar'
) => {
  const result = await Swal.fire({
    title,
    text,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#F05454',
    cancelButtonColor: '#30475E',
    confirmButtonText,
    cancelButtonText: 'Cancelar',
    reverseButtons: true,
    backdrop: true,
    customClass: {
      popup: 'rounded-xl shadow-2xl',
      confirmButton: 'px-6 py-2 rounded-lg font-medium',
      cancelButton: 'px-6 py-2 rounded-lg font-medium'
    }
  });

  return result.isConfirmed;
};

export const showSuccessAlert = (title, text) => {
  return Swal.fire({
    title,
    text,
    icon: 'success',
    confirmButtonColor: '#F05454',
    confirmButtonText: 'Aceptar',
    customClass: {
      popup: 'rounded-xl shadow-2xl',
      confirmButton: 'px-6 py-2 rounded-lg font-medium'
    }
  });
};

export const showErrorAlert = (title, text) => {
  return Swal.fire({
    title,
    text,
    icon: 'error',
    confirmButtonColor: '#F05454',
    confirmButtonText: 'Aceptar',
    customClass: {
      popup: 'rounded-xl shadow-2xl',
      confirmButton: 'px-6 py-2 rounded-lg font-medium'
    }
  });
};

export const showInfoAlert = (title, text) => {
  return Swal.fire({
    title,
    text,
    icon: 'info',
    confirmButtonColor: '#F05454',
    confirmButtonText: 'Aceptar',
    customClass: {
      popup: 'rounded-xl shadow-2xl',
      confirmButton: 'px-6 py-2 rounded-lg font-medium'
    }
  });
};
