import { Router} from '../../src/index.js';
import Root from './views/Root';
import UserInfo from './views/UserInfo';

var router = new Router();

router.use('/', Root, { exact: true, name: "root", title: "homepage" });
router.use('/page1/:id/name/:name', UserInfo, { name: 'userInfo', title: () => `guoshencheng`, onMatch(location, history, { actions }) {
  console.log(location, history, actions);
}});

export default router;
