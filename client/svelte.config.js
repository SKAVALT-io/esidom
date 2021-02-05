const sveltePreprocess = require('svelte-preprocess');

module.exports = {
    preprocess: sveltePreprocess({
        defaults: {
            script: 'ts',
            style: 'postcss',
        },
        sass: true,
        typescript: true,
        postcss: true,
    }),
};
