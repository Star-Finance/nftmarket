import { message } from 'antd'
import copy from 'copy-to-clipboard'

export default (text: string): void => {
    message.destroy()
    if (copy(text)) {
        message.success(`Copy Success`)
    } else {
        message.error(`Copy fail`)
    }
}
