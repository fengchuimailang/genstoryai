import gettext
import os 
import subprocess


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
        "base", localedir=os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'locales'), languages=[lang]
    ).gettext(message)


def compile_translations():
    locales_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'locales')
    for lang in os.listdir(locales_dir):
        lang_dir = os.path.join(locales_dir, lang)
        if os.path.isdir(lang_dir):
            lc_messages_dir = os.path.join(lang_dir, 'LC_MESSAGES')
            if os.path.isdir(lc_messages_dir):
                po_file = os.path.join(lc_messages_dir, 'base.po')
                mo_file = os.path.join(lc_messages_dir, 'base.mo')
                if os.path.exists(po_file):
                    subprocess.run(['msgfmt', po_file, '-o', mo_file], check=True)
                    print(f"Compiled {po_file} to {mo_file}")