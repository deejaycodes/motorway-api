import logger from '../logger';

describe('Logger util', () => {
  it('Should log message without errors', () => {
    logger.info('Logger check');
  });
});
