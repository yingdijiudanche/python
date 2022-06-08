## 建议安装如下 vs code 插件

1. WindiCSS IntelliSense
2. Tailwind Twin IntelliSence 实现 stylecompent 使用 twailwind css
3. vscode-styled-components

## 使用

1. yarn

## 基本介绍

1. 开箱即用的`React`管理端
2. 使用 Vite 开发
3. 基本组件使用 Ant-Design
4. 样式管理使用 styled-component + tailwindcss
5. 内置一个文件自动转路由的插件

## QA

1.为什么样式管理有两个？

> styled-component 用于覆盖 Ant-Design 等第三方组件的样式

```js
import { Button } from 'antd'
import styled from 'styled-components'

const StyledBtn = styled(Button)`
  min-width: 30px;
`
```

> tailwindcss 用于完全自定义的组件

```js
import React from 'react'

export default function CustomButton(props) {
  return <div className="text-white hover:text-blue-gray-500">Add</div>
}
```

> 通过 twin.marco 可以实现两者 组合使用

```js
import { Table } from 'antd'
import tw from 'twin.macro'

const StyledTable = styled(Table)`
  ${tw`font-light`}
  & .ant-table-thead > tr > th {
    ${tw`text-blue-500 font-light bg-white`}
  }
  th::before {
    display: none;
  }
`
```

## 文档链接

[Tailwind CSS](https://tailwindcss.com/docs) 文本居中？行高？都在这里

[Windi CSS](https://windicss.org/guide/) 更适合 vite 的 tailwind css 辅助配置

[Ant Design](https://ant.design/components/overview-cn/) 有什么组件可用？

[Styled-Components](https://styled-components.com/docs/advanced) CSS-In-JS 的方式，修改第三方组件样式

[Twin.macro](https://github.com/ben-rogerson/twin.macro#readme) 完全不想写原生 css？twin.macro 让你在 styled-components 里面使用 tailwind css
