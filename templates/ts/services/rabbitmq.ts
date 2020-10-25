import * as AMQP from 'amqplib';

class RabbitMq {
    connection: AMQP.Connection
    channels: Record<string, AMQP.Channel> = {}

    async connect(): Promise<void> {
        this.connection = await AMQP.connect(`amqp://${process.env.RABBITMQ_HOST}`);
        this.connection.on('error', (e) => {
            console.error('rabbitmq connection error', e);
            process.exit(1);
        });

        console.info('rabbitmq connected');
    }

    createChannel(): Promise<AMQP.Channel> {
        return this.connection.createChannel();
    }

    async assertQueue(queue: string, concurrency = 1, config: AMQP.Options.AssertQueue = { durable: true }): Promise<void> {
        console.info('assert queue', queue);

        this.channels[queue] = await this.createChannel();
        this.channels[queue].prefetch(concurrency);

        await this.channels[queue].assertQueue(queue, config);

        this.channels[queue].on('close', () => {
            console.error('channel closed');
            process.exit(1);
        });

        this.channels[queue].on('error', e => {
            console.error('channel error', e);
            process.exit(1);
        });
    }

    consumer(queue: string, callback: { (msg: AMQP.Message): Promise<void> | void }, options: AMQP.Options.Consume = {}): void {
        if (!this.channels[queue]) {
            throw new Error(`channel not exists - ${queue}`);
        }

        console.info('consumer', queue);

        this.channels[queue].consume(queue, callback, options);
    }

    sendMessage(queue: string, message): void {
        this.channels[queue].sendToQueue(queue, Buffer.from(message), { persistent: true });
    }

    ack(queue: string, message: AMQP.Message): void {
        this.channels[queue].ack(message);
    }

    nack(queue: string, message: AMQP.Message): void {
        this.channels[queue].nack(message);
    }
}

export default RabbitMq;
