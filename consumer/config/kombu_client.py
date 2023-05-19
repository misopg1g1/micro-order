import helpers

from .default import AppConfigValues

import os
import socket
import kombu


class KombuClient:

    def __init__(self):
        self.__host = AppConfigValues.RABBIT_HOST
        self.__port = AppConfigValues.RABBIT_PORT if isinstance(AppConfigValues.RABBIT_PORT, int) else \
            int(AppConfigValues.RABBIT_PORT)
        self.__user = AppConfigValues.RABBIT_USER
        self.__password = AppConfigValues.RABBIT_PASSWORD
        self.logger = helpers.global_logger.getChild('rabbitmq_client')
        self.connection = kombu.Connection(f'amqp://{self.__user}:{self.__password}@{self.__host}:{self.__port}//')

    # def drain_events(self):
    #     while True:
    #         try:
    #             self.connection.drain_events(timeout=5)
    #         except socket.timeout:
    #             self.connection.heartbeat_check()
