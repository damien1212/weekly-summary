import sys, json

from openpyxl import Workbook
from openpyxl.styles import Border, Side, PatternFill, Font, GradientFill, Alignment


def load_data():
    return json.load(sys.stdin)


def style_range(ws, cell_range, border=Border(), fill=None, font=None, alignment=None):
    top = Border(top=border.top)
    left = Border(left=border.left)
    right = Border(right=border.right)
    bottom = Border(bottom=border.bottom)

    first_cell = ws[cell_range.split(":")[0]]
    if alignment:
        ws.merge_cells(cell_range)
        first_cell.alignment = alignment

    rows = ws[cell_range]
    if font:
        first_cell.font = font

    for cell in rows[0]:
        cell.border = cell.border + top
    for cell in rows[-1]:
        cell.border = cell.border + bottom

    for row in rows:
        l = row[0]
        r = row[-1]
        l.border = l.border + left
        r.border = r.border + right
        if fill:
            for c in row:
                c.fill = fill


def main():
    data = load_data()

    print(data)

    wb = Workbook()
    ws = wb.active
    cell = ws['A1']

    cell.value = 12

    thin = Side(border_style="thin", color="000000")

    styles = {
        'border': Border(top=thin, left=thin, right=thin, bottom=thin),
        'fill': PatternFill("solid", fgColor="FF0055"),
        'font': Font(b=True, color="000000"),
        'alignment': Alignment(horizontal="center", vertical="center")
    }

    style_range(ws, 'A1:C3', **styles)

    wb.save(sys.argv[1])

main()
