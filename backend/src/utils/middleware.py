from fastapi import Request

from utils.i18n import active_translation


def add_middlewares(app):
    @app.middleware("http")
    async def get_accept_language(request: Request, call_next):
        lang = request.headers.get("accept-language") or ""
        active_translation(lang)
        response = await call_next(request)
        return response