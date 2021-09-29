const sidebar = {
  ide: [
    {
      text: 'IDE',
      collapsable: false,
      children: [
        '/software/ide/idea/',
      ]
    }
  ],
  vcs: [
    {
      text: '版本控制',
      collapsable: false,
      children: [
        {
          text: 'Git',
          children: [
            '/software/vcs/git-commit/',
            '/software/vcs/git-branch/',
          ]
        },
      ]
    },
  ],
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
    repo: 'tiancixiong/atips', //仓库URL
    // 导航栏
    navbar: [
      { text: 'Home', link: '/' },
      { text: 'Web', link: '/web/' },
      {
        text: '开发工具',
        children: [
          {
            text: 'IDE',
            link: '/software/ide/idea/'
          }
        ]
      },
      {
        text: '其他',
        children: [
          {
            text: 'VCS',
            link: '/software/vcs/git-commit/'
          }
        ]
      },
      // {
      //   text: '关于',
      //   children: [
      //     {
      //       text: '仓库',
      //       link: 'https://github.com/tiancixiong/atips/'
      //     },
      //     {
      //       text: '站长',
      //       link: '//blog.xiongtianci.com/'
      //     }
      //   ]
      // }
    ],
    // 侧边栏
    // sidebar: 'auto', //自动生成侧栏
    sidebarDepth: 2, //提取子标题的层级
    // displayAllHeaders: false,
    sidebar: {
      collapsable: false,
      '/web/': [
        {
          text: '前端',
          children: ['/web/'],
        },
      ],
      '/software/ide/': sidebar.ide,
      '/software/vcs/': sidebar.vcs,
    },
    // 编辑此页
    editLink: true,
    editLinkText: '在 GitHub 上编辑此页',
    docsBranch: 'master',
    docsDir: 'docs',
    lastUpdated: true, //最后更新时间
    lastUpdatedText: '上次更新',
    contributors: true, //展示贡献者
    contributorsText: '贡献者',
    toggleDarkMode: '切换夜间模式',
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