import serverlessExpress from '@vendia/serverless-express';
import { app } from './dist/ocastelblanco/server/server.mjs';

export const handler = serverlessExpress({ app });
