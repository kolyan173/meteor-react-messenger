import _ from 'lodash';

export const capitalizeFirstLetter = string => {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export const objectsDiff = (o1, o2) =>
  _.reduce(o1, (result, value, key) => _.isEqual(value, o2[key])
                                        ? result : result.concat(key), []);
