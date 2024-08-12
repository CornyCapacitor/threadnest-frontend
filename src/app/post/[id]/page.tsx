const postPage = ({ params }: { params: { id: string } }) => {
  const { id } = params

  return (
    <main className="flex flex-grow items-center justify-center p-24">
      <h1>Post id: {id}</h1>
    </main>
  )
}

export default postPage
