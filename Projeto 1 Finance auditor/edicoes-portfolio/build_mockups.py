from __future__ import annotations

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


def open_shot(name: str, crop: tuple[int, int, int, int] | None = None) -> Image.Image:
    image = Image.open(ROOT / name).convert("RGB")
    image = image.crop(crop) if crop else image
    if name == "Pagina inicial.jpg":
        return anonymize_editorial_name(image)
    if name == "Dashboard.jpg":
        return anonymize_menu_candidate(image)
    return image


def anonymize_editorial_name(image: Image.Image) -> Image.Image:
    screen = image.copy()
    draw = ImageDraw.Draw(screen)
    text_font = load_font(18, bold=True)

    draw.rounded_rectangle((116, 104, 506, 196), radius=22, fill=(18, 28, 26))
    draw.text((128, 126), "Centro Editorial", font=text_font, fill=(244, 248, 245))
    return screen


def anonymize_menu_candidate(image: Image.Image) -> Image.Image:
    screen = image.copy()
    draw = ImageDraw.Draw(screen)
    text_font = load_font(16, bold=True)

    draw.ellipse((118, 137, 184, 203), fill=(255, 255, 255))
    draw_guest_avatar(draw, (151, 170), 24, bg=(170, 173, 170), fg=(255, 255, 255))
    draw.rounded_rectangle((206, 166, 384, 196), radius=10, fill=(17, 24, 20))
    draw.text((210, 171), "Seu candidato", font=text_font, fill=(198, 202, 198))
    return screen


def export_single(name: str, title: str, subtitle: str, screen_name: str, top: str, bottom: str, glows, out_name: str) -> None:
    screen = open_shot(screen_name)
    canvas = make_stage((1600, 1800), top, bottom, glows)
    add_copy_block(canvas, title, subtitle, "FINANCE AUDITOR", x=140, y=124)
    place_phone_frame(canvas, screen, (490, 350))
    draw = ImageDraw.Draw(canvas)
    font = load_font(18)
    draw.text((140, 1560), "Composicao mobile pensada para demo de produto real.", font=font, fill=(102, 108, 118))
    canvas.convert("RGB").save(OUT_DIR / out_name, quality=95)


def export_thumb() -> None:
    login = open_shot("Pagina inicial.jpg")
    menu = open_shot("Dashboard.jpg")
    canvas = make_stage(
        (1400, 980),
        "#0f1410",
        "#0c1110",
        [
            ((180, 180), 260, (86, 236, 142, 42)),
            ((1210, 180), 220, (120, 255, 180, 32)),
            ((1120, 860), 260, (55, 160, 92, 26)),
        ],
    )
    draw = ImageDraw.Draw(canvas)
    from portfolio_mockup_utils import draw_label  # noqa: E402

    draw_label(draw, 70, 64, "FINANCE AUDITOR")
    place_phone_frame(canvas, login, (120, 210), outer_w=430, outer_h=890)
    place_phone_frame(canvas, menu, (830, 150), outer_w=470, outer_h=972)
    title_font = load_font(30, bold=True)
    body_font = load_font(17)
    draw.text((70, 856), "Controle, conformidade e operacao eleitoral em fluxo mobile.", font=title_font, fill=(241, 245, 240))
    draw.text((70, 904), "Preview para card do portfolio.", font=body_font, fill=(136, 146, 138))
    canvas.convert("RGB").save(OUT_DIR / "04-finance-thumb.png", quality=95)


def export_hero() -> None:
    login = open_shot("Pagina inicial.jpg")
    dashboard = open_shot("Pagina painel.jpg")
    canvas = make_stage(
        (2300, 1600),
        "#f1eee7",
        "#e2ddd4",
        [
            ((230, 220), 360, (72, 196, 104, 48)),
            ((2060, 240), 340, (88, 224, 166, 36)),
            ((1900, 1360), 340, (35, 111, 58, 24)),
        ],
    )
    add_copy_block(
        canvas,
        "Prestacao eleitoral com leitura auditavel",
        "Login, painel financeiro e recortes de conformidade tratados como produto premium.",
        "FINANCE AUDITOR",
        x=146,
        y=126,
    )
    place_phone_frame(canvas, login, (210, 390), outer_w=470, outer_h=970, shadow_alpha=0)
    place_phone_frame(canvas, dashboard, (880, 330), outer_w=560, outer_h=1160, shadow_alpha=0)
    draw = ImageDraw.Draw(canvas)
    quote_font = load_font(22, bold=True)
    body_font = load_font(18)
    draw.text((1600, 690), "Fluxo mobile focado em confianca operacional.", font=quote_font, fill=(41, 46, 54))
    lines = [
        "O projeto funciona melhor quando a interface parece",
        "ferramenta de uso real e nao print solto de tela.",
    ]
    y = 740
    for line in lines:
        draw.text((1600, y), line, font=body_font, fill=(102, 108, 118))
        y += 28
    canvas.convert("RGB").save(OUT_DIR / "05-finance-hero.png", quality=95)


