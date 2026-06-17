class ArchiveState:
    name = None

    def archive(self, record):
        raise NotImplementedError

    def restore(self, record):
        raise NotImplementedError

    def delete(self, record):
        raise NotImplementedError
