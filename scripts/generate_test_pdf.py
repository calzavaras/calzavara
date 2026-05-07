from pathlib import Path

from reportlab.lib.colors import Color
from reportlab.lib.pagesizes import A4
from reportlab.pdfbase.pdfmetrics import stringWidth
from reportlab.pdfgen import canvas


ROOT = Path(__file__).resolve().parents[1]
OUTPUT_DIR = ROOT / "output" / "pdf"
TMP_DIR = ROOT / "tmp" / "pdfs"
PDF_PATH = OUTPUT_DIR / "nigredo-test-deliverable.pdf"

PAGE_WIDTH, PAGE_HEIGHT = A4

BG = Color(5 / 255, 5 / 255, 5 / 255)
TEXT = Color(245 / 255, 245 / 255, 247 / 255)
TEXT_SECONDARY = Color(163 / 255, 163 / 255, 163 / 255)
TEXT_MUTED = Color(115 / 255, 115 / 255, 115 / 255)
YELLOW = Color(1.0, 199 / 255, 0)
PINK = Color(1.0, 77 / 255, 128 / 255)
PURPLE = Color(166 / 255, 77 / 255, 1.0)
CYAN = Color(0, 210 / 255, 1.0)


def hex_color(value: str) -> Color:
    value = value.lstrip("#")
    return Color(
        int(value[0:2], 16) / 255,
        int(value[2:4], 16) / 255,
        int(value[4:6], 16) / 255,
    )


def blend(color_a: Color, color_b: Color, t: float) -> Color:
    return Color(
        color_a.red + (color_b.red - color_a.red) * t,
        color_a.green + (color_b.green - color_a.green) * t,
        color_a.blue + (color_b.blue - color_a.blue) * t,
        alpha=color_a.alpha + (color_b.alpha - color_a.alpha) * t,
    )


def draw_glow(c: canvas.Canvas, x: float, y: float, radius: float, color: Color) -> None:
    for step in range(10, 0, -1):
        scale = step / 10
        alpha = 0.028 * scale
        fill = Color(color.red, color.green, color.blue, alpha=alpha)
        c.setFillColor(fill)
        size = radius * (1.65 - scale * 0.55)
        c.circle(x, y, size, stroke=0, fill=1)


def draw_gradient_bar(
    c: canvas.Canvas,
    x: float,
    y: float,
    width: float,
    height: float,
    colors: list[Color],
) -> None:
    steps = 140
    segments = len(colors) - 1
    for index in range(steps):
        position = index / max(steps - 1, 1)
        raw_segment = min(position * segments, segments - 1e-6)
        segment_index = int(raw_segment)
        local_t = raw_segment - segment_index
        current = blend(colors[segment_index], colors[segment_index + 1], local_t)
        c.setFillColor(current)
        c.rect(x + width * position, y, width / steps + 1, height, stroke=0, fill=1)


def draw_paragraph(
    c: canvas.Canvas,
    text: str,
    x: float,
    y: float,
    max_width: float,
    font_name: str,
    font_size: float,
    color: Color,
    leading: float,
) -> float:
    c.setFont(font_name, font_size)
    c.setFillColor(color)
    words = text.split()
    lines: list[str] = []
    current = ""
    for word in words:
        candidate = f"{current} {word}".strip()
        if stringWidth(candidate, font_name, font_size) <= max_width or not current:
            current = candidate
        else:
            lines.append(current)
            current = word
    if current:
        lines.append(current)
    cursor = y
    for line in lines:
        c.drawString(x, cursor, line)
        cursor -= leading
    return cursor


def draw_card(c: canvas.Canvas, x: float, y: float, width: float, height: float) -> None:
    c.setFillColor(Color(1, 1, 1, alpha=0.035))
    c.setStrokeColor(Color(1, 1, 1, alpha=0.1))
    c.roundRect(x, y, width, height, 20, stroke=1, fill=1)


