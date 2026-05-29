class DocumentState:
    name = None

    def submit(self, document):
        raise NotImplementedError

    def verify(self, document):
        raise NotImplementedError

    def reject(self, document):
        raise NotImplementedError

    def revise(self, document):
        raise NotImplementedError
