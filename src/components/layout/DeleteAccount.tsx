import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../ui/alert-dialog'
import { Button } from '../ui/button'
import { MyTailSpin } from '../ui/tailspin'

const DeleteAccount = ({ loading, deleteUser }: { loading: boolean, deleteUser: () => void }) => {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-red-600">This action cannot be undone. This will permanently delete your account and remove your data from our servers.</p>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            className="w-48 flex items-center justify-center bg-red-500 hover:bg-red-600 text-slate-100 font-semibold py-2 px-4 rounded-md"
            disabled={loading}
          >
            {loading ? <MyTailSpin size={25} /> : 'Delete account'}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteUser()}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default DeleteAccount
