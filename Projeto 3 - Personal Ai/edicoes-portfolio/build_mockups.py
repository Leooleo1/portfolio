from __future__ import annotations

import gc
import sys
from pathlib import Path

from PIL import Image, ImageDraw

sys.path.append(str(Path(__file__).resolve().parents[2] / "tools"))

from portfolio_mockup_utils import (  # noqa: E402
    add_callout_panel_phone,
    add_copy_block,
    draw_guest_avatar,
    ensure_dir,
    load_font,
    make_stage,
    place_phone_frame,
)


ROOT = Path(__file__).resolve().parent.parent
OUT_DIR = Path(__file__).resolve().parent


def shot_crop(name: str) -> tuple[int, int, int, int]:
    if name.startswith("Pagina inicial"):
        return (0, 0, 591, 1068)
    if "Responsabilidade" in name:
        return (0, 0, 591, 1072)
    return (0, 0, 591, 1088)


def open_shot(name: str, crop: tuple[int, int, int, int] | None = None) -> Image.Image:
    image = Image.open(ROOT / name).convert("RGB")
    image = image.crop(crop) if crop else image
    image = anonymize_candidate_header(image)
    if "Responsabilidade" in name:
        image = anonymize_responsibility_modal(image)
    return image


def anonymize_candidate_header(image: Image.Image) -> Image.Image:
    screen = image.copy()
    draw = ImageDraw.Draw(screen)
    body_font = load_font(15, bold=True)

    draw.ellipse((11, 83, 85, 157), fill=(255, 255, 255), outline=(213, 120, 71), width=3)
    draw_guest_avatar(draw, (48, 120), 28, bg=(170, 176, 188), fg=(255, 255, 255))
    draw.rounded_rectangle((88, 114, 248, 146), radius=10, fill=(13, 18, 46))
    draw.text((92, 119), "Seu candidato", font=body_font, fill=(203, 209, 222))
    return screen


def anonymize_responsibility_modal(image: Image.Image) -> Image.Image:
    screen = image.copy()
    draw = ImageDraw.Draw(screen)
    text_font = load_font(18, bold=True)

    draw.rectangle((34, 385, 320, 426), fill=(22, 28, 64))
    draw.text((39, 389), "do seu candidato.", font=text_font, fill=(244, 246, 250))
    return screen


def export_single(title: str, subtitle: str, screen_name: str, out_name: str) -> None:
    screen = open_shot(screen_name, shot_crop(screen_name))
    canvas = make_stage(
        (1520, 1640),
        "#efedf8",
        "#dfdde9",
        [((220, 220), 320, (128, 104, 255, 44)), ((1260, 260), 280, (72, 190, 255, 28))],
    )
    add_copy_block(canvas, title, subtitle, "PERSONAL AI", x=120, y=98)
    place_phone_frame(canvas, screen, (480, 300), outer_w=560, outer_h=1156)
    draw = ImageDraw.Draw(canvas)
    font = load_font(18)
    draw.text(
        (120, 1488),
        "Tratamento mobile para parecer produto real, nao demo solta.",
        font=font,
        fill=(102, 108, 118),
    )
    canvas.convert("RGB").save(OUT_DIR / out_name, quality=95)


def export_thumb() -> None:
    home = open_shot("Pagina inicial Ai.jpg", shot_crop("Pagina inicial Ai.jpg"))
    actions = open_shot("Opçoes que ela fornece.jpg", shot_crop("Opçoes que ela fornece.jpg"))
    canvas = make_stage(
        (1400, 980),
        "#10142a",
        "#0c1125",
        [
            ((180, 180), 260, (135, 104, 255, 44)),
            ((1210, 180), 220, (72, 190, 255, 34)),
            ((1120, 860), 260, (104, 78, 255, 28)),
        ],
    )
    draw = ImageDraw.Draw(canvas)
    from portfolio_mockup_utils import draw_label  # noqa: E402

    draw_label(draw, 70, 64, "PERSONAL AI")
    place_phone_frame(canvas, home, (94, 190), outer_w=380, outer_h=784)
    place_phone_frame(canvas, actions, (720, 152), outer_w=470, outer_h=970)
    title_font = load_font(30, bold=True)
    body_font = load_font(17)
    draw.text((70, 856), "Assistente editorial com clareza, risco e proximo passo.", font=title_font, fill=(241, 244, 250))
    draw.text((70, 904), "Preview para card do portfolio.", font=body_font, fill=(136, 144, 164))
    canvas.convert("RGB").save(OUT_DIR / "04-personal-ai-thumb.png", quality=95)


