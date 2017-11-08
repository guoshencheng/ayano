# Ayano

<img src="./icon.png" alt="" style="width: 80px;" width="80px">

### 关于项目的名称

ayano 是 [《目隐都市的演绎者》](http://bangumi.bilibili.com/anime/197?from=search&seid=13569365465150890532) 中的一个角色，中文名为[文乃](https://baike.baidu.com/item/%E6%A5%AF%E5%B1%B1%E6%96%87%E4%B9%83/7021805?fr=aladdin)

### 快速开始


```bash
npm install -g ayano #安装全局的命令
```
```bash
ayano init <name> #创建项目
cd <name> # 进入目录
npm start # 启动项目
```

整个ayano项目分为三个包，`ayano`是一个全局的依赖，暂时用于创建一个基础的想项目，`ayano-script`处理关于项目脚本的事情，`ayano-react`是用于集成关于react开发用到的一些框架，并做了定制的封装。

### ayano-script

###### start

```bash
ayano-script start // 启动一个webpack服务打包文件并提供webpackDevServer的服务
```
ayano 含有一个内置的 webpack 配置文件，你也可以使用 `--config [path]` 来自定义配置文件

###### build

```bash
ayano-script build // 生产编译文件
```
ayano 含有一个内置的 webpack 配置文件，你也可以使用 `--config [path]` 来自定义配置文件


###### outputConfig

```bash
ayano-script outputConfig
```
这个命令会导出内置的 webpack 配置文件到当前的目录

###### Proxy配置

你可以添加代理的配置到 `package.json`，关于这个配置，可以查看 [webpack代理配置](https://webpack.js.org/configuration/dev-server/#devserver-proxy)

### AyanoReact

#### 安装

```bash
npm install --save ayano-react # 安装 ayano-react依赖
```
#### Features

###### reducer

使用了ayano-react，reducer的结构会有所更改

原来的reducer可能是张这样的

```javascript
export const COMMON_ACTION_TYPE = "COMMON_ACTION_TYPE";
const defaultState = { ... };
export default (state = defaultState, action) => {
  switch (action.type) {
    case COMMON_ACTION_TYPE:
      // TODO: return some thing
    default:
      return state;
  }
}
```
修改之后的reducer会变成这样

```javascript
const defaultState = { ... };
export default {
  defaultState,
  reducers: {
    COMMON_ACTION_TYPE: (state, action) => {
      //TODO: return some thing
    }
    ...
  }
}
```

ayano-react会自动帮你转换成正常的reducer并在创建store的时候使用它，并且会根据这些reducer的key来自动创建这些静态变量，且这些静态变量是唯一的。ayano-react这样的做法默认忽略了一种action.type会被多个reducer接收的问题，作者认为这种问题在平常开发中可能不会太多，如果有这样的需求，可以编写一个函数来处理。具体可以联系[作者](https://www.guoshencheng.com)，或者自己解决。

###### actions

这里的actions指的一般都是使用[redux-thunk](https://github.com/gaearon/redux-thunk)的action，因为直接导致会调用reducer里面函数的action都不用自己定义action，可以直接通过reducerActions来发起。
action的🌰:

```javascript
import { Toast } from 'antd-mobile';
export const fetchRepo = () => ({ apis, actions }, dispatch, getState)=> {
  Toast.loading('加载中...', 0);
  apis.repo().then(data => {
    actions.reducerActions.repo.FINISH_FETCH({ data });
    Toast.success('加载成功', 1);
  });
}
```
我们会看到这个和普通的thunk的action有很大的区别，我会把几个通常被需要的东西传进来:

- apis：我们在createApp的时候会需要传入一个apis，这是关于所有请求的路由信息，在createApp中会被处理成可以直接执行的函数
- actions: 如果这个action会涉及到其他的action，我们可以在这里直接通过调用actions.<field>.<fn>()来执行你的action，可以完全省去dispatch，如果要直接dispatch一个会操作reducer的action，所有reducer的函数都会被放置在reducerActions里面，如同🌰中的一样去调用

后面的两个参数是之前的thunk里面的参数，如果不使用，可以被省略

###### createApp
```javascript
  /**
   * [create app]
   * reducers ayano-react的reducer对象的集合
   * routers ayano-react的router
   * actions ayano-react形式的actions
   * apis 路由设置对象
   * constants 一些自定义的常量，需要使用ayano-react的格式定义
   * auth 请先设置成true， 之后会关闭这个选项
   * customThunk 我们现在使用了内置的thunk，请先设置成true
   * prefix 设置常量的前缀
   */
  const app = createApp({ reducers, routers, actions, apis, constants, auto: true, customThunk: true, prefix: "@ayano-react" });
```

###### connectApp

```javascript
class App extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {
    <div class="app"></div>
  }
}

const mapStateToProps = (state) => {
  return {
    app: state.app
  }
}

connectApp(mapStateToProps)(App)
```
- `connectApp` 会自动把所有的actions代理到当前的props下面，所有的action都已经被绑定了dispatch，可以直接调用

###### buildConstants

```javascript
const constants = buildConstants([{
  key: "POSTS",
  values: ["ALL", "CREATE_EMPTY"]
}, {
  key: "POST",
  values: ["SELECT", "UPDATE_VALUE", "FINISH_SAVE_POST", "FINISH_CHANGE_STATUS"]
}], "@manage")

// 结果为 {
//  POSTS: {
//    ALL: "@manage/POSTS/ALL",
//    CREATE_EMPTY: "@manage/POSTS/CREATE_EMPTY"
//  },
//  POST: {
//    SELECT: "@manage/POST/SELECT"
//    ......
//  }
// }
```

###### api路由设置结构

```javascript

const apis = {
  users: {
    path:'/users',
    method: 'GET'
  },
  user: {
    path: (data) => { return `/user/${data.id}` },// the data is which you pass in
    method: "GET"
  }
  host: 'https://xxx.xxx.xx'
}

```
