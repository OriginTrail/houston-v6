const TIMEOUT = 1000; // ms

const get = (data, shouldFail) => {
  return new Promise((res, rej) => {
    setTimeout(() => {
      if (shouldFail) {
        rej(data);
      } else {
        res(data);
      }
    }, TIMEOUT);
  });
};

const post = (data, shouldFail) => {
  return new Promise((res, rej) => {
    setTimeout(() => {
      if (shouldFail) {
        rej(data);
      } else {
        res(data);
      }
    }, TIMEOUT);
  });
};

export default { get, post };
