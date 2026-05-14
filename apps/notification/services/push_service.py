import logging

logger = logging.getLogger(__name__)


def send(user_id, message, event):
    logger.info('push notification user_id=%s event=%s message=%s', user_id, event, message)
    return True
