class DocumentState:
    name = None

    def handle_upload(self, document):
        raise NotImplementedError

    def handle_verify(self, document):
        raise NotImplementedError

    def handle_reject(self, document, reason):
        raise NotImplementedError

    def handle_revise(self, document):
        raise NotImplementedError
