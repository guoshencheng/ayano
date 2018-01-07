import { is, TYPES } from 'ayano-utils';

export const patchFn = (target, extra) => {
  Object.keys(extra).filter(key => {
    return is(TYPES.Function)(extra[key])
  }).forEach(key => {
    const fn = extra[key];
    target[key] = fn.bind(target);
  });
}
