const page = ({ params }: { params: { id: string } }) => {
  const { id } = params

  return (
    <div>
      Editing post {id}
    </div>
  )
}

export default page