require('dotenv').config();

(async() => {
    try {
        console.log('app start');
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
})();
