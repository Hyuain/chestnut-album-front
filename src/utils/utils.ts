import ENVIRONMENT from "../../environments/environment.local"

export const getCompleteImageUrl = (url) => {
  return ENVIRONMENT.OSS_HOST + "/" + url
}
