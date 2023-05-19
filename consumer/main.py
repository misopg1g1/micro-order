import helpers
from worker import Worker

import os
import atexit
from kombu.utils.debug import setup_logging

liveness_probe_file_path = 'liveness_probe'


def remove_liveness_probe_file():
    try:
        os.remove(liveness_probe_file_path)
    except:
        helpers.global_logger.error(f"El archivo {liveness_probe_file_path} no existe")


if __name__ == '__main__':
    setup_logging(loglevel='INFO', loggers=[''])

    worker = Worker()
    try:
        with open(liveness_probe_file_path, 'w') as probe:
            probe.write('alive!!!')
        worker.run()
    except:
        remove_liveness_probe_file()
        worker.connection.close()
atexit.register(remove_liveness_probe_file)
