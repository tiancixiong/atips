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
        '/java/container/map/java-map-hashmap/',
      ]
    },
    {
      text: 'Java 并发框架',
      children: [
        '/java/concurrent/java-concurrent-overview/',
        '/java/concurrent/java-concurrent-keywords-synchronized/',
        '/java/concurrent/java-concurrent-keywords-volatile/',
        '/java/concurrent/java-concurrent-CAS/',
        '/java/concurrent/java-concurrent-locks/',
        '/java/concurrent/java-concurrent-locks-AQS/',
        '/java/concurrent/java-concurrent-locks-ReentrantLock/',
        '/java/concurrent/java-concurrent-ThreadLocal/',
      ]
    },
    {
      text: 'Java8 特性',
      children: [
        '/java/java1.8/java-8-features-overview/',
        '/java/java1.8/java-8-stream/',
      ]
    },
    {
      text: 'JVM 相关',
      children: [
        '/java/jvm/java-jvm-agent-arthas/',
      ]
    },
  ],
  database: [
    {
      text: 'SQL - MySQL',
      children: [
        '/database/mysql/mysql-commands/',
        '/database/mysql/mysql-master-slave/',
      ]
    },
    {
      text: 'NoSQL - Redis',
      children: [
        '/database/nosql-redis/redis-overview/',
        '/database/nosql-redis/redis-introduce/',
        '/database/nosql-redis/redis-data-types/',
        '/database/nosql-redis/redis-data-types-special/',
      ]
    },
    {
      text: 'NoSQL - MongoDB',
      children: [
        '/database/nosql-mongodb/mongodb-overview/',
        '/database/nosql-mongodb/mongodb-basic/',
      ]
    },
    {
      text: 'NoSQL - Elasticsearch',
      children: [
        '/database/nosql-elasticsearch/elasticsearch-overview/',
        '/database/nosql-elasticsearch/elasticsearch-introduce/',
        '/database/nosql-elasticsearch/elasticsearch-install/',
      ]
    },
  ],
  spring: [
    {
      text: 'spring 基础',
      children: [
        '/spring/spring-framework/',
      ]
    },
  ],
  mq: [
    {
      text: '消息中间件',
      children: [
        '/mq/mq-overview/',
        '/mq/mq-RabbitMQ/',
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
      text: 'Linux',
      children: [
        '/linux/linux-basic/',
      ]
    },
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
    {
      text: '项目管理工具',
      children: [
        '/software/maven/',
      ]
    },
    {
      text: '容器化 - Docker',
      children: [
        '/devops/docker/docker-overview/',
        '/devops/docker/docker-basic/',
        '/devops/docker/docker-deploy-on-Linux/',
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
            text: 'Java进阶 - 并发框架',
            children: [
              {
                text: 'Java 并发知识体系',
                link: '/java/concurrent/java-concurrent-overview/'
              }
            ]
          },
          {
            text: 'Java进阶 - 新版本特性',
            children: [
              {
                text: 'Java 8 特性',
                link: '/java/java1.8/java-8-features-overview/'
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
      {
        text: '数据库', children: [
          {
            text: 'SQL 数据库',
            children: [
              {
                text: 'MySQL 数据库',
                link: '/database/mysql/mysql-commands/'
              }
            ]
          },
          {
            text: 'NoSQL 数据库',
            children: [
              {
                text: 'Redis 数据库',
                link: '/database/nosql-redis/redis-overview/'
              },
              {
                text: 'MongoDB 数据库',
                link: '/database/nosql-mongodb/mongodb-overview/'
              },
              {
                text: 'Elasticsearch',
                link: '/database/nosql-elasticsearch/elasticsearch-overview/'
              },
            ]
          },
        ]
      },
      {
        text: '开发',
        children: [
          {
            text: '高并发架构',
            children: [
              {
                text: '消息队列',
                link: '/mq/mq-overview/'
              },
              {
                text: '搜索引擎',
                link: '/database/nosql-elasticsearch/elasticsearch-overview/'
              },
              {
                text: '缓存',
                link: '/database/nosql-redis/redis-overview/'
              },
              {
                text: '分库分表',
                link: ''
              },
              {
                text: '读写分离',
                link: ''
              },
            ]
          },
          {
            text: '高可用架构',
            children: [
              {
                text: '基于Hystrix',
                link: ''
              },
            ]
          },
          {
            text: '分布式系统',
            children: [
              {
                text: '分布式锁',
                link: ''
              },
              {
                text: '分布式事务',
                link: ''
              },
            ]
          },
          {
            text: '微服务架构',
            children: [
              {
                text: '基于Hystrix',
                link: ''
              },
            ]
          },
        ]
      },
      {
        text: 'Spring',
        children: [
          {
            text: 'Spring 基础', link: '/spring/spring-framework/'
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
                text: 'Linux',
                link: '/linux/linux-basic/'
              },
              {
                text: 'Git',
                link: '/software/vcs/git-commit/'
              },
              {
                text: 'Postman',
                link: '/software/postman/'
              },
              {
                text: 'Maven',
                link: '/software/maven/'
              },
              {
                text: 'Docker',
                link: '/devops/docker/docker-basic/'
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
      '/database/': sidebar.database,
      '/spring/': sidebar.spring,
      '/software/ide/': sidebar.software_ide,
      '/linux/': sidebar.software_other,
      '/software/': sidebar.software_other,
      '/devops/': sidebar.software_other,
      '/mq/': sidebar.mq,
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