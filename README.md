# Article Typesetting Tool (Obsidian Plugin)

Article Typesetting Tool 是一个 Obsidian 桌面插件，用于把当前 Markdown 笔记转换为公众号可粘贴的富文本 HTML。

作者：离歌笑

GitHub 仓库：`Elliotluo/article-typesetter`

## 当前能力

- 读取当前笔记 Markdown 内容
- 按标题/正文/图片样式生成 HTML
- 一键复制富文本（`text/html + text/plain`）
- 支持弹窗工作台预览后再复制
- 支持 Obsidian 本地图片和常规 Markdown 图片

## 安装（手动）

1. 打开你的 Obsidian 仓库目录：`.obsidian/plugins/article-typesetter/`
2. 将本项目的以下文件放入该目录：
   - `manifest.json`
   - `main.js`
   - `styles.css`
   - `versions.json`
3. 重启 Obsidian，在「第三方插件」中启用 `Article Typesetting Tool`

## 使用

1. 打开任意 Markdown 笔记
2. 使用命令面板执行：`复制当前笔记为富文本`
3. 到公众号编辑器粘贴

可选：执行命令 `打开排版工作台`，在弹窗中预览后再复制。

## 设置项

在插件设置中可调整：

- 标题：字号、颜色、对齐、缩进
- 正文：字号、颜色、对齐、缩进
- 图片：宽度、缩进

## 已支持的 Markdown 范围

- 一级标题 `# 标题`
- 普通段落
- 行内粗体、斜体、行内代码
- 标准 Markdown 图片 `![](url)`
- Obsidian wiki 图片 `![[image.png]]`

## 发布说明

本仓库用于发布 Obsidian 社区插件版本。创建 GitHub release 时需要附带：

- `manifest.json`
- `main.js`
- `styles.css`
