import Swal from "sweetalert2"

export const questionAlert = ({ text, confirmFunction, cancelFunction }: { text: string, confirmFunction: () => void, cancelFunction: () => void }) => {
  Swal.fire({
    text: `${text}`,
    icon: 'question',
    iconColor: '#3b82f6',
    background: '#0f172a',
    color: '#ffffff',
    showCancelButton: true,
    cancelButtonText: 'No',
    cancelButtonColor: '#ef4444',
    showConfirmButton: true,
    confirmButtonText: 'Yes',
    confirmButtonColor: '#3b82f6'
  }).then((result) => {
    if (result.isConfirmed) {
      confirmFunction()
    } else {
      cancelFunction()
    }
  })
}

export const successAlert = ({ text, successFunction }: { text: string, successFunction: () => void }) => {
  Swal.fire({
    text: `${text}`,
    icon: 'success',
    iconColor: '#22c55e',
    background: '#0f172a',
    color: '#ffffff',
    timer: 3000,
    showConfirmButton: true,
    confirmButtonText: 'Ok',
    confirmButtonColor: '#22c55e'
  }).then(() => {
    successFunction()
  })
}

export const errorAlert = ({ text, errorFunction }: { text: string, errorFunction?: () => void }) => {
  Swal.fire({
    text: `${text}`,
    icon: 'error',
    iconColor: '#ef4444',
    background: '#0f172a',
    color: '#ffffff',
    timer: 3000,
    showConfirmButton: true,
    confirmButtonText: 'Ok',
    confirmButtonColor: '#ef4444'
  }).then(() => {
    if (errorFunction) {
      errorFunction()
    }
  })
}