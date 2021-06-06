import { useCallback, useState } from "react"
import { Input, View } from "@tarojs/components"
import Taro from '@tarojs/taro'
import { BaseEventOrig } from "@tarojs/components/types/common"
import { InputProps } from "@tarojs/components/types/Input"
import ENVIRONMENT from "../../../environments/environment.local"
import './index.scss'
import { get, post } from "../../../lib/request"
import MyImage from "../../components/my-image/my-image"
import { getCompleteImageUrl } from "../../utils/utils"

const Index = () => {

  const [picList, setPicList] = useState<IImageItem[]>([])
  const [albumNameInput, setAlbumNameInput] = useState<string>("")

  const handleLogin = useCallback(
    () => {
      Taro.login().then((res) => {
        return post<IPostSignIn>("/sing_in", { code: res.code })
      }).then((res) => {
        const cookie = res.header["Set-Cookie"]
        Taro.setStorage({ key: "cookie", data: cookie })
        Taro.showToast({ title: "登陆成功" })
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
        return post<IPostPhotos>("/photos", { url: key, albumId: 1 })
      }).then((res) => {
        console.log(res)
      })
    }, []
  )

  const handleGetPhotos = useCallback(
    () => {
      get<IGetPhotos>("/photos", { albumId: 1, page: 1 }).then((res) => {
        console.log(res.data.list)
        setPicList(res.data.list)
      })
    }, []
  )

  const handlePreviewPhotos = useCallback(
    (current: IImageItem) => {
      Taro.previewImage({
        urls: picList.map((item) => getCompleteImageUrl(item.url)),
        current: getCompleteImageUrl(current.url),
      })
    }, [picList]
  )

  const handleCreateAlbum = useCallback(
    () => {
      post<IPostAlbums>("/albums", { name: albumNameInput }).then((res) => {
        console.log(res)
      })
    }, [albumNameInput]
  )

  const handleInputAlbumName = useCallback(
    (e: BaseEventOrig<InputProps.inputEventDetail>) => {
      const value = e.detail.value
      setAlbumNameInput(value)
    }, []
  )

  const handleBuildRelation = useCallback(
    () => {
      post("/user_album_relations", { album_id: 1, user_id: 1, authority: 1 }).then((res) => {
        console.log(res)
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
          return <View onClick={() => handlePreviewPhotos(item)}><MyImage src={item.url} /></View>
        })}
      </View>
      <Input type='text' placeholder='请输入相簿名' value={albumNameInput} onInput={handleInputAlbumName} />
      <View onClick={handleCreateAlbum}>点击这里新建相簿</View>
      <View onClick={handleBuildRelation}>点击这里建立联系</View>
      <View onClick={() => get("/albums", {}).then((res) => {console.log(res)})}>测试</View>
    </View>
  )
}

export default Index