def export_callout_conformidade() -> None:
    menu = open_shot("Dashboard.jpg")
    canvas = make_stage(
        (2200, 1560),
        "#efece4",
        "#dfd8ce",
        [
            ((230, 220), 320, (72, 196, 104, 44)),
            ((1960, 240), 320, (88, 224, 166, 30)),
        ],
    )
    add_copy_block(
        canvas,
        "Menu e conformidade em foco",
        "Acesso lateral organizado e um bloco de status que vira argumento de produto.",
        "FINANCE AUDITOR",
        x=140,
        y=126,
    )
    phone_meta = place_phone_frame(canvas, menu, (160, 330), outer_w=640, outer_h=1320)
    add_callout_panel_phone(
        canvas,
        menu,
        phone_meta,
        (30, 908, 455, 1218),
        (1160, 760, 1710, 1140),
        "Conformidade 100% auditável",
        "Componente criado para garantir feedback visual de sucesso imediato ao auditor.",
        (88, 224, 166),
    )
    canvas.convert("RGB").save(OUT_DIR / "06-finance-conformidade-callout.png", quality=95)


def export_callout_movimentacao() -> None:
    move = open_shot("Pagina relatorios.jpg")
    canvas = make_stage(
        (2200, 1560),
        "#efebe4",
        "#dfd7cf",
        [
            ((230, 220), 320, (72, 196, 104, 42)),
            ((1980, 240), 320, (255, 136, 166, 20)),
        ],
    )
    add_copy_block(
        canvas,
        "Movimentacao e conferencia",
        "Filtros, totalizadores e comprovacao visual do fluxo financeiro.",
        "FINANCE AUDITOR",
        x=140,
        y=126,
    )
    phone_meta = place_phone_frame(canvas, move, (160, 330), outer_w=640, outer_h=1320)
    add_callout_panel_phone(
        canvas,
        move,
        phone_meta,
        (36, 716, 540, 1120),
        (1160, 720, 1710, 1120),
        "Lancamentos em evidencia",
        "O recorte destaca saldo, status e comprovacao em uma unica leitura, sem virar tela burocratica.",
        (255, 132, 164),
    )
    canvas.convert("RGB").save(OUT_DIR / "07-finance-movimentacao-callout.png", quality=95)


def build_all() -> None:
    ensure_dir(OUT_DIR)
    export_single(
        "01-finance-login-iphone.png",
        "Entrada segura no sistema",
        "Tela inicial tratada como produto de uso diario, nao captura crua.",
        "Pagina inicial.jpg",
        "#f0ece6",
        "#e2ddd4",
        [((220, 220), 320, (72, 196, 104, 42)), ((1320, 260), 300, (88, 224, 166, 30))],
        "01-finance-login-iphone.png",
    )
    export_single(
        "02-finance-dashboard-iphone.png",
        "Painel financeiro consolidado",
        "Visao de entradas, saldo e base validada com acabamento premium.",
        "Pagina painel.jpg",
        "#f1ede7",
        "#e2ddd4",
        [((220, 220), 320, (72, 196, 104, 42)), ((1320, 260), 300, (88, 224, 166, 30))],
        "02-finance-dashboard-iphone.png",
    )
    export_single(
        "03-finance-menu-iphone.png",
        "Navegacao e auditoria lateral",
        "Sidebar organizada com camada de confianca e fechamento de sessao.",
        "Dashboard.jpg",
        "#f1ede7",
        "#e2ddd4",
        [((220, 220), 320, (72, 196, 104, 42)), ((1320, 260), 300, (88, 224, 166, 30))],
        "03-finance-menu-iphone.png",
    )
    export_thumb()
    export_hero()
    export_callout_conformidade()
    export_callout_movimentacao()


if __name__ == "__main__":
    build_all()
