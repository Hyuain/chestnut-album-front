import { Image } from "@tarojs/components"
import ENVIRONMENT from "../../../environments/environment.local"
import "./my-image.scss"

export interface IMyImageProps {
  src: string
}

const MyImage = (props: IMyImageProps) => {

  return (
    <Image mode='aspectFit' src={ENVIRONMENT.OSS_HOST + "/" + props.src} />
  )
}

export default MyImage
