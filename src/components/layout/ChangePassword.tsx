import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../ui/alert-dialog'
import { Button } from '../ui/button'
import { MyTailSpin } from '../ui/tailspin'

const ChangePassword = ({ loading }: { loading: boolean }) => {
  return (
    <>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            className="w-48 flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-slate-100 font-semibold py-2 px-4 rounded-md"
            type="submit"
            disabled={loading}
          >
            {loading ? <MyTailSpin size={25} /> : 'Change password'}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will change your password so make sure to remember new one.
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
