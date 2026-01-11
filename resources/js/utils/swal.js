import Swal from 'sweetalert2';

const brandSwal = Swal.mixin({
    customClass: {
        confirmButton: 'px-6 py-3 rounded-2xl bg-brand-600 text-white font-bold hover:bg-brand-700 transition-all mx-2',
        cancelButton: 'px-6 py-3 rounded-2xl bg-gray-100 text-gray-600 font-bold hover:bg-gray-200 transition-all mx-2',
        popup: 'rounded-[2rem] border-none shadow-2xl dark:bg-gray-900 dark:text-white',
        title: 'text-2xl font-black tracking-tighter text-gray-900 dark:text-white',
        htmlContainer: 'text-gray-500 dark:text-gray-400 font-medium',
    },
    buttonsStyling: false,
});

export const confirmAction = async (title, text, confirmButtonText = 'Yes, proceed') => {
    return brandSwal.fire({
        title,
        text,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText,
        cancelButtonText: 'Cancel',
        reverseButtons: true
    });
};

export const showAlert = (title, text, icon = 'info') => {
    return brandSwal.fire({
        title,
        text,
        icon,
        confirmButtonText: 'Understood'
    });
};

export default brandSwal;
