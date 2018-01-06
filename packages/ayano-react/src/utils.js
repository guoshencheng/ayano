export const patchFn = (target, extra) => {
  Object.keys(extra).filter(key => is.fn(extra[key])).forEach(key => {
    const fn = extra[key];
    target[key] = fn.bind(target);
  });
}
