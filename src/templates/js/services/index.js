const MongoService = require('./mongo-service');
const RabbitMqService = require('./rabbitmq-service');

exports.mongo = new MongoService();
exports.rabbitmq = new RabbitMqService();
