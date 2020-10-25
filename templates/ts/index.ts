import 'dotenv/config';

(async(): Promise<void> => {
    try {
        console.log('app start');
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
})();
