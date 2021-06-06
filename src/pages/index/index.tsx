import { useCallback, useState } from "react"
import { View } from "@tarojs/components"
import Taro from '@tarojs/taro'
import ENVIRONMENT from "../../../environments/environment.local"
import './index.scss'
import { get, post } from "../../../lib/request"
import MyImage from "../../components/my-image/my-image"

const Index = () => {

  const [picList, setPicList] = useState<IImageItem[]>([])

  const handleLogin = useCallback(
    () => {
      Taro.login().then((res) => {
        console.log("尝试login")
        return post<IPostSignIn>("/sing_in", { code: res.code })
      }).then((res) => {
        const cookie = res.header["Set-Cookie"]
        Taro.setStorage({ key: "cookie", data: cookie })
      })
    }, [],
  )

  const handleChoose = useCallback(
    () => {
      let filePath
      let key
      Taro.chooseImage({}).then((res) => {
        filePath = res.tempFilePaths[0]
        return get<IGetPreOssInfo>("/pre_oss_info", { filename: filePath.slice(-20) })
      }).then((res) => {
        const formData = res.data
        key = formData.key
        return Taro.uploadFile({
          url: ENVIRONMENT.OSS_HOST,
          filePath,
          name: "file",
          formData,
        })
      }).then((res) => {
        if (res.statusCode !== 204) { throw new Error("有问题！") }
        return post<IPostPhotos>("/photos", { url: key })
      }).then((res) => {
        console.log(res)
      })
    }, []
  )

  const handleGetPhotos = useCallback(
    () => {
      get<IGetPhotos>("/photos", { page: 1 }).then((res) => {
        console.log(res.data.list)
        setPicList(res.data.list)
      })
    }, []
  )

  return (
    <View className='index'>
      <View>Hello world!</View>
      <View onClick={handleLogin}>登录一下下咯</View>
      <View onClick={handleChoose}>选择图片</View>
      <View onClick={handleGetPhotos}>获取图片列表</View>
      <View>
        {picList?.map((item) => {
          // eslint-disable-next-line react/jsx-key
          return <MyImage src={item.url} />
        })}
      </View>
    </View>
  )
}

export default Index
