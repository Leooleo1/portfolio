from __future__ import annotations

import sys
from pathlib import Path

from PIL import Image, ImageDraw

sys.path.append(str(Path(__file__).resolve().parents[2] / "tools"))

from portfolio_mockup_utils import (  # noqa: E402
    add_callout_panel_browser,
    add_callout_panel_phone,
    add_copy_block,
    ensure_dir,
    load_font,
    make_stage,
    place_browser_frame,
    place_phone_frame,
)


ROOT = Path(__file__).resolve().parent.parent
OUT_DIR = Path(__file__).resolve().parent


def open_shot(name: str, crop: tuple[int, int, int, int] | None = None) -> Image.Image:
    image = Image.open(ROOT / name).convert("RGB")
    return image.crop(crop) if crop else image


def export_browser() -> None:
    screen = open_shot("Desktop.png")
    canvas = make_stage(
        (1800, 1320),
        "#f2eee8",
        "#e3ddd6",
        [
            ((220, 220), 340, (214, 148, 120, 28)),
            ((1460, 260), 320, (228, 191, 96, 24)),
        ],
    )
    add_copy_block(
        canvas,
        "Galeria oficial com leitura editorial",
        "A home da galeria foi tratada para parecer produto vivo e nao captura de tela.",
        "CAMPAIGN PHOTOS",
        x=140,
        y=124,
    )
    place_browser_frame(canvas, screen, "Galeria oficial da campanha", (120, 320), 1560)
    draw = ImageDraw.Draw(canvas)
    font = load_font(18)
    draw.text((140, 1210), "Fluxo de busca, acervo e download em apresentacao mais vendavel.", font=font, fill=(102, 108, 118))
    canvas.convert("RGB").save(OUT_DIR / "01-photos-browser-gallery.png", quality=95)


def export_mobile_showcase() -> None:
    screen = open_shot("inicial.png", (0, 0, 359, 620))
    canvas = make_stage(
        (1800, 1320),
        "#f2eee8",
        "#e3ddd6",
        [
            ((220, 220), 320, (214, 148, 120, 26)),
            ((1480, 260), 300, (228, 191, 96, 22)),
        ],
    )
    add_copy_block(
        canvas,
        "Experiencia mobile para acesso rapido",
        "Busca, pessoas e download organizados em uma navegacao que parece produto real.",
        "CAMPAIGN PHOTOS",
        x=140,
        y=124,
    )
    place_phone_frame(canvas, screen, (200, 200), outer_w=560, outer_h=980)
    draw = ImageDraw.Draw(canvas)
    quote_font = load_font(22, bold=True)
    body_font = load_font(18)
    draw.text((760, 540), "Busca, galeria e pessoas em um fluxo so.", font=quote_font, fill=(41, 46, 54))
    lines = [
        "O enquadramento mobile reforca rapidez de acesso",
        "e clareza de acervo para imprensa e equipe.",
    ]
    y = 590
    for line in lines:
        draw.text((760, y), line, font=body_font, fill=(102, 108, 118))
        y += 28
    canvas.convert("RGB").save(OUT_DIR / "02-photos-mobile-showcase.png", quality=95)


def export_mobile_callout() -> None:
    screen = open_shot("inicial.png", (0, 0, 359, 620))
    canvas = make_stage(
        (2200, 1560),
        "#f2eee8",
        "#e3ddd6",
        [
            ((230, 220), 320, (214, 148, 120, 28)),
            ((1960, 240), 320, (228, 191, 96, 20)),
        ],
    )
    add_copy_block(
        canvas,
        "Navegacao e descoberta em destaque",
        "O zoom editorial explica a hierarquia da galeria e o valor da busca por pessoas.",
        "CAMPAIGN PHOTOS",
        x=140,
        y=126,
    )
    phone_meta = place_phone_frame(canvas, screen, (160, 290), outer_w=660, outer_h=1160)
    add_callout_panel_phone(
        canvas,
        screen,
        phone_meta,
        (18, 86, 342, 286),
        (1080, 710, 1630, 1120),
        "Busca e abas com leitura imediata",
        "Componente criado para reduzir friccao entre procura, curadoria e download do material oficial.",
        (214, 148, 120),
    )
    canvas.convert("RGB").save(OUT_DIR / "03-photos-mobile-callout.png", quality=95)


def export_hero() -> None:
    browser = open_shot("Desktop.png")
    mobile = open_shot("inicial.png", (0, 0, 359, 620))
    canvas = make_stage(
        (2300, 1600),
        "#f2eee8",
        "#e3ddd6",
        [
            ((230, 220), 360, (214, 148, 120, 30)),
            ((2060, 240), 340, (228, 191, 96, 24)),
            ((1900, 1360), 340, (191, 144, 88, 18)),
        ],
    )
    add_copy_block(
        canvas,
        "Galeria oficial tratada como produto real",
        "Desktop para exploracao ampla e mobile para acesso rapido, ambos em apresentacao premium.",
        "CAMPAIGN PHOTOS",
        x=146,
        y=126,
    )
    place_browser_frame(canvas, browser, "Galeria oficial da campanha", (100, 420), 1420)
    place_phone_frame(canvas, mobile, (1650, 350), outer_w=620, outer_h=1100)
    draw = ImageDraw.Draw(canvas)
    quote_font = load_font(22, bold=True)
    body_font = load_font(18)
    draw.text((150, 1420), "Acervo com cara de plataforma publicada.", font=quote_font, fill=(41, 46, 54))
    lines = [
        "O material deixa de parecer print de layout",
        "e passa a comunicar produto pronto para uso.",
    ]
    y = 1470
    for line in lines:
        draw.text((150, y), line, font=body_font, fill=(102, 108, 118))
        y += 28
    canvas.convert("RGB").save(OUT_DIR / "04-photos-hero.png", quality=95)


def export_browser_callout() -> None:
    screen = open_shot("Desktop.png")
    canvas = make_stage(
        (2200, 1560),
        "#f2eee8",
        "#e3ddd6",
        [
            ((230, 220), 320, (214, 148, 120, 28)),
            ((1960, 240), 320, (228, 191, 96, 20)),
        ],
    )
    add_copy_block(
        canvas,
        "Hero editorial e CTA em foco",
        "Recorte criado para destacar curadoria visual e download principal da galeria.",
        "CAMPAIGN PHOTOS",
        x=140,
        y=126,
    )
    browser_meta = place_browser_frame(canvas, screen, "Galeria oficial da campanha", (110, 360), 1520)
    add_callout_panel_browser(
        canvas,
        screen,
        browser_meta,
        (80, 161, 783, 622),
        (1620, 710, 2160, 1120),
        "Hero desenhado para conversao",
        "O bloco principal organiza contexto, volume de fotos e CTA em uma leitura que parece produto publicado.",
        (228, 191, 96),
    )
    canvas.convert("RGB").save(OUT_DIR / "05-photos-browser-callout.png", quality=95)


def build_all() -> None:
    ensure_dir(OUT_DIR)
    export_browser()
    export_mobile_showcase()
    export_mobile_callout()
    export_hero()
    export_browser_callout()


if __name__ == "__main__":
    build_all()
