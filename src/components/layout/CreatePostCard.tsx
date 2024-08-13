import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';

const CreatePostCard = () => {
  return (
    <div className="min-w-[350px] flex flex-col p-5 rounded-lg w-full gap-5 bg-slate-900 border border-slate-700 shadow-md">
      <h1 className="text-2xl font-semibold self-center">Here you can add a new thread!</h1>
      <div className="flex flex-col gap-4 pb-4 border-b border-slate-700">
        <label htmlFor="title" className="text-slate-200 font-semibold">Title</label>
        <Input
          id="title"
          className="w-full p-2 bg-slate-800 text-slate-100 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="flex flex-col gap-4 pb-4">
        <label htmlFor="content" className="text-slate-200 font-semibold">Content</label>
        <Textarea
          id="content"
          className="w-full p-2 bg-slate-800 text-slate-100 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="flex gap-4 pt-2">
        <Button className="flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-slate-100 font-semibold py-2 px-4 rounded-md">
          Create new post
        </Button>
      </div>
    </div>
  );
}

export default CreatePostCard
