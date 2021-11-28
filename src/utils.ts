export const optimizeScroll = (callback) => {
  let ticking = false;
  return (event) => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        callback(event);
        ticking = false;
      });
      ticking = true;
    }
  };
};