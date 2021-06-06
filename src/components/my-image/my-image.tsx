import { Image } from "@tarojs/components"
import "./my-image.scss"
import { getCompleteImageUrl } from "../../utils/utils"

export interface IMyImageProps {
  src: string
}

const MyImage = (props: IMyImageProps) => {

  return (
    <Image mode='aspectFit' src={getCompleteImageUrl(props.src)} />
  )
}

export default MyImage
