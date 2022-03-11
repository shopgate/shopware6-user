module.exports = {
  /**
   * @param {Error} err
   * @param {string} [importance='high']
   * @returns {Object}
   * */
  decorateError(err, importance = 'high') {
    return {
      err,
      importance,
      extension: '@apite-shopware6-user',
    };
  },
};
