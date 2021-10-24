const sidebar = {
  java: [
    {
      text: 'Java 基础',
      children: [
        '/java/basic/java-basic-oop/',
        '/java/basic/java-basic-grammar/',
      ]
    },
    {
      text: 'Java 集合框架',
      children: [
        '/java/container/collection/java-collection-overview/',
        '/java/container/collection/java-collection-arraylist/',
        '/java/container/collection/java-collection-linkedlist/',
        '/java/container/collection/java-collection-stack&queue/',
        '/java/container/collection/java-collection-set/',
      ]
    },
    {
      text: 'JVM 相关',
      children: [
        '/java/jvm/java-jvm-agent-arthas/',
      ]
    },
  ],
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
            '/software/vcs/git-ignore/',
            '/software/vcs/git-flight-rules/',
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
  about: [
    {
      text: '关于',
      children: [
        '/about/about-me/'
      ]
    },
    {
      text: '关于 - 本站点',
      children: [
        '/about/site/site-build/'
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
    // repo: 'tiancixiong/atips', //仓库URL
    // 导航栏
    navbar: [
      { text: 'Home', link: '/' },
      {
        text: 'Java', children: [
          {
            text: 'Java 基础',
            children: [
              {
                text: 'Java 面向对象',
                link: '/java/basic/java-basic-oop/'
              },
              {
                text: 'Java 集合框架',
                link: '/java/container/collection/java-collection-overview/'
              }
            ]
          },
          {
            text: 'Java进阶 - JVM相关',
            children: [
              {
                text: 'Java 调试排错相关',
                link: '/java/jvm/java-jvm-agent-arthas/'
              }
            ]
          },
        ]
      },
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
      { text: '关于', link: '/about/about-me/' }
    ],
    // 侧边栏
    // sidebar: 'auto', //自动生成侧栏
    sidebarDepth: 2, //提取子标题的层级
    // displayAllHeaders: false,
    sidebar: {
      '/java/': sidebar.java,
      '/web/': [
        {
          text: '前端',
          children: ['/web/'],
        },
      ],
      '/software/ide/': sidebar.software_ide,
      '/software/': sidebar.software_other,
      '/about/': sidebar.about
    },
    // 编辑此页
    editLink: true,
    editLinkText: '在 GitHub 上编辑此页',
    docsRepo: 'https://github.com/tiancixiong/atips',
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