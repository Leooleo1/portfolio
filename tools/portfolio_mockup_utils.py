from __future__ import annotations

from pathlib import Path
from typing import Iterable

from PIL import Image, ImageDraw, ImageFilter, ImageFont, ImageOps


def ensure_dir(path: Path) -> None:
    path.mkdir(parents=True, exist_ok=True)


def load_font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    candidates = [
        "C:/Windows/Fonts/segoeuib.ttf" if bold else "C:/Windows/Fonts/segoeui.ttf",
        "C:/Windows/Fonts/arialbd.ttf" if bold else "C:/Windows/Fonts/arial.ttf",
    ]
    for candidate in candidates:
        if Path(candidate).exists():
            return ImageFont.truetype(candidate, size=size)
    return ImageFont.load_default()


def hex_to_rgb(value: str) -> tuple[int, int, int]:
    value = value.lstrip("#")
    return tuple(int(value[i : i + 2], 16) for i in (0, 2, 4))


def vertical_gradient(size: tuple[int, int], top_hex: str, bottom_hex: str) -> Image.Image:
    width, height = size
    top = hex_to_rgb(top_hex)
    bottom = hex_to_rgb(bottom_hex)
    image = Image.new("RGB", size)
    pixels = image.load()
    for y in range(height):
        mix = y / max(height - 1, 1)
        color = tuple(int(top[i] * (1 - mix) + bottom[i] * mix) for i in range(3))
        for x in range(width):
            pixels[x, y] = color
    return image


