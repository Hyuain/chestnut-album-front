declare interface IHttp {
  request: any
  response: any
}

declare interface IPageData<T> {
  page: number
  totalCounts: number
  list: T[]
}

declare interface IPostSignIn extends IHttp {
  request: {
    code: string
  }
}

declare interface IGetPreOssInfo extends IHttp {
  request: {
    filename: string
  }
  response: {
    OSSAccessKeyId: string
    key: string
    policy: string
    signature: string
  }
}

declare interface IPostPhotos extends IHttp {
  request: {
    url: string
  }
}

declare interface IGetPhotos extends IHttp {
  request: {
    page: number
    size?: number
  }
  response: IPageData<IImageItem>
}
