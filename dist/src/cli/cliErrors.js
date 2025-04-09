export const cliErrors = {
    noConfig: '❌ Please export a config const @ "./fun.config.js"',
    noGenTypesTxt: '❌ Please re download solidfun b/c "/** gen */" was not found in your "dist/types.d.txt" and that is odd',
    wrongEnv: (env) => `❌ Please call with an "env" that is defined @ "./fun.config.js". The env "${env}" did not match any environments set there`
};
