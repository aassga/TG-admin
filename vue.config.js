  const path = require('path')
const resolve = dir => {
  return path.join(__dirname, dir) //所有文件输出的目标路径
}
function getTime(){
  let timestam = new Date().getTime();
  let time = timestam;
  let dateObj = new Date(time),
  Y = dateObj.getFullYear(),
  Mh = dateObj.getMonth() + 1,
  D =  dateObj.getDate(),
  H = dateObj.getHours(),
  M = dateObj.getMinutes(),
  S = dateObj.getSeconds();
  if (Mh > 12) {
    Mh = "01";
  } else if (Mh < 10) {
    Mh = "0" + Mh;
  }
  return  `${Y}-${Mh}-${D}-${H}:${M}:${S}`;
}
const version=getTime()
console.log(version)
// 项目部署基础
// 默认情况下，我们假设你的应用将被部署在域的根目录下,
// 例如：https://www.my-app.com/
// 默认：'/'
// 如果您的应用程序部署在子路径中，则需要在这指定子路径
// 例如：https://www.foobar.com/my-app/
// 需要将它改为'/my-app/'
// iview-admin线上演示打包路径： https://file.iviewui.com/admin-dist/
const BASE_URL = process.env.NODE_ENV === 'production' ? '/' : '/'

module.exports = {
  baseUrl: BASE_URL,
  // publicPath: BASE_URL,
  // 如果你不需要使用eslint，把lintOnSave设为false即可
  lintOnSave: false,
  chainWebpack: config => {
    // config.output.filename('js/[name].js?v=' + version).end()
    // config.output.filename('js/[name].[chunkHash:6].js?v=' + version).end()
    config.output.chunkFilename('js/[name].js?v=' + version).end()
    config.resolve.alias
      .set('@', resolve('src')) // key,value自行定义，比如.set('@@', resolve('src/components'))
      .set('_c', resolve('src/components'))
      .set('vue$', 'vue/dist/vue.esm.js')
    // 统一 iView 标签书写规范，所有标签都可以使用首字母大写的形式，
    config.module.rule('vue')
      .test(/\.vue$/)
      .use('iview-loader')
      .loader('iview-loader')
      .tap(options => {
        // 修改它的选项...
        return {
          prefix: false,
          removeAttributeQuotes: false
        }
      })
      .end()
    config.plugins.delete('prefetch')
  },
  // 设为false打包时不生成.map文件
  productionSourceMap: false,
  // 这里写你调用接口的基础路径，来解决跨域，如果设置了代理，那你本地开发环境的axios的baseUrl要写为 '' ，即空字符串
  devServer: {
    host: '0.0.0.0',
    port: '1043',
    proxy: {
      '/api': {

        // target: 'http://admin.n9963.com',
        // target: 'http://admin168api.ge345.com/', //台北測試站
        // target: 'https://www.ge345.com:8791',
        target: 'https://tpeadminapi.ge345.com',
        // target: 'http://tpeuserzhengbasaiapi.ge345.com',
        // target:'http://admin.c1055.com:801/',//测试801
        changeOrigin: true
      },
      '':{
        target:"http://u7723.com:9000",
        changeOrigin: true
      }
    }
  }
}
