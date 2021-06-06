import Taro from "@tarojs/taro"
import ENVIRONMENT from "../environments/environment.local"

type Option<T> = Omit<Taro.request.Option<T>, "url" | "data" | "method">

export const get = <T extends IHttp>(url: string, data: T["request"], option: Option<T["request"]> = {}) => {
  const header = setCookieInHeaders(option.header)
  return request<T>({ url, data, method: "GET", ...option, header })
}

export const post = <T extends IHttp>(url: string, data: T["request"], option: Option<T["request"]> = {}) => {
  const header = setCookieInHeaders(option.header)
  return request<T>({ url, data, method: "POST", ...option, header })
}

const request = async <T extends IHttp>(option: Taro.request.Option) => {
  const url = ENVIRONMENT.HOST + option.url
  try {
    const res = await Taro.request<T["response"], T["request"]>({
      ...option,
      url,
    })
    const {statusCode} = res
    if (statusCode === 401) {
      Taro.showToast({ icon: "none", title: "你还没有登录哦~" })
      throw new Error("unauthorized")
    }
    return res
  } catch (e) {
    throw e
  }
}

const setCookieInHeaders = (header = {}) => {
  return {
    ...header,
    cookie: Taro.getStorageSync("cookie")
  }
}
