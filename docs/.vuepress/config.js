const sidebar = {
  software_ide: [
    {
      text: 'IDEA',
      children: [
        {
          text: '基础教程',
          children: [
            '/software/ide/idea/basic-course/',
            '/software/ide/idea/basic-course/debug-skills/',
          ]
        },
        {
          text: '实用技巧',
          children: [
            '/software/ide/idea/practical-skills/',
          ]
        },
        {
          text: '疑难杂症',
          children: [
            '/software/ide/idea/difficult-cases/',
          ]
        },
      ]
    }
  ],
  software_other: [
    {
      text: '版本控制',
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
    {
      text: '调试工具',
      children: [
        '/software/postman/',
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
            children: [
              {
                text: 'IDEA',
                link: '/software/ide/idea/basic-course/'
              },
            ]
          },
          {
            text: '其他',
            children: [
              {
                text: 'Git',
                link: '/software/vcs/git-commit/'
              },
              {
                text: 'Postman',
                link: '/software/postman/'
              },
            ]
          }
        ]
      },
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
      '/software/ide/': sidebar.software_ide,
      '/software/': sidebar.software_other,
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