def export_hero() -> None:
    home = open_shot("Pagina inicial Ai.jpg", shot_crop("Pagina inicial Ai.jpg"))
    resp = open_shot("Responsabilidade da ai.jpg", shot_crop("Responsabilidade da ai.jpg"))
    canvas = make_stage(
        (1920, 1400),
        "#efedf8",
        "#dfdde9",
        [
            ((230, 220), 340, (128, 104, 255, 46)),
            ((1710, 240), 320, (72, 190, 255, 30)),
            ((1560, 1180), 320, (92, 78, 255, 24)),
        ],
    )
    add_copy_block(
        canvas,
        "Assistencia editorial com responsabilidade embutida",
        "Home do assistente, acoes guiadas e mensagem de responsabilidade tratadas como produto premium.",
        "PERSONAL AI",
        x=120,
        y=104,
    )
    place_phone_frame(canvas, home, (140, 430), outer_w=360, outer_h=742)
    place_phone_frame(canvas, resp, (540, 290), outer_w=430, outer_h=888)
    draw = ImageDraw.Draw(canvas)
    quote_font = load_font(22, bold=True)
    body_font = load_font(18)
    draw.text((1260, 610), "Tom, seguranca e decisao em um fluxo unico.", font=quote_font, fill=(41, 46, 54))
    lines = [
        "A IA ganha cara de produto quando a interface",
        "mostra criterio, contexto e responsabilidade de uso.",
    ]
    y = 660
    for line in lines:
        draw.text((1260, y), line, font=body_font, fill=(102, 108, 118))
        y += 28
    canvas.convert("RGB").save(OUT_DIR / "05-personal-ai-hero.png", quality=95)


def export_callout_actions() -> None:
    actions = open_shot("Opçoes que ela fornece.jpg", shot_crop("Opçoes que ela fornece.jpg"))
    canvas = make_stage(
        (1880, 1360),
        "#efedf8",
        "#dfdde9",
        [
            ((230, 220), 300, (128, 104, 255, 42)),
            ((1660, 240), 300, (72, 190, 255, 26)),
        ],
    )
    add_copy_block(
        canvas,
        "Acoes prontas com proximo passo claro",
        "O zoom editorial reforca utilidade real e reduz leitura dispersa.",
        "PERSONAL AI",
        x=120,
        y=104,
    )
    phone_meta = place_phone_frame(canvas, actions, (110, 280), outer_w=500, outer_h=1032)
    add_callout_panel_phone(
        canvas,
        actions,
        phone_meta,
        (20, 650, 562, 1012),
        (940, 620, 1560, 1040),
        "Revisao editorial pronta",
        "Componente desenhado para encurtar o caminho entre intencao, revisao e proxima acao segura da equipe.",
        (142, 122, 255),
    )
    canvas.convert("RGB").save(OUT_DIR / "06-personal-ai-actions-callout.png", quality=95)


def export_callout_responsabilidade() -> None:
    resp = open_shot("Responsabilidade da ai.jpg", shot_crop("Responsabilidade da ai.jpg"))
    canvas = make_stage(
        (1880, 1360),
        "#efedf8",
        "#dfdde9",
        [
            ((230, 220), 300, (128, 104, 255, 42)),
            ((1660, 240), 300, (255, 154, 110, 18)),
        ],
    )
    add_copy_block(
        canvas,
        "Camada de responsabilidade visivel",
        "A mensagem nao parece texto juridico jogado. Ela entra como parte da experiencia.",
        "PERSONAL AI",
        x=120,
        y=104,
    )
    phone_meta = place_phone_frame(canvas, resp, (110, 280), outer_w=500, outer_h=1032)
    add_callout_panel_phone(
        canvas,
        resp,
        phone_meta,
        (18, 166, 430, 610),
        (940, 580, 1560, 1000),
        "Responsabilidade embutida",
        "A interface explicita limites da IA sem quebrar o fluxo. Isso aumenta confianca e reduz leitura de risco.",
        (255, 162, 110),
    )
    canvas.convert("RGB").save(OUT_DIR / "07-personal-ai-responsabilidade-callout.png", quality=95)


def build_all() -> None:
    ensure_dir(OUT_DIR)
    export_single(
        "Home do assistente editorial",
        "Boas-vindas, status e entrada principal com acabamento premium.",
        "Pagina inicial Ai.jpg",
        "01-personal-ai-home-iphone.png",
    )
    gc.collect()
    export_single(
        "Acoes guiadas do assistente",
        "Menu de funcoes com foco em revisao, checagem e clareza operacional.",
        "Opçoes que ela fornece.jpg",
        "02-personal-ai-actions-iphone.png",
    )
    gc.collect()
    export_single(
        "Responsabilidade dentro do fluxo",
        "Mensagem critica de uso posicionada como parte do produto.",
        "Responsabilidade da ai.jpg",
        "03-personal-ai-responsabilidade-iphone.png",
    )
    gc.collect()
    export_thumb()
    gc.collect()
    export_hero()
    gc.collect()
    export_callout_actions()
    gc.collect()
    export_callout_responsabilidade()
    gc.collect()


if __name__ == "__main__":
    build_all()