def draw_badge(c: canvas.Canvas, label: str, x: float, y: float, fill: Color) -> None:
    width = stringWidth(label, "Helvetica-Bold", 10) + 20
    c.setFillColor(Color(fill.red, fill.green, fill.blue, alpha=0.14))
    c.setStrokeColor(Color(fill.red, fill.green, fill.blue, alpha=0.75))
    c.roundRect(x, y, width, 22, 11, stroke=1, fill=1)
    c.setFillColor(TEXT)
    c.setFont("Helvetica-Bold", 10)
    c.drawString(x + 10, y + 7, label)


def draw_icon_signal(c: canvas.Canvas, x: float, y: float, size: float) -> None:
    c.setStrokeColor(CYAN)
    c.setLineWidth(2)
    for index, height in enumerate((10, 18, 26)):
        c.line(x + 8 + index * 10, y + 8, x + 8 + index * 10, y + 8 + height)


def draw_icon_orbit(c: canvas.Canvas, x: float, y: float, size: float) -> None:
    c.setStrokeColor(PURPLE)
    c.setLineWidth(1.6)
    c.ellipse(x + 6, y + 12, x + size - 6, y + size - 12, stroke=1, fill=0)
    c.ellipse(x + 12, y + 6, x + size - 12, y + size - 6, stroke=1, fill=0)
    c.setFillColor(PINK)
    c.circle(x + size / 2, y + size / 2, 4, stroke=0, fill=1)


def draw_icon_panel(c: canvas.Canvas, x: float, y: float, size: float) -> None:
    c.setStrokeColor(YELLOW)
    c.setLineWidth(1.8)
    c.roundRect(x + 6, y + 8, size - 12, size - 16, 6, stroke=1, fill=0)
    c.line(x + 12, y + size / 2, x + size - 12, y + size / 2)
    c.line(x + size / 2, y + 14, x + size / 2, y + size - 14)


def draw_chart(c: canvas.Canvas, x: float, y: float, width: float, height: float) -> None:
    c.setStrokeColor(Color(1, 1, 1, alpha=0.08))
    c.setLineWidth(1)
    for row in range(5):
        c.line(x, y + row * (height / 4), x + width, y + row * (height / 4))
    for col in range(5):
        c.line(x + col * (width / 4), y, x + col * (width / 4), y + height)

    values = [0.24, 0.38, 0.32, 0.58, 0.8]
    points = []
    for idx, value in enumerate(values):
        px = x + idx * (width / (len(values) - 1))
        py = y + value * height
        points.append((px, py))

    c.setLineWidth(3)
    c.setStrokeColor(CYAN)
    path = c.beginPath()
    path.moveTo(points[0][0], points[0][1])
    for px, py in points[1:]:
        path.lineTo(px, py)
    c.drawPath(path, stroke=1, fill=0)

    for index, (px, py) in enumerate(points):
        accent = [CYAN, PURPLE, PINK, YELLOW, PINK][index]
        c.setFillColor(accent)
        c.circle(px, py, 4.5, stroke=0, fill=1)

    bar_x = x + width - 92
    for idx, value in enumerate((0.36, 0.54, 0.71)):
        fill = [PURPLE, PINK, YELLOW][idx]
        c.setFillColor(Color(fill.red, fill.green, fill.blue, alpha=0.9))
        c.roundRect(bar_x + idx * 24, y + 12, 16, value * (height - 26), 5, stroke=0, fill=1)