def add_glows(base: Image.Image, glows: Iterable[tuple[tuple[int, int], int, tuple[int, int, int, int]]]) -> None:
    for center, radius, color in glows:
        layer = Image.new("RGBA", base.size, (0, 0, 0, 0))
        draw = ImageDraw.Draw(layer)
        x, y = center
        draw.ellipse((x - radius, y - radius, x + radius, y + radius), fill=color)
        layer = layer.filter(ImageFilter.GaussianBlur(radius // 2))
        base.alpha_composite(layer)


def add_noise(base: Image.Image, opacity: int = 16) -> None:
    noise = Image.effect_noise(base.size, 10).convert("L")
    noise = ImageOps.colorize(noise, (0, 0, 0), (255, 255, 255)).convert("RGBA")
    noise.putalpha(opacity)
    base.alpha_composite(noise)


def add_grid(base: Image.Image, step: int = 88, color: tuple[int, int, int, int] = (255, 255, 255, 18)) -> None:
    layer = Image.new("RGBA", base.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(layer)
    width, height = base.size
    for x in range(0, width, step):
        draw.line((x, 0, x, height), fill=color, width=1)
    for y in range(0, height, step):
        draw.line((0, y, width, y), fill=color, width=1)
    layer = layer.filter(ImageFilter.GaussianBlur(0.4))
    base.alpha_composite(layer)


def make_stage(
    size: tuple[int, int],
    top: str,
    bottom: str,
    glows: Iterable[tuple[tuple[int, int], int, tuple[int, int, int, int]]],
) -> Image.Image:
    canvas = vertical_gradient(size, top, bottom).convert("RGBA")
    add_glows(canvas, glows)
    add_grid(canvas)
    add_noise(canvas, opacity=14)
    return canvas


def rounded_mask(size: tuple[int, int], radius: int) -> Image.Image:
    mask = Image.new("L", size, 0)
    draw = ImageDraw.Draw(mask)
    draw.rounded_rectangle((0, 0, size[0], size[1]), radius=radius, fill=255)
    return mask


def soften_shot(image: Image.Image) -> Image.Image:
    image = image.filter(ImageFilter.GaussianBlur(0.2))
    image = image.filter(ImageFilter.UnsharpMask(radius=1.8, percent=130, threshold=2))
    return image


def make_shadow(size: tuple[int, int], radius: int, blur: int, alpha: int) -> Image.Image:
    shadow = Image.new("RGBA", size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(shadow)
    draw.rounded_rectangle((24, 20, size[0] - 24, size[1] - 10), radius=radius, fill=(20, 24, 31, alpha))
    return shadow.filter(ImageFilter.GaussianBlur(blur))


def text_width(draw: ImageDraw.ImageDraw, text: str, font: ImageFont.ImageFont) -> int:
    box = draw.textbbox((0, 0), text, font=font)
    return box[2] - box[0]


def wrap_text(draw: ImageDraw.ImageDraw, text: str, font: ImageFont.ImageFont, max_width: int) -> list[str]:
    words = text.split()
    lines: list[str] = []
    current = ""
    for word in words:
        trial = word if not current else current + " " + word
        if text_width(draw, trial, font) <= max_width:
            current = trial
        else:
            if current:
                lines.append(current)
            current = word
    if current:
        lines.append(current)
    return lines


def draw_label(draw: ImageDraw.ImageDraw, x: int, y: int, text: str) -> None:
    font = load_font(20, bold=True)
    w = text_width(draw, text, font) + 34
    h = 42
    draw.rounded_rectangle((x, y, x + w, y + h), radius=21, fill=(255, 255, 255, 172), outline=(255, 255, 255, 110), width=1)
    draw.text((x + 18, y + 11), text, font=font, fill=(49, 57, 66))


def draw_guest_avatar(
    draw: ImageDraw.ImageDraw,
    center: tuple[int, int],
    radius: int,
    bg: tuple[int, int, int] = (107, 114, 128),
    fg: tuple[int, int, int] = (255, 255, 255),
) -> None:
    cx, cy = center
    draw.ellipse((cx - radius, cy - radius, cx + radius, cy + radius), fill=bg)
    head_r = int(radius * 0.28)
    draw.ellipse(
        (cx - head_r, cy - radius * 0.34 - head_r, cx + head_r, cy - radius * 0.34 + head_r),
        fill=fg,
    )
    body_w = int(radius * 1.08)
    body_h = int(radius * 0.82)
    draw.rounded_rectangle(
        (
            cx - body_w // 2,
            cy - radius * 0.02,
            cx + body_w // 2,
            cy - radius * 0.02 + body_h,
        ),
        radius=int(radius * 0.26),
        fill=fg,
    )


def add_copy_block(
    canvas: Image.Image,
    title: str,
    subtitle: str,
    label: str,
    x: int = 160,
    y: int = 126,
) -> None:
    draw = ImageDraw.Draw(canvas)
    draw_label(draw, x, y, label)
    title_font = load_font(46, bold=True)
    body_font = load_font(18)
    draw.text((x, y + 70), title, font=title_font, fill=(39, 44, 51))
    draw.text((x, y + 136), subtitle, font=body_font, fill=(92, 98, 108))


def crop_resize(image: Image.Image, box: tuple[int, int, int, int], size: tuple[int, int]) -> Image.Image:
    crop = image.crop(box)
    crop_ratio = crop.width / crop.height
    target_ratio = size[0] / size[1]
    if crop_ratio > target_ratio:
      new_h = size[1]
      new_w = int(new_h * crop_ratio)
    else:
      new_w = size[0]
      new_h = int(new_w / crop_ratio)
    resized = crop.resize((new_w, new_h), Image.Resampling.LANCZOS)
    left = max((new_w - size[0]) // 2, 0)
    top = max((new_h - size[1]) // 2, 0)
    return resized.crop((left, top, left + size[0], top + size[1]))


def build_phone_frame(
    screen: Image.Image,
    outer_w: int = 620,
    outer_h: int = 1280,
    body_color: tuple[int, int, int] = (13, 16, 22),
) -> tuple[Image.Image, dict]:
    bezel = 22
    frame = Image.new("RGBA", (outer_w, outer_h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(frame)

    draw.rounded_rectangle((12, 12, outer_w - 12, outer_h - 12), radius=94, fill=(32, 37, 46, 255))
    draw.rounded_rectangle((18, 18, outer_w - 18, outer_h - 18), radius=90, fill=body_color)
    draw.rounded_rectangle((28, 28, outer_w - 28, outer_h - 28), radius=84, outline=(105, 115, 128, 82), width=2)

    screen_w = outer_w - bezel * 2
    screen_h = outer_h - bezel * 2
    source_w, source_h = screen.size
    screen = soften_shot(screen.resize((screen_w, screen_h), Image.Resampling.LANCZOS))
    mask = rounded_mask((screen_w, screen_h), 70)
    frame.paste(screen, (bezel, bezel), mask)

    speaker_w = 120
    speaker_h = 10
    speaker_x = (outer_w - speaker_w) // 2
    speaker_y = 54
    draw.rounded_rectangle((speaker_x, speaker_y, speaker_x + speaker_w, speaker_y + speaker_h), radius=5, fill=(34, 39, 47, 235))
    draw.rounded_rectangle((speaker_x + 12, speaker_y + 2, speaker_x + speaker_w - 12, speaker_y + speaker_h - 2), radius=4, fill=(58, 64, 74, 245))

    side_line = (255, 255, 255, 34)
    draw.rounded_rectangle((8, 210, 12, 360), radius=2, fill=side_line)
    draw.rounded_rectangle((8, 390, 12, 500), radius=2, fill=side_line)
    draw.rounded_rectangle((outer_w - 12, 300, outer_w - 8, 470), radius=2, fill=side_line)

    gloss = Image.new("RGBA", (outer_w, outer_h), (0, 0, 0, 0))
    gd = ImageDraw.Draw(gloss)
    gd.polygon(
        [(outer_w * 0.54, 0), (outer_w, 0), (outer_w, outer_h * 0.42), (outer_w * 0.7, outer_h * 0.24)],
        fill=(255, 255, 255, 24),
    )
    gloss = gloss.filter(ImageFilter.GaussianBlur(16))
    frame.alpha_composite(gloss)

    return frame, {
        "screen_box": (bezel, bezel, bezel + screen_w, bezel + screen_h),
        "scale_x": screen_w / source_w,
        "scale_y": screen_h / source_h,
    }


def place_phone_frame(
    canvas: Image.Image,
    screen: Image.Image,
    pos: tuple[int, int],
    outer_w: int = 620,
    outer_h: int = 1280,
    shadow_alpha: int = 0,
) -> dict:
    phone, meta = build_phone_frame(screen, outer_w=outer_w, outer_h=outer_h)
    if shadow_alpha > 0:
        shadow = make_shadow((phone.width + 90, phone.height + 90), 96, 44, shadow_alpha)
        canvas.alpha_composite(shadow, (pos[0] - 45, pos[1] - 34))
    canvas.alpha_composite(phone, pos)
    return {
        "x": pos[0],
        "y": pos[1],
        "w": phone.width,
        "h": phone.height,
        "screen_box": (
            pos[0] + meta["screen_box"][0],
            pos[1] + meta["screen_box"][1],
            pos[0] + meta["screen_box"][2],
            pos[1] + meta["screen_box"][3],
        ),
        "scale_x": meta["scale_x"],
        "scale_y": meta["scale_y"],
    }


def phone_point(meta: dict, point: tuple[int, int]) -> tuple[int, int]:
    x = int(meta["screen_box"][0] + point[0] * meta["scale_x"])
    y = int(meta["screen_box"][1] + point[1] * meta["scale_y"])
    return x, y


def add_callout_panel_phone(
    canvas: Image.Image,
    source_shot: Image.Image,
    phone_meta: dict,
    crop_box: tuple[int, int, int, int],
    panel_box: tuple[int, int, int, int],
    title: str,
    body: str,
    accent: tuple[int, int, int],
    badge: str = "ZOOM EM DETALHE",
) -> None:
    draw = ImageDraw.Draw(canvas)
    panel = Image.new("RGBA", (panel_box[2] - panel_box[0], panel_box[3] - panel_box[1]), (0, 0, 0, 0))
    pd = ImageDraw.Draw(panel)
    pd.rounded_rectangle((0, 0, panel.width, panel.height), radius=32, fill=(16, 21, 29, 245), outline=(66, 79, 91, 148), width=1)

    crop = crop_resize(source_shot, crop_box, (panel.width - 40, 188))
    crop_mask = rounded_mask(crop.size, 22)
    panel.paste(crop, (20, 20), crop_mask)

    badge_font = load_font(14, bold=True)
    badge_w = text_width(pd, badge, badge_font) + 24
    pd.rounded_rectangle((20, 220, 20 + badge_w, 248), radius=14, fill=(accent[0], accent[1], accent[2], 48), outline=(accent[0], accent[1], accent[2], 120), width=1)
    pd.text((32, 227), badge, font=badge_font, fill=(accent[0], accent[1], accent[2], 255))

    title_font = load_font(24, bold=True)
    body_font = load_font(17)
    pd.text((20, 268), title, font=title_font, fill=(239, 243, 247))
    body_lines = wrap_text(pd, body, body_font, panel.width - 40)
    y = 308
    for line in body_lines[:4]:
        pd.text((20, y), line, font=body_font, fill=(172, 182, 194))
        y += 24

    canvas.alpha_composite(panel, (panel_box[0], panel_box[1]))

    anchor_src = ((crop_box[0] + crop_box[2]) // 2, (crop_box[1] + crop_box[3]) // 2)
    src_point = phone_point(phone_meta, anchor_src)
    panel_anchor = (panel_box[0], panel_box[1] + 86)
    mid_x = int((src_point[0] + panel_anchor[0]) / 2)
    line_color = accent + (220,)
    draw.line((src_point[0], src_point[1], mid_x, src_point[1]), fill=line_color, width=3)
    draw.line((mid_x, src_point[1], mid_x, panel_anchor[1]), fill=line_color, width=3)
    draw.line((mid_x, panel_anchor[1], panel_anchor[0], panel_anchor[1]), fill=line_color, width=3)
    draw.ellipse((src_point[0] - 8, src_point[1] - 8, src_point[0] + 8, src_point[1] + 8), fill=(16, 21, 29, 255), outline=line_color, width=3)
    draw.ellipse((panel_anchor[0] - 7, panel_anchor[1] - 7, panel_anchor[0] + 7, panel_anchor[1] + 7), fill=(16, 21, 29, 255), outline=line_color, width=3)


def build_browser_frame(shot: Image.Image, title: str, frame_w: int) -> tuple[Image.Image, dict]:
    chrome_h = 74
    source_w, source_h = shot.size
    shot_ratio = source_h / source_w
    shot_w = frame_w - 52
    shot_h = int(shot_w * shot_ratio)
    frame_h = shot_h + chrome_h + 28

    frame = Image.new("RGBA", (frame_w, frame_h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(frame)
    draw.rounded_rectangle((0, 0, frame_w, frame_h), radius=36, fill=(14, 19, 28, 255), outline=(85, 102, 118, 110), width=1)
    draw.rounded_rectangle((1, 1, frame_w - 2, chrome_h), radius=36, fill=(18, 24, 34, 255))
    draw.rectangle((0, chrome_h, frame_w, frame_h), fill=(14, 19, 28, 255))
    draw.line((24, chrome_h, frame_w - 24, chrome_h), fill=(60, 75, 89, 120), width=1)

    button_y = chrome_h // 2
    for i, color in enumerate(((255, 95, 86), (255, 189, 46), (39, 201, 63))):
        cx = 34 + i * 22
        draw.ellipse((cx - 6, button_y - 6, cx + 6, button_y + 6), fill=color)

    title_font = load_font(22, bold=True)
    meta_font = load_font(16)
    draw.text((112, 24), title, font=title_font, fill=(236, 239, 244))
    draw.text((112, 46), "socialcommand / portfolio presentation", font=meta_font, fill=(138, 150, 166))

    chip_text = "LIVE PRODUCT"
    chip_font = load_font(15, bold=True)
    chip_w = text_width(draw, chip_text, chip_font) + 34
    chip_h = 34
    chip_x = frame_w - chip_w - 28
    chip_y = 20
    draw.rounded_rectangle((chip_x, chip_y, chip_x + chip_w, chip_y + chip_h), radius=17, fill=(20, 43, 45, 255), outline=(72, 201, 180, 88), width=1)
    draw.text((chip_x + 18, chip_y + 8), chip_text, font=chip_font, fill=(114, 241, 220))

    shot = soften_shot(shot.resize((shot_w, shot_h), Image.Resampling.LANCZOS))
    mask = rounded_mask((shot_w, shot_h), 18)
    content_x = 26
    content_y = chrome_h + 10
    frame.paste(shot, (content_x, content_y), mask)

    reflection = Image.new("RGBA", (frame_w, frame_h), (0, 0, 0, 0))
    rd = ImageDraw.Draw(reflection)
    rd.polygon(
        [(frame_w * 0.58, 0), (frame_w, 0), (frame_w, frame_h * 0.5), (frame_w * 0.74, frame_h * 0.36)],
        fill=(255, 255, 255, 18),
    )
    reflection = reflection.filter(ImageFilter.GaussianBlur(14))
    frame.alpha_composite(reflection)

    return frame, {
        "frame_size": (frame_w, frame_h),
        "content_origin": (content_x, content_y),
        "content_size": (shot_w, shot_h),
        "scale_x": shot_w / source_w,
        "scale_y": shot_h / source_h,
    }


def place_browser_frame(
    canvas: Image.Image,
    shot: Image.Image,
    title: str,
    pos: tuple[int, int],
    frame_w: int,
    shadow_alpha: int = 0,
) -> dict:
    frame, meta = build_browser_frame(shot, title, frame_w)
    if shadow_alpha > 0:
        shadow = make_shadow((frame.width + 120, frame.height + 120), 40, 32, shadow_alpha)
        canvas.alpha_composite(shadow, (pos[0] - 60, pos[1] - 46))
    canvas.alpha_composite(frame, pos)
    return {
        "x": pos[0],
        "y": pos[1],
        "frame_w": frame.width,
        "frame_h": frame.height,
        "content_x": pos[0] + meta["content_origin"][0],
        "content_y": pos[1] + meta["content_origin"][1],
        "content_w": meta["content_size"][0],
        "content_h": meta["content_size"][1],
        "scale_x": meta["scale_x"],
        "scale_y": meta["scale_y"],
    }


def browser_point(meta: dict, point: tuple[int, int]) -> tuple[int, int]:
    x = int(meta["content_x"] + point[0] * meta["scale_x"])
    y = int(meta["content_y"] + point[1] * meta["scale_y"])
    return x, y


def add_callout_panel_browser(
    canvas: Image.Image,
    source_shot: Image.Image,
    browser_meta: dict,
    crop_box: tuple[int, int, int, int],
    panel_box: tuple[int, int, int, int],
    title: str,
    body: str,
    accent: tuple[int, int, int],
    badge: str = "ZOOM EM DETALHE",
) -> None:
    draw = ImageDraw.Draw(canvas)
    panel = Image.new("RGBA", (panel_box[2] - panel_box[0], panel_box[3] - panel_box[1]), (0, 0, 0, 0))
    pd = ImageDraw.Draw(panel)
    pd.rounded_rectangle((0, 0, panel.width, panel.height), radius=32, fill=(16, 21, 29, 245), outline=(66, 79, 91, 148), width=1)

    crop = crop_resize(source_shot, crop_box, (panel.width - 40, 188))
    crop_mask = rounded_mask(crop.size, 22)
    panel.paste(crop, (20, 20), crop_mask)

    badge_font = load_font(14, bold=True)
    badge_w = text_width(pd, badge, badge_font) + 24
    pd.rounded_rectangle((20, 220, 20 + badge_w, 248), radius=14, fill=(accent[0], accent[1], accent[2], 48), outline=(accent[0], accent[1], accent[2], 120), width=1)
    pd.text((32, 227), badge, font=badge_font, fill=(accent[0], accent[1], accent[2], 255))

    title_font = load_font(24, bold=True)
    body_font = load_font(17)
    pd.text((20, 268), title, font=title_font, fill=(239, 243, 247))
    body_lines = wrap_text(pd, body, body_font, panel.width - 40)
    y = 308
    for line in body_lines[:4]:
        pd.text((20, y), line, font=body_font, fill=(172, 182, 194))
        y += 24

    canvas.alpha_composite(panel, (panel_box[0], panel_box[1]))

    anchor_src = ((crop_box[0] + crop_box[2]) // 2, (crop_box[1] + crop_box[3]) // 2)
    src_point = browser_point(browser_meta, anchor_src)
    panel_anchor = (panel_box[0], panel_box[1] + 86)
    mid_x = int((src_point[0] + panel_anchor[0]) / 2)
    line_color = accent + (220,)
    draw.line((src_point[0], src_point[1], mid_x, src_point[1]), fill=line_color, width=3)
    draw.line((mid_x, src_point[1], mid_x, panel_anchor[1]), fill=line_color, width=3)
    draw.line((mid_x, panel_anchor[1], panel_anchor[0], panel_anchor[1]), fill=line_color, width=3)
    draw.ellipse((src_point[0] - 8, src_point[1] - 8, src_point[0] + 8, src_point[1] + 8), fill=(16, 21, 29, 255), outline=line_color, width=3)
    draw.ellipse((panel_anchor[0] - 7, panel_anchor[1] - 7, panel_anchor[0] + 7, panel_anchor[1] + 7), fill=(16, 21, 29, 255), outline=line_color, width=3)
