const domain = import.meta.env.VITE_DOMAIN ?? '' // 在.env.development | .env.production

/**下面这个方法 用于mock运行时局域网分享 */
// const domain = `${window.location.origin.split(':')[1]}:4396`//mock 服务
export default {
  ApiDomain: domain,
  /**项目启动目录*/
  // basePath: '/manage',
  basePath: '',
  /**图片上传接口 */
  uploadImgApi: `${domain}/api/back/upload/image`,
  /**使用ddu的开发账号 登陆https://www.iconfont.cn/  管理项目图标 */
  iconfontScriptUrl: '//at.alicdn.com/t/font_2647525_uwbrlsg84eo.js',
}
