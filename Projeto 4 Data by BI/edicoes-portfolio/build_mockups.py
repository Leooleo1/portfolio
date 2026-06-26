from __future__ import annotations

import sys
from pathlib import Path

from PIL import Image, ImageDraw

sys.path.append(str(Path(__file__).resolve().parents[2] / "tools"))

from portfolio_mockup_utils import (  # noqa: E402
    add_callout_panel_browser,
    add_copy_block,
    ensure_dir,
    load_font,
    make_stage,
    place_browser_frame,
)


ROOT = Path(__file__).resolve().parent.parent
OUT_DIR = Path(__file__).resolve().parent


def open_shot(name: str, crop: tuple[int, int, int, int] | None = None) -> Image.Image:
    image = Image.open(ROOT / name).convert("RGB")
    return image.crop(crop) if crop else image


def export_browser(
    title: str,
    subtitle: str,
    screen_name: str,
    out_name: str,
    crop: tuple[int, int, int, int] | None = None,
) -> None:
    screen = open_shot(screen_name, crop)
    canvas = make_stage(
        (1800, 1320),
        "#eef2f5",
        "#dde3e8",
        [
            ((220, 220), 340, (92, 148, 255, 36)),
            ((1460, 260), 320, (74, 204, 180, 26)),
        ],
    )
    add_copy_block(canvas, title, subtitle, "DATA BY BI", x=140, y=124)
    place_browser_frame(canvas, screen, title, (120, 320), 1560)
    draw = ImageDraw.Draw(canvas)
    font = load_font(18)
    draw.text((140, 1210), "Leitura executiva para demo de produto e tomada de decisao.", font=font, fill=(102, 108, 118))
    canvas.convert("RGB").save(OUT_DIR / out_name, quality=95)


def export_callout() -> None:
    screen = open_shot("Dados2.png", (0, 20, 1145, 629))
    canvas = make_stage(
        (2200, 1560),
        "#eef2f5",
        "#dde3e8",
        [
            ((230, 220), 320, (92, 148, 255, 38)),
            ((1960, 240), 320, (255, 180, 106, 20)),
        ],
    )
    add_copy_block(
        canvas,
        "Leitura territorial em destaque",
        "O zoom editorial explica valor analitico sem depender de legenda externa.",
        "DATA BY BI",
        x=140,
        y=126,
    )
    browser_meta = place_browser_frame(canvas, screen, "Mapa e filtros eleitorais", (110, 360), 1520)
    add_callout_panel_browser(
        canvas,
        screen,
        browser_meta,
        (12, 230, 626, 620),
        (1620, 720, 2160, 1120),
        "Regioes com leitura imediata",
        "Treemap desenhado para transformar dispersao territorial em leitura rapida para coordenacao e estrategia.",
        (92, 148, 255),
    )
    canvas.convert("RGB").save(OUT_DIR / "03-data-regioes-callout.png", quality=95)


def export_hero() -> None:
    overview = open_shot("Dados.png", (0, 20, 1154, 648))
    detail = open_shot("Dados2.png", (0, 20, 1145, 629))
    canvas = make_stage(
        (2300, 1600),
        "#eef2f5",
        "#dde3e8",
        [
            ((230, 220), 360, (92, 148, 255, 40)),
            ((2060, 240), 340, (74, 204, 180, 24)),
            ((1900, 1360), 340, (255, 180, 106, 18)),
        ],
    )
    add_copy_block(
        canvas,
        "BI eleitoral com leitura executiva",
        "Mapas, filtros e tabelas tratados como produto de decisao real, nao print solto.",
        "DATA BY BI",
        x=146,
        y=126,
    )
    place_browser_frame(canvas, overview, "Panorama por localidade", (110, 380), 1340)
    place_browser_frame(canvas, detail, "Corte por cargo e ano", (1360, 560), 830)
    draw = ImageDraw.Draw(canvas)
    quote_font = load_font(22, bold=True)
    body_font = load_font(18)
    draw.text((1460, 380), "Dados densos, leitura limpa.", font=quote_font, fill=(41, 46, 54))
    lines = [
        "A apresentacao ganha valor quando filtros e",
        "mapas parecem ferramenta viva de estrategia.",
    ]
    y = 430
    for line in lines:
        draw.text((1460, y), line, font=body_font, fill=(102, 108, 118))
        y += 28
    canvas.convert("RGB").save(OUT_DIR / "04-data-hero.png", quality=95)


def build_all() -> None:
    ensure_dir(OUT_DIR)
    export_browser(
        "Panorama eleitoral por localidade",
        "Mapa, filtros e totalizadores em moldura de produto real.",
        "Dados.png",
        "01-data-overview-browser.png",
        crop=(0, 20, 1154, 648),
    )
    export_browser(
        "Corte por cargo, ano e partido",
        "Consulta comparativa tratada para parecer ferramenta executiva.",
        "Dados2.png",
        "02-data-cargo-browser.png",
        crop=(0, 20, 1145, 629),
    )
    export_callout()
    export_hero()


if __name__ == "__main__":
    build_all()
