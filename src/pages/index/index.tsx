import { Component } from 'react'
import ENVIRONMENT from "environments/environment.local"
import { View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import './index.scss'

export default class Index extends Component {

  componentWillMount () { }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  handleLogin() {
    Taro.login().then((res) => {
      console.log("尝试login")
      console.log(res)
      Taro.request({
        url: "http://localhost:9999/sing_in",
        method: "POST",
        data: {
          code: res.code,
        },
        success: (loginRes) => {
          console.log(loginRes)
          const cookie = loginRes.header["Set-Cookie"]
          Taro.setStorage({
            key: "cookie",
            data: cookie,
          })
        }
      })
    })
  }

  handleTest() {
    console.log(ENVIRONMENT)
    const cookie = Taro.getStorageSync("cookie")
    Taro.request({
      url: "http://localhost:9999/pre_oss_info",
      method: "GET",
      header: {
        cookie,
      },
      success: (loginRes) => {
        console.log(loginRes)
      }
    })
  }

  handleChoose(): void {
    let filePath
    Taro.chooseImage({}).then((res) => {
      filePath = res.tempFilePaths[0]
      return Taro.request({
        url: `http://localhost:9999/pre_oss_info?file_name=${filePath.slice(-20)}`,
        method: "GET",
      })
    }).then((x) => {
      const formData = x.data
      console.log(formData)
      return Taro.uploadFile({
        url: ENVIRONMENT.OSS_HOST,
        filePath: filePath,
        name: "file",
        formData,
      })
    }).then((y) => {
      console.log("xxxxx", y)
    })
  }

  render () {
    return (
      <View className='index'>
        <View>Hello world!</View>
        <View onClick={this.handleLogin}>登录一下下咯</View>
        <View onClick={this.handleTest}>获取图片参数</View>
        <View onClick={this.handleChoose}>选择图片</View>
      </View>
    )
  }
}
