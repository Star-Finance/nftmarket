import './profile.stylus'

import { useWeb3React } from '@web3-react/core'
import { Button, Form, Input, message, Spin, Upload } from 'antd'
import classnames from 'classnames'
import copy from 'copy-to-clipboard'
import React, { useEffect, useRef, useState } from 'react'
import { useHistory } from 'react-router-dom'
import Web3Token from 'web3-token'

import Go2Top from '@/app/components/Go2Top'
import Layout from '@/app/components/Layout'
import { userCreate, userInfo, userUpdate, verifyToken } from '@/app/service/nftServer'
import { baseService } from '@/app/utils/config'
import sleep from '@/app/utils/sleep'
import { getRandomNumber } from '@/app/utils/tool'
import Icon from '@/assets/icons'
import { useThemeContext } from '@/theme'

function beforeUpload(file) {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
    if (!isJpgOrPng) {
        message.error('You can only upload JPG/PNG file!')
    }
    const isLt2M = file.size / 1024 / 1024 < 2
    if (!isLt2M) {
        message.error('Image must smaller than 2MB!')
    }
    return isJpgOrPng && isLt2M
}

const getBase64 = (img, callback) => {
    const reader = new FileReader()
    reader.addEventListener('load', () => callback(reader.result))
    reader.readAsDataURL(img)
}

