import 'dotenv/config'
import * as joi from 'joi'

interface EnvVars {
    PORT: number
    NODE_ENV: string
    NATS_SERVERS: string[]
    STRIPE_SECRET: string
    SUCCESS_URL: string
    CANCEL_URL: string
    ENDPOINT_SECRET: string
}

// Validar mediante esquema
const envsSchema = joi.object({
    PORT: joi.number().required(),
    NODE_ENV: joi.string().required(),
    NATS_SERVERS: joi.array().items(joi.string()).required(),
    STRIPE_SECRET: joi.string().required(),
    SUCCESS_URL: joi.string().required(),
    CANCEL_URL: joi.string().required(),
    ENDPOINT_SECRET: joi.string().required(),
})
    .unknown(true)

const { error, value } = envsSchema.validate({
    ...process.env,
    NATS_SERVERS: process.env.NATS_SERVERS ? process.env.NATS_SERVERS.split(',') : [],
})
if (error) {
    throw new Error(`Config validation error: ${error.message}`)
}

const envVars: EnvVars = value

export const envs = {
    port: envVars.PORT,
    node_env: envVars.NODE_ENV,
    natsServers: envVars.NATS_SERVERS,
    stripeSecret: envVars.STRIPE_SECRET,
    successUrl: envVars.SUCCESS_URL,
    cancelUrl: envVars.CANCEL_URL,
    endpointSecret: envVars.ENDPOINT_SECRET,
}
