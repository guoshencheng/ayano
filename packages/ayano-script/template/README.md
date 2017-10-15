# ayano-react

<img style="width:200px;" src="./ayano.png" alt="ayano">


#### 这是一个react项目依赖整合的框架，旨意于整合react日常开发需要的依赖和整个app的框架，让开发上手更加简单，代码更加规范

#### 开始开发

```bash
npm install --save ayano-react
```
#### 功能点

###### createApp
```javascript
  const options = {
    actions: {}, // redux actions, 可以是一个对象，也可以是一个function，处理这个function我们主要依赖[redux-thunk](https://github.com/gaearon/redux-thunk)
    reducers: <reducer>, // redux reducer
    constants: {} // a components object or build with ayano-react/buildConstants
    apis: {}, // 请求路由表
    history: history, // 用于创建router的history，默认是hashHistory
    routers: {
      home: {
        path: '/',
        component: Home,
      },
      a: {
        path: '/a/:id',
        children: {
          a1: {
            path: '/a1',
            component: a1
          }
        }
      }
    }
  }
  const app = createApp(options);
  app.start(document.querySelector('#root'));
  app._store // 创建的store;
  app._history // 正在使用的history;
  app._actions // 被bindActionCreators的actions的集合
  app._apis // 可以直接发送请求的api, 是新建app的时候传入的路由表绑定请求函数之后的函数，可以直接用于发送请求,
  app._routers // 展开后平铺的路由
```

###### connectApp

```javascript

// 普通创建react组件的流程
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
- `connectApp`这个函数会自动把创建app的时候传入的actions绑定过dispatch后的结果代理到当前组件的props中

###### buildConstants

```javascript
const constants = buildConstants([{
  key: "POSTS",
  values: ["ALL", "CREATE_EMPTY"]
}, {
  key: "POST",
  values: ["SELECT", "UPDATE_VALUE", "FINISH_SAVE_POST", "FINISH_CHANGE_STATUS"]
}], "@manage")

// 结果为: {
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

###### request

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

const rq = request(apis);
// @params
// path: 在apis中已经定义好的建值
// data : 请求的数据
// method: 请求的方式
// options: 一些高级的选项
rq.users().then(...) // 这会请求 https://xxx.xxx.xx/users
rq.user({ id: 122 }).then(...) // 这会请求 https://xxx.xxx.xx/user/122
rq.request('/ayano') // 这会请求 https://xxx.xxx.xx/ayano 因为 '/ayano' 没有在apis的建值中

```
###### 注入后的action
以往我们在使用redux-thunk的时候，定义action的时候往往会引入大量额模块，我现在将能从createApp中取得的可能有用的信息，注入到action的参数中
例如：
```javascript
/**
 * [inject data 注入的参数]
 * @params {apis} 绑定ajax后的路由，可以直接发请求
 * @params {routers} 平铺展开的路由，如果在action中需要跳转或者判定路由的话，可以使用
 * @params {constants} 自定义或者使用buildConstants定义的常量, 用于标识action.type或者其他定义,
 * @params {actions} 所有action的集合, 如果还需要dispatch其他的action可以使用
 */
export const xxAciont = () => (dispatch, getState, { apis, routers, constants, actions }) => {
  ...code
}
```

### 其他
- [项目创建工具](../ayano/README.md)
- [项目打包开发工具](../ayano-script/README.md)

### CHANGELOG

##### 2017/09/15
- routers现在修改成了对象的形式，增加routers的可读性

##### 2017/09/13
- 将request注入到actions里面
- 可以统一处理请求错误和返回
- 添加了测试，对一些必要的逻辑进行了测试
