# DFA Regex Engine

一个基于DFA（确定性有限自动机）的正则表达式引擎，支持TypeScript和现代打包工具。

## 功能特性

- 支持基本的正则表达式操作符：`*`, `+`, `?`, `|`, `.`, `()`
- 可视化NFA和DFA状态图
- 字符串匹配测试
- TypeScript支持
- Webpack打包支持

## 项目结构

```
dfaRegexEngine/
├── src/                    # TypeScript源代码
│   ├── main.ts            # 主入口文件
│   ├── NFA.ts             # NFA实现
│   ├── regex2RPN.ts       # 正则表达式转逆波兰表达式
│   ├── nfaToDotScript.ts  # NFA转DOT脚本
│   ├── dfaToDotScript.ts  # DFA转DOT脚本
│   ├── stateMachine.ts    # 状态机实现
│   ├── types.d.ts         # 类型声明
│   └── index.html         # HTML模板
├── webpack.config.js       # Webpack配置
├── tsconfig.json          # TypeScript配置
├── package.json           # 项目依赖
└── README.md              # 项目说明
```

## 安装依赖

```bash
npm install
```

## 开发命令

```bash
# 开发模式（启动开发服务器）
npm run dev

# 构建开发版本
npm run build:dev

# 构建生产版本
npm run build

# 类型检查
npm run type-check

# 清理构建文件
npm run clean
```

## 使用方法

1. 启动开发服务器：`npm run dev`
2. 在浏览器中打开 `http://localhost:3000`
3. 输入正则表达式和测试字符串
4. 点击按钮查看NFA/DFA图或测试匹配

## 技术栈

- **TypeScript**: 类型安全的JavaScript超集
- **Webpack**: 模块打包工具
- **jQuery**: DOM操作库
- **Viz.js**: 图形可视化库
- **State Machine**: 状态机实现

## 构建输出

构建后的文件将输出到 `dist/` 目录，包括：
- 打包后的JavaScript文件
- HTML文件
- 源码映射文件
- 类型声明文件

## 开发说明

- 所有源代码位于 `src/` 目录
- 使用ES6模块语法进行导入/导出
- 支持TypeScript的类型检查
- 开发模式下支持热重载
