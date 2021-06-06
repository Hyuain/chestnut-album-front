import Taro from "@tarojs/taro"
import ENVIRONMENT from "../environments/environment.local"

type Option<T> = Omit<Taro.request.Option<T>, "url" | "data" | "method">

export const get = <T extends IHttp>(url: string, data: T["request"], option: Option<T["request"]> = {}) => {
  return request<T>({ url, data, method: "GET", ...option })
}

export const post = <T extends IHttp>(url: string, data: T["request"], option: Option<T["request"]> = {}) => {
  return request<T>({ url, data, method: "POST", ...option })
}

const request = <T extends IHttp>(option: Taro.request.Option) => {
  const url = ENVIRONMENT.HOST + option.url
  return Taro.request<T["response"], T["request"]>({
    ...option,
    url,
  })
}
