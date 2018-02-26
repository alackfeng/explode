const blacklist = require('metro/src/blacklist');

const config = {
  getBlacklistRE() {
    return blacklist();
  },
};

module.exports = config;
