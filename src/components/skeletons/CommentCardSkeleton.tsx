import { Skeleton } from '../ui/skeleton'

const CommentCardSkeleton = () => {
  return (
    <div className="min-w-[350px] flex flex-col p-5 rounded-lg w-full gap-5 bg-slate-900 border border-slate-700 shadow-md">
      <div className="flex gap-2 justify-between pb-2 border-b border-slate-700">
        <div className="flex gap-2 items-center">
          <Skeleton className="w-[30px] h-[30px] rounded-full bg-slate-700" />
          <Skeleton className="w-full h-[20px] bg-slate-700" />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <Skeleton className="w-full h-[20px] bg-slate-700" />
        <Skeleton className="w-full h-[20px] bg-slate-700" />
        <Skeleton className="w-full h-[20px] bg-slate-700" />
      </div>
    </div>
  )
}

export default CommentCardSkeleton
