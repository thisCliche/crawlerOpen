module.exports = {
  lintOnSave: false,
  chainWebpack:config=>{
    //生产环境
    config.when(process.env.NODE_ENV === 'production', config=>{
    //注意main-prod.js是已经存在的文件
      config.entry('app').clear().add('./src/main-prod.js')
      config.set('externals',{
        vue:'Vue',
        'vue-router':'VueRouter',
        axios:'axios',
        lodash:'_',
        nprogress:'NProgress',
      })
      config.plugin('html').tap(args => {
        args[0].isProd = true
        return args
      })
    })
    //开发环境
    config.when(process.env.NODE_ENV === 'development', config=>{
    //注意main-dev.js是已经存在的文件
      config.entry('app').clear().add('./src/main-dev.js')
      config.plugin('html').tap(args => {
        args[0].isProd = false
        return args
      })
    })
  }
}