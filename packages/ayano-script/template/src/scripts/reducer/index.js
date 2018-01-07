import { Reducer  } from 'ayano-react';
import user from './user';

const reducer = new Reducer({});
reducer.use('user', user);

export default reducer;