def build_pdf() -> Path:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    TMP_DIR.mkdir(parents=True, exist_ok=True)

    c = canvas.Canvas(str(PDF_PATH), pagesize=A4)
    c.setTitle("Nigredo Test Deliverable")

    c.setFillColor(BG)
    c.rect(0, 0, PAGE_WIDTH, PAGE_HEIGHT, stroke=0, fill=1)

    draw_glow(c, 430, 760, 110, PURPLE)
    draw_glow(c, 120, 620, 90, CYAN)
    draw_glow(c, 360, 210, 80, PINK)

    c.setFillColor(Color(1, 1, 1, alpha=0.02))
    c.roundRect(28, 28, PAGE_WIDTH - 56, PAGE_HEIGHT - 56, 28, stroke=0, fill=1)

    draw_gradient_bar(c, 56, 794, 132, 5, [CYAN, PURPLE, PINK])
    draw_badge(c, "Test PDF", 56, 756, CYAN)
    draw_badge(c, "Nigredo Style", 142, 756, PURPLE)

    c.setFillColor(TEXT)
    c.setFont("Helvetica-Bold", 28)
    c.drawString(56, 720, "Dunkle Flaeche.")
    c.drawString(56, 688, "Klare Signale.")

    c.setFillColor(TEXT_SECONDARY)
    c.setFont("Helvetica", 12)
    c.drawString(56, 652, "Ein einfaches Testdokument mit Grafik, Text und Icons.")

    lead_text = (
        "Dieses Blatt ist bewusst reduziert. Es zeigt Haltung, Kontrast und eine "
        "praezise Rhythmik. Die Farben setzen Punkte. Der Rest bleibt ruhig."
    )
    draw_paragraph(c, lead_text, 56, 625, 260, "Helvetica", 11.5, TEXT_SECONDARY, 16)

    quote_x = 332
    quote_y = 570
    quote_w = 208
    quote_h = 180
    draw_card(c, quote_x, quote_y, quote_w, quote_h)
    draw_gradient_bar(c, quote_x + 18, quote_y + quote_h - 18, 92, 3, [YELLOW, PINK])
    c.setFillColor(TEXT)
    c.setFont("Helvetica-Bold", 16)
    c.drawString(quote_x + 18, quote_y + 128, "Phantasietext")
    quote = (
        "Zwischen Neon und Nacht steht eine kleine Idee. "
        "Sie leuchtet kurz auf, ordnet das Rauschen und "
        "macht aus Fragmenten eine Richtung."
    )
    draw_paragraph(
        c,
        quote,
        quote_x + 18,
        quote_y + 104,
        quote_w - 36,
        "Helvetica",
        10.5,
        TEXT_SECONDARY,
        15,
    )
    c.setFillColor(TEXT_MUTED)
    c.setFont("Helvetica", 9.5)
    c.drawString(quote_x + 18, quote_y + 24, "Studie 01  |  Interner Layouttest")

    chart_x = 56
    chart_y = 392
    chart_w = PAGE_WIDTH - 112
    chart_h = 132
    draw_card(c, chart_x, chart_y, chart_w, chart_h)
    c.setFillColor(TEXT)
    c.setFont("Helvetica-Bold", 16)
    c.drawString(chart_x + 18, chart_y + chart_h - 28, "Signalverlauf")
    c.setFillColor(TEXT_MUTED)
    c.setFont("Helvetica", 10)
    c.drawString(chart_x + 18, chart_y + chart_h - 45, "Kleine Grafikflaeche mit Linien- und Balkenakzenten.")
    draw_chart(c, chart_x + 18, chart_y + 18, chart_w - 36, 68)

    card_y = 206
    card_w = 154
    gap = 14
    titles = ["Klarheit", "Rhythmus", "Praesenz"]
    bodies = [
        "Kurze Aussagen, saubere Kanten und ein lesbarer Aufbau.",
        "Panels, Linien und Text greifen ineinander statt zu konkurrieren.",
        "Icons und Farben markieren nur das, was wirklich fuehren soll.",
    ]
    icons = [draw_icon_signal, draw_icon_orbit, draw_icon_panel]

    for idx in range(3):
        x = 56 + idx * (card_w + gap)
        draw_card(c, x, card_y, card_w, 132)
        icons[idx](c, x + card_w - 40, card_y + 96, 18)
        c.setFillColor(TEXT)
        c.setFont("Helvetica-Bold", 13)
        c.drawString(x + 18, card_y + 94, titles[idx])
        draw_paragraph(
            c,
            bodies[idx],
            x + 18,
            card_y + 62,
            card_w - 36,
            "Helvetica",
            9.8,
            TEXT_SECONDARY,
            13,
        )

    c.setStrokeColor(Color(1, 1, 1, alpha=0.08))
    c.line(56, 154, PAGE_WIDTH - 56, 154)
    c.setFillColor(TEXT_MUTED)
    c.setFont("Helvetica", 9.5)
    c.drawString(56, 132, "Nigredo Test Deliverable")
    c.drawRightString(PAGE_WIDTH - 56, 132, "Seite 1")

    c.showPage()
    c.save()
    return PDF_PATH


if __name__ == "__main__":
    path = build_pdf()
    print(path)
