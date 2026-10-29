# Layout và đóng gói (Ngày 5 đến 6)

Dùng file này khi người dùng đã có bản thảo và cần biến nó thành file trông chuyên nghiệp.

Đây là chỗ khó thứ hai trong cả lộ trình, sau việc viết. Nhưng khó vì tâm lý chứ không phải kỹ thuật: người ta tưởng phải biết thiết kế mới làm được file đẹp. Không cần.

## Vì sao không dùng Canva

Canva bắt kéo thả từng thành phần, mất hàng giờ, và kết quả phụ thuộc vào con mắt thẩm mỹ của người làm. Sinh code để dựng file thì ra bản hoàn chỉnh trong vài phút, và mỗi lần chỉnh chỉ cần sửa một dòng rồi chạy lại. Đó là lý do cách này nhanh hơn nhiều lần.

## Ngày 5 sáng: dựng file PDF

**Nếu môi trường có chạy code:** làm file trực tiếp cho người dùng, đừng bắt họ tự chạy.

**Nếu không có:** sinh code Python cho họ, kèm hướng dẫn chạy trên Google Colab (miễn phí, không cần cài gì). Nói rõ với họ: không cần biết lập trình, chỉ cần copy dán và bấm chạy.

### Font tiếng Việt: lỗi phổ biến nhất

Lỗi số một khi làm PDF tiếng Việt là chọn font không có dấu, ra file toàn ô vuông hoặc mất dấu.

Font an toàn, có sẵn trên hầu hết môi trường Linux và Colab:
- `/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf` (và `DejaVuSans-Bold.ttf`)
- `/usr/share/fonts/truetype/freefont/FreeSans.ttf`

Luôn kiểm tra font tồn tại trước khi dùng. Nếu muốn font đẹp hơn, tải Noto Sans hoặc Be Vietnam Pro từ Google Fonts.

### Thông số chuẩn

- Khổ A4
- Lề 25mm
- Body 11pt, giãn dòng 1.4 đến 1.5
- Tiêu đề chương: trang riêng, cỡ lớn
- Số trang góc dưới
- Header/footer mỗi trang

### Prompt dựng layout (nếu người dùng tự làm)

```
Tôi muốn tạo file ebook PDF tiếng Việt từ nội dung đính kèm.

Yêu cầu thiết kế:
- Bìa với màu chủ đạo [chọn màu]
- Mục lục có số trang
- Mỗi chương lớn có trang riêng với tiêu đề lớn
- Box callout để highlight đoạn quan trọng
- Pull quote in nghiêng cho câu nhấn mạnh
- Header và footer mỗi trang, số trang góc dưới
- Font BẮT BUỘC hỗ trợ tiếng Việt có dấu (DejaVuSans hoặc FreeSans)
- Khổ A4, lề 25mm, body 11pt

Hãy viết code Python dùng reportlab để tạo file PDF này.
Tôi không biết lập trình, hãy hướng dẫn tôi chạy trên Google Colab.
```

### Khung code mẫu

Dùng làm điểm khởi đầu, chỉnh màu và nội dung theo sản phẩm của người dùng:

