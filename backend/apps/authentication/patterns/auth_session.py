class AuthSession:
    _instance = None

    def __new__(cls, *args, **kwargs):
        if not cls._instance:
            cls._instance = super(AuthSession, cls).__new__(cls, *args, **kwargs)
            cls._instance._current_user = None
        return cls._instance

    def set_session(self, user):
        self._current_user = user

    def get_user(self):
        return self._current_user

    def clear_session(self):
        self._current_user = None