export default (): React.ReactElement => {
    const { account, library } = useWeb3React()
    const history = useHistory()
    const { currentThemeName } = useThemeContext()
    const [banner, setBanner] = useState('')
    const [avatar, setAvatar] = useState(`https://nftbomb.org/metadata/nftbomb-market/avatars/${getRandomNumber()}.jpg`)
    const [nickname, setNickname] = useState('')
    const [description, setDescription] = useState('')
    const [email, setEmail] = useState('')
    const [twitter, setTwitter] = useState('')
    const [blog, setBlog] = useState('')
    const [isAdd, setIsAdd] = useState(true)
    const [avatarLoading, setAvatarLoading] = useState(false)
    const [bannerLoading, setBannerLoading] = useState(false)
    const [submitLoading, setSubmitLoading] = useState(false)
    const [bannerPreview, setBannerPreview] = useState<string>('')
    const [avatarPreview, setAvatarPreview] = useState<string>('')

    const copyText = (text: string | undefined | null): void => {
        if (!text) return
        message.destroy()
        if (copy(text)) {
            message.success(`Copy Success`)
        } else {
            message.error(`Copy Error`)
        }
    }

    const handleAvatarChange = info => {
        if (info.file.status === 'uploading') {
            setAvatar('')
            setAvatarLoading(true)
        }
        if (info.file.status === 'done') {
            setAvatar(info.file.response.data.url)
            setAvatarLoading(false)
            getBase64(info.file.originFileObj, imageUrl => setAvatarPreview(imageUrl))
        }
    }

    const handleBannerChange = async info => {
        if (info.file.status === 'uploading') {
            setBanner('')
            setBannerLoading(true)
        }
        if (info.file.status === 'done') {
            setBanner(info.file.response.data.url)
            setBannerLoading(false)
            getBase64(info.file.originFileObj, imageUrl => setBannerPreview(imageUrl))
        }
    }

    const submit = async (): Promise<void> => {
        setSubmitLoading(true)
        try {
            const token = await Web3Token.sign(msg => library.eth.personal.sign(msg, account), '1d')
            const obj = {
                address: account,
                nick_name: nickname,
                avatar,
                banner,
                twitter,
                description,
                blog
            }
            if (isAdd) {
                await userCreate(obj)
                setIsAdd(false)
            } else {
                await userUpdate(obj, token)
            }
            message.info({
                content: (
                    <div>
                        <Icon name="success" />
                        <div className="text">Save successfully</div>
                    </div>
                ),
                className: 'successMessage',
                style: {
                    marginTop: '20vh'
                }
            })
            setSubmitLoading(false)
            await sleep(3)
            history.go(-1)
        } catch (error) {
            setSubmitLoading(false)
        }
    }

    useEffect(() => {
        const fetch = async (): Promise<void> => {
            if (!account) return
            const info = await userInfo({ address: account })
            if (info.data.data && info.data.data.userInfo) {
                const { userInfo } = info.data.data
                setIsAdd(false)
                setBanner(userInfo.banner)
                setAvatar(userInfo.avatar)
                setNickname(userInfo.nick_name)
                setDescription(userInfo.description)
                setEmail(userInfo.email)
                setTwitter(userInfo.twitter)
                setBlog(userInfo.blog)
            }
        }
        fetch()
    }, [account])

    return (
        <Layout className={classnames('page-profile', currentThemeName)}>
            <div className="content">
                <div className="main">
                    <div className="header">
                        <div className="title">Edit profile</div>
                        <div className="subTitle">You can set your preferred display name, profile URL and manage its personal settings</div>
                    </div>
                    <div className="block">
                        <div className="left">
                            <Form.Item className="item">
                                <div className="title">Profile Banner</div>
                                <div className="upload">
                                    <Upload.Dragger
                                        name="file"
                                        action={`${baseService}/v1/upload`}
                                        showUploadList={false}
                                        onChange={info => handleBannerChange(info)}
                                        beforeUpload={beforeUpload}
                                    >
                                        {banner ? (
                                            <>
                                                <Icon name="plus" className="success" />
                                                <div className="txt success">Click to change picture</div>
                                                <div className="img" style={{ backgroundImage: `url(${bannerPreview || banner})` }} />
                                                <div className="mask success" />
                                            </>
                                        ) : bannerLoading ? (
                                            <Spin />
                                        ) : (
                                            <>
                                                <Icon name="plus" />
                                                <div className="txt">Click to upload picture</div>
                                            </>
                                        )}
                                    </Upload.Dragger>
                                </div>
                                <div className="notice">We recommend an image of at least 1200x400.</div>
                            </Form.Item>
                            <Form.Item className="item">
                                <div className="title">Display name</div>
                                <div className="input">
                                    <Input
                                        value={nickname}
                                        bordered={false}
                                        placeholder={`BoomUser${account ? account.substring(account.length - 4, account.length) : 0}`}
                                        onChange={v => setNickname(v.target.value)}
                                        maxLength={50}
                                    />
                                </div>
                                <div className="length">{nickname ? nickname.length : 0}/50</div>
                            </Form.Item>
                            <Form.Item className="item">
                                <div className="title">Bio</div>
                                <div className="input">
                                    <Input.TextArea
                                        bordered={false}
                                        value={description}
                                        placeholder="Tell the world your story！"
                                        onChange={v => setDescription(v.target.value)}
                                        maxLength={400}
                                    />
                                </div>
                                <div className="length">{description ? description.length : 0}/400</div>
                            </Form.Item>
                            <Form.Item className="item">
                                <div className="title">Email Address</div>
                                <div className="input">
                                    <Input bordered={false} placeholder="Enter email" value={email} onChange={v => setEmail(v.target.value)} />
                                </div>
                            </Form.Item>
                            <div className="item">
                                <div className="title">Links</div>
                                <div className="inputComp">
                                    <Form.Item className="div">
                                        <Icon name="twitter2" />
                                        <Input
                                            bordered={false}
                                            placeholder="Your Twitter Handle"
                                            value={twitter}
                                            onChange={v => setTwitter(v.target.value)}
                                        />
                                    </Form.Item>
                                    <Form.Item className="div">
                                        <Icon name="website" />
                                        <Input
                                            bordered={false}
                                            placeholder="Personal site or portfolio"
                                            value={blog}
                                            onChange={v => setBlog(v.target.value)}
                                        />
                                    </Form.Item>
                                </div>
                            </div>
                            <div className="item">
                                <div className="title">Wallet Address</div>
                                <div className="input">
                                    <div className="account" onClick={() => copyText(account)}>
                                        <div className="text">{account}</div>
                                        <Icon name="copy" />
                                    </div>
                                </div>
                            </div>
                            <Button disabled={!(!avatarLoading && !bannerLoading)} loading={submitLoading} className="btn" onClick={() => submit()}>
                                Save
                            </Button>
                        </div>
                        <div className="right">
                            <Form.Item className="item">
                                <div className="title">Profile Image</div>
                                <div className="upload">
                                    <Upload.Dragger
                                        name="file"
                                        action={`${baseService}/v1/upload`}
                                        showUploadList={false}
                                        onChange={info => handleAvatarChange(info)}
                                        beforeUpload={beforeUpload}
                                    >
                                        {avatar ? (
                                            <>
                                                <Icon name="plus" className="success" />
                                                <div className="txt success">Click to change avatar</div>
                                                <div className="img" style={{ backgroundImage: `url(${avatarPreview || avatar})` }} />
                                                <div className="mask success" />
                                            </>
                                        ) : avatarLoading ? (
                                            <Spin />
                                        ) : (
                                            <Icon name="plus" />
                                        )}
                                    </Upload.Dragger>
                                </div>
                                <div className="notice">We recommend an image of at least 400x400. Gifs work too.</div>
                            </Form.Item>
                        </div>
                    </div>
                </div>
            </div>
            <Go2Top />
        </Layout>
    )
}