```python
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_JUSTIFY
from reportlab.lib import colors
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (SimpleDocTemplate, Paragraph, Spacer,
                               PageBreak, Table, TableStyle)
import os

# 1. Đăng ký font tiếng Việt - BẮT BUỘC, không có bước này là mất dấu
FONT_DIR = "/usr/share/fonts/truetype/dejavu"
pdfmetrics.registerFont(TTFont("VN", f"{FONT_DIR}/DejaVuSans.ttf"))
pdfmetrics.registerFont(TTFont("VN-Bold", f"{FONT_DIR}/DejaVuSans-Bold.ttf"))

# 2. Màu chủ đạo - đổi theo brand
ACCENT = colors.HexColor("#0F6E56")
INK = colors.HexColor("#1A1A1A")

# 3. Styles
body = ParagraphStyle("body", fontName="VN", fontSize=11, leading=16.5,
                      alignment=TA_JUSTIFY, spaceAfter=8, textColor=INK)
h1 = ParagraphStyle("h1", fontName="VN-Bold", fontSize=24, leading=30,
                    textColor=ACCENT, spaceAfter=16)
h2 = ParagraphStyle("h2", fontName="VN-Bold", fontSize=15, leading=20,
                    textColor=INK, spaceBefore=14, spaceAfter=8)
quote = ParagraphStyle("quote", fontName="VN", fontSize=12, leading=18,
                       textColor=ACCENT, leftIndent=14, spaceBefore=10,
                       spaceAfter=10)

def callout(text):
    """Box highlight cho đoạn quan trọng"""
    t = Table(`[[Paragraph(text, body)]]`, colWidths=[160*mm])
    t.setStyle(TableStyle([
        ("BACKGROUND", (0,0), (-1,-1), colors.HexColor("#F0F7F4")),
        ("BOX", (0,0), (-1,-1), 0.5, ACCENT),
        ("LEFTPADDING", (0,0), (-1,-1), 12),
        ("RIGHTPADDING", (0,0), (-1,-1), 12),
        ("TOPPADDING", (0,0), (-1,-1), 10),
        ("BOTTOMPADDING", (0,0), (-1,-1), 10),
    ]))
    return t

def footer(canvas, doc):
    canvas.saveState()
    canvas.setFont("VN", 8)
    canvas.setFillColor(colors.HexColor("#888888"))
    canvas.drawCentredString(A4[0]/2, 15*mm, str(doc.page))
    canvas.restoreState()

# 4. Dựng nội dung
story = []
story.append(Paragraph("TÊN EBOOK", h1))
story.append(Paragraph("Phụ đề nói rõ điểm A sang điểm B", body))
story.append(PageBreak())

story.append(Paragraph("Phần 1. Tư duy", h1))
story.append(Paragraph("Nội dung chương...", body))
story.append(callout("Câu quan trọng cần nhấn mạnh."))
story.append(Paragraph("Câu chốt đáng nhớ.", quote))

# 5. Xuất file
doc = SimpleDocTemplate("ebook.pdf", pagesize=A4,
                        leftMargin=25*mm, rightMargin=25*mm,
                        topMargin=25*mm, bottomMargin=25*mm)
doc.build(story, onFirstPage=footer, onLaterPages=footer)
```

### Nếu người dùng muốn file DOCX để tự sửa

Dùng `python-docx`. Ưu điểm: họ tự chỉnh chữ được sau này. Nhược: layout kém tinh hơn PDF.

Lưu ý khi làm DOCX: thứ tự thẻ viền phải là top, left, bottom, right (sai thứ tự thì file hỏng, Word báo lỗi mở). Ảnh chèn vào phải khai đúng đuôi định dạng.

## Ngày 5 chiều: chỉnh đến khi ưng

File đầu tiên chắc chắn có chỗ chưa vừa mắt. Bình thường. Chỉnh 3 đến 5 vòng là ưng.

Những thứ hay phải chỉnh:
- Màu chưa hợp ý → đổi mã màu
- Bìa chưa đẹp → mô tả lại bố cục muốn
- Chữ chật → tăng giãn dòng hoặc giảm cỡ chữ
- Box callout chìm → đổi màu nền, thêm viền

Mỗi vòng chỉnh chỉ mất vài phút vì chỉ sửa thông số rồi chạy lại. Đây là lý do cách này thắng Canva.

## Ngày 6 sáng: ba quà tặng

Càng nhiều quà đi kèm, giá trị cảm nhận càng cao, chốt đơn càng dễ. Ba loại nên có:

**Quà 1 - Template thực hành.** File để khách áp dụng ngay nội dung trong ebook. Excel, Google Sheets, hoặc Notion. Giá trị cao mà dễ tạo.

**Quà 2 - Bộ prompt AI.** 20 đến 50 prompt sẵn dùng liên quan chủ đề. Format chuẩn cho mỗi prompt: mục đích, prompt, ví dụ đầu ra.

**Quà 3 - Checklist tổng hợp.** Một trang, tóm các bước quan trọng nhất. Khách in ra dán tường, tick từng mục.

Làm quà tặng cùng style, cùng màu với ebook chính để bộ sản phẩm trông đồng bộ.

## Ngày 6 chiều: bộ mô tả sản phẩm

Cần cho trang bán hàng, email, bài đăng. Làm một lần dùng nhiều chỗ.

```
Tôi có bộ sản phẩm số gồm [tên ebook] và 3 quà tặng đi kèm.
Hãy viết:

1. Tagline 1 câu (10-15 chữ) thu hút chú ý
2. Mô tả ngắn 50 chữ cho social media
3. Mô tả trung bình 200 chữ cho email
4. Mô tả dài 500-800 chữ cho landing page
5. Tiêu đề hấp dẫn cho 5 phần lớn của trang bán hàng

Bối cảnh: sản phẩm dạy [chủ đề], cho [đối tượng cụ thể], giải quyết
[vấn đề chính], dẫn đến [điểm B].
```

Lưu tất cả vào một file. Ngày 7 và cả quá trình bán sau này đều dùng.

**Tiêu chí xong ngày 5-6:** có file PDF hoàn chỉnh có bìa; có 3 quà tặng; có bộ mô tả 5 nội dung; tất cả đồng bộ style và hiển thị đúng tiếng Việt có dấu.
