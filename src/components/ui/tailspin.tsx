import { TailSpin } from "react-loader-spinner"

export const MyTailSpin = ({ size }: { size: number }) => {
  return (
    <TailSpin
      visible={true}
      height={size}
      width={size}
      color="#4fa94d"
      ariaLabel="tail-spin-loading"
      radius="1"
      wrapperStyle={{}}
      wrapperClass="" />
  )
}