if (__PROD__) {
    module.exports = require('./conf.prod');
} else {
    module.exports = require('./conf.dev');
}
