import gettext


_default_lang = None
DEFAULT_LANGUAGE = "en"
SUPPORTED_LANGUAGE = ["zh", "en"]


def active_translation(lang: str):
    global _default_lang
    _default_lang = (
        DEFAULT_LANGUAGE if lang not in SUPPORTED_LANGUAGE else lang
    )


def trans(message: str) -> str:
    lang = _default_lang if _default_lang is not None else DEFAULT_LANGUAGE
    return gettext.translation(
        "base", localedir="locales", languages=[lang]
    ).gettext(message)