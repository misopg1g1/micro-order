import callbacks
import config

import kombu.mixins

new_order_email_queue = kombu.Queue('new_order_email', exchange=kombu.Exchange(''), routing_key='new_order_email')


class Worker(kombu.mixins.ConsumerMixin, config.KombuClient):

    def __init__(self):
        super().__init__()

    def get_consumers(self, Consumer, channel):
        return [Consumer([new_order_email_queue], callbacks=[callbacks.send_created_order_notification_email])]
