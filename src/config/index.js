export default {

  /**
   * @description 配置显示在浏览器标签的title
   */
  title: localStorage.loginType=='api'||!localStorage.loginType?'云博科技':'澳博科技',
  /**
   * @description api请求基础路径
   */
  baseUrl: {
    dev: '/api/v2',
    pro: '/api/v2'
  },
  /**
   * @description 默认打开的首页的路由name值，默认为home
   */
  homeName: 'memberSearch',
  /**
   * @description 需要加载的插件
   */
  plugin: {}
}
