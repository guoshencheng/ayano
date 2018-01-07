# Ayano

<img src="./icon.png" alt="" style="width: 80px;">

### About project name

ayano is a character at [《目隐都市的演绎者》](http://bangumi.bilibili.com/anime/197?from=search&seid=13569365465150890532)

### Quik start

```bash
npm install -g ayano
```
```bash
ayano init <name>
cd <name>
npm start
```

### ayano-script

###### start

```bash
ayano-script start //start app with a webpack devServer
```
ayano has inner webpack config file, you can use `--config -c [path]` to use custom config file

###### build

```bash
ayano-script build // build app
```
ayano has inner webpack config file, you can use `--config -c [path]` to use custom config file


###### outputConfig

```bash
ayano-script outputConfig
```
This command will out put innner config file to current dir

###### Proxy

Add proxy settings to `package.json`, about config, to see [webpack devServer proxy](https://webpack.js.org/configuration/dev-server/#devserver-proxy)

### AyanoReact

#### Start

```bash
npm install --save ayano-react
```
#### Features

###### createApp
```javascript
  const options = {
    actions: {}, // redux actions, can be a object or function which is handled by redux-thunk
    reducers: <reducer>, // redux reducers pre reducers or combined reducers,
    history: history, // a history to create router -> default is hashHistory
    routers: [{
      path: '/',
      component: Home,
    }] // a react-router-dom <Route></Route> component props array
  }
  const app = createApp(options);
  app.start(document.querySelector('#root'));
  app._store // store that is created;
  app._history // history that is used;
  app._actions // actions which is bind to dispatch
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
- the `connectApp` will auto merge actions which is defined at createApp options and bind dispatch

###### buildConstants

```javascript
const constants = buildConstants([{
  key: "POSTS",
  values: ["ALL", "CREATE_EMPTY"]
}, {
  key: "POST",
  values: ["SELECT", "UPDATE_VALUE", "FINISH_SAVE_POST", "FINISH_CHANGE_STATUS"]
}], "@manage")

// constants is {
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
// path: a path at apis or custom path
// data : request data
// method: request method
// options: advance options
rq('users').then(...) // it will request to https://xxx.xxx.xx/users
rq('user', { id: 122 }).then(...) // it will request to https://xxx.xxx.xx/user/122
rq('/ayano') // it will request to https://xxx.xxx.xx/ayano because '/ayano' is not at apis

```


### CHANGELOG

#### 20171018

- 在request添加header的定义
