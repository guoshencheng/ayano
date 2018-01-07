import readConfig from './readConfig';
import { is, TYPES } from 'ayano-utils';

export default () => {
  const config = readConfig()
  let defineValue = config.defineValue || {};
  if (is(TYPES.Function)(defineValue)) {
    defineValue = defineValue();
  }
  return defineValue || {};
}
