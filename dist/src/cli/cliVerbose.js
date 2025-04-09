export function cliVerbose() {
    return Boolean(process.argv[4] === '--verbose');
}
