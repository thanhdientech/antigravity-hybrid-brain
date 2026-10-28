import os
import struct
import zlib

def create_simple_png(width, height, color):
    # Minimal valid PNG generator without PIL dependency
    def chunk(tag, data):
        return struct.pack('>I', len(data)) + tag + data + struct.pack('>I', zlib.crc32(tag + data) & 0xffffffff)

    raw_data = b''
    r, g, b, a = color
    line = b'\x00' + bytes([r, g, b, a]) * width
    raw_data = line * height

    png = b'\x89PNG\r\n\x1a\n'
    png += chunk(b'IHDR', struct.pack('>IIBBBBB', width, height, 8, 6, 0, 0, 0))
    png += chunk(b'IDAT', zlib.compress(raw_data))
    png += chunk(b'IEND', b'')
    return png

icons_dir = os.path.join(os.path.dirname(__file__), "icons")
os.makedirs(icons_dir, exist_ok=True)

# Neon Cyan/Purple theme for Antigravity
color = (0, 229, 255, 255) # Cyan

for size in [16, 48, 128]:
    png_data = create_simple_png(size, size, color)
    file_path = os.path.join(icons_dir, f"icon{size}.png")
    with open(file_path, "wb") as f:
        f.write(png_data)
    print(f"[+] Created {file_path}")
