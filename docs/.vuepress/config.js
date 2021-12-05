module.exports = {
  title: "Gganbu",
  description: "Just playing around",
  base: "/gganbu/",
  themeConfig: {
    nav: [
      { text: "首页", link: "/" },
      { text: "文档", link: "/intro/" },
    ],
    sidebar: [
      {
        title: "介绍", // 必要的
        path: "/intro/", // 可选的, 标题的跳转链接，应为绝对路径且必须存在
      },
      {
        title: "快速上手",
        path: "/usage/", // 可选的, 标题的跳转链接，应为绝对路径且必须存在
      },
      {
        title: "Hooks", // 必要的
        path: "/hooks/", // 可选的, 标题的跳转链接，应为绝对路径且必须存在
      },
      {
        title: "中间件", // 必要的
        path: "/middleware/", // 可选的, 标题的跳转链接，应为绝对路径且必须存在
      },
      {
        title: "路由", // 必要的
        path: "/router/", // 可选的, 标题的跳转链接，应为绝对路径且必须存在
      },
    ],
  },
}
