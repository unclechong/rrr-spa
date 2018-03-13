if (__DEV__) {
    module.exports = require('./conf.dev');
} else {
    module.exports = require('./conf.prod');
}
