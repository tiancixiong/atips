const sidebar = {

}

// VuePress配置
module.exports = {
  lang: 'zh-CN',
  title: 'atips',
  description: '整理开发笔记、技巧、文档等',
  head: [['link', { rel: 'icon', href: './images/icons/favicon.ico' }]],
  base: '/atips/', //基础路径
  // markdown拓展
  // markdown: {
  //   lineNumbers: true //显示代码块行号
  // },
  // 主题配置
  themeConfig: {
    // home: '/',
    // logo: '/images/icons/favicon.ico',
    // 导航栏
    navbar: [
      { text: 'Home', link: '/' },
      { text: 'Web', link: '/web/' },
      {
        text: 'IDE',
        children: [
          {
            text: 'IDEA',
            link: '/software/idea/'
          }
        ]
      },
      {
        text: '其他软件',
        children: [
          {
            text: 'Git',
            link: '/software/git/'
          }
        ]
      },
      {
        text: '关于',
        children: [
          {
            text: '仓库',
            link: 'https://github.com/tiancixiong/atips/'
          },
          {
            text: '站长',
            link: '//blog.xiongtianci.com/'
          }
        ]
      }
    ],
    // repo: 'tiancixiong/atips', //仓库URL
    // 侧边栏
    sidebar: 'auto', //自动生成侧栏
    // displayAllHeaders: false,
    // sidebar: [
    //   '/',
    //   '/page-a',
    //   ['/page-b', 'Explicit link text']
    // ],
    lastUpdated: true, //最后更新时间
    lastUpdatedText: '上次更新'
  },
  plugins: [
    [
      '@vuepress/plugin-search',
      {
        locales: {
          '/': {
            placeholder: 'Search',
          },
          '/zh/': {
            placeholder: '搜索',
          },
        },
      },
    ],
  ]
}