import serverlessExpress from '@vendia/serverless-express';

let handlerCache;

export const handler = async (event, context) => {
  if (!handlerCache) {
    const { app } = await import('./dist/ocastelblanco/server/server.mjs');
    handlerCache = serverlessExpress({ app });
  }
  return handlerCache(event, context);
};
