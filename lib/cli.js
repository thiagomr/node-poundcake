const { program } = require('commander');
const fs = require('fs');
const path = require('path');

program
    .storeOptionsAsProperties(false)
    .passCommandToAction(false)
    .requiredOption('-n, --name <dir>', 'project directory')
    .option('--ts', 'typescript files')
    .option('--api', 'express api')
    .option('--mongo', 'mongoose service')
    .option('--rabbitmq', 'rabbitmq service')
    .option('-f, --force', 'remove directory if exists')
    .parse(process.argv);

function loadFiles(path) {
    if (!path) {
        throw new Error('invalid path');
    }

    const files = {};
    const filenames = fs.readdirSync(path);

    for (const filename of filenames) {
        files[filename] = fs.readFileSync(`${path}/${filename}`, 'utf8');
    }

    return files;
}

function createApp(options) {
    try {
        if (options.force) {
            fs.rmdirSync(options.name, { recursive: true });
        }

        if (fs.existsSync(options.name)) {
            throw new Error('directory already exists');
        }

        console.log('[info]', 'build start');

        const baseDir = path.join(__dirname, '..', 'templates/js');
        const baseFiles = loadFiles(`${baseDir}/base`);
        const packageFile = require(`${path.join(__dirname, '..')}/templates/js/base/package.json`);

        packageFile.name = options.name;

        console.log('[info]', 'build base files');

        buildBaseFiles(baseDir, options.name);

        for (const key in baseFiles) {
            fs.writeFileSync(`${options.name}/${key}`, baseFiles[key]);
        }

        if (options.api) {
            console.log('[info]', 'build api files');

            packageFile.dependencies.express = '^4.17.1';
            buildApiFiles(baseDir, options.name);
        }

        if (options.mongo) {
            console.log('[info]', 'build mongo files');

            packageFile.dependencies.mongoose = '^5.10.10';
            buildMongoFiles(baseDir, options.name);
        }

        if (options.rabbitmq) {
            console.log('[info]', 'build rabbitmq files');

            packageFile.dependencies.amqplib = '^0.6.0';
            buildRabbitMqFiles(baseDir, options.name);
        }

        console.log('[info]', 'build services files');
        const servicesIndex = buildServicesIndex(options);

        fs.writeFileSync(`${options.name}/src/services/index.js`, servicesIndex);
        fs.writeFileSync(`${options.name}/package.json`, JSON.stringify(packageFile, undefined, 4));

        console.log('[info]', 'app build successfully');
    } catch (error) {
        console.error(error);
        console.error('[error]', error.message);
    }
}

function buildBaseFiles(baseDir, appname) {
    fs.mkdirSync(appname);
    fs.mkdirSync(`${appname}/src`);
    fs.mkdirSync(`${appname}/src/services`);
    fs.mkdirSync(`${appname}/__tests__`);
    fs.copyFileSync(`${baseDir}/index.js`, `${appname}/src/index.js`);
}

function buildApiFiles(baseDir, appname) {
    fs.mkdirSync(`${appname}/src/app`);
    fs.mkdirSync(`${appname}/src/controllers`);

    fs.copyFileSync(`${baseDir}/app/server.js`, `${appname}/src/app/server.js`);
    fs.copyFileSync(`${baseDir}/app/router.js`, `${appname}/src/app/router.js`);

    fs.copyFileSync(`${baseDir}/controllers/index.js`, `${appname}/src/controllers/index.js`);
    fs.copyFileSync(`${baseDir}/controllers/main-controller.js`, `${appname}/src/controllers/main-controller.js`);
}

function buildMongoFiles(baseDir, appname) {
    fs.mkdirSync(`${appname}/src/models`);
    fs.copyFileSync(`${baseDir}/models/contact.js`, `${appname}/src/models/contact.js`);
    fs.copyFileSync(`${baseDir}/services/mongo.js`, `${appname}/src/services/mongo.js`);
}

function buildRabbitMqFiles(baseDir, appname) {
    fs.mkdirSync(`${appname}/src/subscribers`);
    fs.copyFileSync(`${baseDir}/services/rabbitmq.js`, `${appname}/src/services/rabbitmq.js`);
}

function buildServicesIndex(options) {
    let imports = '';
    let instances = '';

    if (options.mongo) {
        imports += 'const MongoService = require(\'./mongo-service\');\n';
        instances += 'exports.mongoService = new MongoService();\n';
    }

    if (options.rabbitmq) {
        imports += 'const RabbitMqService = require(\'./rabbitmq-service\');\n';
        instances += 'exports.rabbitMqService = new RabbitMqService();\n';
    }

    return `${imports}\n${instances}`;
}

createApp(program.opts());
