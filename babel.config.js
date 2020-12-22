// 项目发布阶段用到的 babel 插件
const proPlugins = []
if(process.env.NODE_ENV === 'production') {
  proPlugins.push('transform-remove-console')
}
module.exports = {
  "presets": [
    "@vue/cli-plugin-babel/preset"
  ],
  "plugins": [
    [
      "component",
      {
        "libraryName": "element-ui",
        "styleLibraryName": "theme-chalk"
      }
    ],
    //发布产品时的插件数组
    ...proPlugins,
    '@babel/plugin-syntax-dynamic-import'
  ]
}