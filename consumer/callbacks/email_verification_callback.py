import helpers


def send_created_order_notification_email(body, message):
    helpers.global_logger.getChild("send_created_order_notification_email").info(body)
    message.ack()


__all__ = ['send_created_order_notification_email']
