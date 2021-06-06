import * as fs from "fs"
import * as p from "path"
import ENVIRONMENT from "../environments/environment.local"

const rootPath = p.join(__dirname, "../")

const generateProjectConfigJson = () => {
  // 读取 defaultConfig
  const defaultConfigPath = p.join(rootPath, "_project.config.json")
  const defaultConfig = JSON.parse(fs.readFileSync(defaultConfigPath).toString())

  // 修改 config
  defaultConfig.appid = ENVIRONMENT.APP_ID

  // 写入 config
  const configPath = p.join(rootPath, "project.config.json")
  fs.writeFileSync(configPath, JSON.stringify(defaultConfig))
}

generateProjectConfigJson()
