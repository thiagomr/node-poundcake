const { program } = require('commander');
const fs = require('fs');
const path = require('path');

program
    .storeOptionsAsProperties(false)
    .passCommandToAction(false)
    .requiredOption('-n, --name <dir>', 'project directory')
    .option('--ts', 'typescript files')
    .option('--api', 'add express api')
    .option('--mongo', 'add mongoose service')
    .option('--rabbitmq', 'add rabbitmq service')
    .option('-f, --force', 'remove directory if exists')
    .parse(process.argv);

const options = program.opts();
const language = options.ts ? 'ts' : 'js';
const baseDir = path.join(__dirname, '..', `templates/${language}`);
const baseFiles = loadFiles(`${baseDir}/base`);
const packageFile = require(`${path.join(__dirname, '..')}/templates/${language}/base/package.json`);

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

        packageFile.name = options.name;

        console.log('[info]', 'build base files');

        buildBaseFiles(baseDir, options.name);

        for (const key in baseFiles) {
            fs.writeFileSync(`${options.name}/${key}`, baseFiles[key]);
        }

        if (options.api) {
            console.log('[info]', 'build api files');

            if (options.ts) {
                packageFile.devDependencies['@types/express'] = '^4.17.8';
            }

            packageFile.dependencies.express = '^4.17.1';
            buildApiFiles(baseDir, options.name);
        }

        if (options.mongo) {
            console.log('[info]', 'build mongo files');

            if (options.ts) {
                packageFile.devDependencies['@types/mongoose'] = '^5.7.36';
            }

            packageFile.dependencies.mongoose = '^5.10.10';
            buildMongoFiles(baseDir, options.name);
        }

        if (options.rabbitmq) {
            console.log('[info]', 'build rabbitmq files');

            if (options.ts) {
                packageFile.devDependencies['@types/amqplib'] = '^0.5.14';
            }

            packageFile.dependencies.amqplib = '^0.6.0';
            buildRabbitMqFiles(baseDir, options.name);
        }

        console.log('[info]', 'build services files');

        fs.writeFileSync(`${options.name}/src/services/index.${language}`, buildServicesIndex(options));
        fs.writeFileSync(`${options.name}/package.json`, JSON.stringify(packageFile, undefined, 4));

        console.log('[info]', 'app build successfully');
    } catch (error) {
        if (error.message !== 'directory already exists') {
            fs.rmdirSync(options.name, { recursive: true });
        }

        console.error(error);
        console.error('[error]', error.message);
    }
}

function buildBaseFiles(baseDir, appname) {
    fs.mkdirSync(appname);
    fs.mkdirSync(`${appname}/src`);
    fs.mkdirSync(`${appname}/src/services`);
    fs.mkdirSync(`${appname}/__tests__`);
    fs.copyFileSync(`${baseDir}/index.${language}`, `${appname}/src/index.${language}`);
}

function buildApiFiles(baseDir, appname) {
    fs.mkdirSync(`${appname}/src/app`);
    fs.mkdirSync(`${appname}/src/controllers`);

    fs.copyFileSync(`${baseDir}/app/server.${language}`, `${appname}/src/app/server.${language}`);
    fs.copyFileSync(`${baseDir}/app/router.${language}`, `${appname}/src/app/router.${language}`);

    fs.copyFileSync(`${baseDir}/controllers/index.${language}`, `${appname}/src/controllers/index.${language}`);
    fs.copyFileSync(`${baseDir}/controllers/main-controller.${language}`, `${appname}/src/controllers/main-controller.${language}`);
}

function buildMongoFiles(baseDir, appname) {
    fs.mkdirSync(`${appname}/src/models`);
    fs.copyFileSync(`${baseDir}/models/contact.${language}`, `${appname}/src/models/contact.${language}`);
    fs.copyFileSync(`${baseDir}/services/mongo.${language}`, `${appname}/src/services/mongo.${language}`);
}

function buildRabbitMqFiles(baseDir, appname) {
    fs.mkdirSync(`${appname}/src/subscribers`);
    fs.copyFileSync(`${baseDir}/services/rabbitmq.${language}`, `${appname}/src/services/rabbitmq.${language}`);
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

createApp(options);
