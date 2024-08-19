import Swal from "sweetalert2";

const Toast = Swal.mixin({
  toast: true,

  // Not sure if I want it dark or bright
  // background: '#0f172a',
  // color: '#ffffff',

  position: 'top-end',
  timer: 2000,
  timerProgressBar: true,
  showConfirmButton: false,
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer
    toast.onmouseleave = Swal.resumeTimer

    toast.addEventListener('click', () => {
      Swal.close()
    })

    const progressBar = toast.querySelector('.swal2-progress-bar') as HTMLElement;
    if (progressBar) {
      progressBar.style.background = '#3b82f6'; // Ustaw kolor progress bara
    }
  }
})

export const successToast = ({ text }: { text: string }) => {
  Toast.fire({
    icon: 'success',
    iconColor: '#22c55e',
    title: `${text}`
  })
}

export const errorToast = ({ text }: { text: string }) => {
  Toast.fire({
    icon: 'error',
    iconColor: '#ef4444',
    title: `${text}`
  })
}