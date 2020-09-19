import Logger from 'logdna';

const API_KEY = process.env['LOG_KEY'];

const logger = Logger.createLogger(API_KEY, {
    app: 'dtu-rm-updates'
});

export default logger;

export const loggerMiddleware = (req, res, next) => {
    if (res.headersSent) {
      logger.info(`${req.method} ${req.url} ${res.statusCode}`);
    } else {
      res.on('finish', function() {
        logger.info(`${req.method} ${req.url} ${res.statusCode}`);
      })
    }
    next();
};