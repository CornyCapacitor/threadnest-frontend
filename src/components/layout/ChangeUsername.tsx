import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../ui/alert-dialog'
import { Button } from '../ui/button'
import { MyTailSpin } from '../ui/tailspin'

const ChangePassword = ({ loading, username }: { loading: boolean, username: string }) => {
  return (
    <>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            className="w-48 flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-slate-100 font-semibold py-2 px-4 rounded-md"
            type="submit"
            disabled={loading}
          >
            {loading ? <MyTailSpin size={25} /> : 'Change Username'}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This change may confuse other users. Are you sure you want to be called <span className="text-blue-500">{username}</span> now?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction type="submit">Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

export default ChangePassword
