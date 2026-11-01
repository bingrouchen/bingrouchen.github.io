"""
自动压缩图片 / Automatic image compression
把 images 文件夹里过大的图片缩小到最长边 2000 像素并压缩，文件名和格式保持不变。
Shrinks oversized images in the images folder to 2000px on the longest side and
recompresses them, keeping the same file name and format.
"""
import os
import sys
from PIL import Image, ImageOps

ROOT = "images"
MAX_SIDE = 2000          # 最长边 / longest side, px
SKIP_UNDER = 450_000     # 小于这个大小且尺寸不超的不处理 / leave files below this size alone (bytes)
JPEG_QUALITY = 84
EXTS = {".jpg", ".jpeg", ".png", ".webp"}

changed = []
for folder, _, files in os.walk(ROOT):
    for name in files:
        ext = os.path.splitext(name)[1].lower()
        if ext not in EXTS:
            continue
        path = os.path.join(folder, name)
        before = os.path.getsize(path)
        try:
            im = Image.open(path)
            im = ImageOps.exif_transpose(im)
        except Exception as e:
            print(f"skip {path}: {e}")
            continue
        too_big = max(im.size) > MAX_SIDE
        if not too_big and before < SKIP_UNDER:
            continue
        if too_big:
            im.thumbnail((MAX_SIDE, MAX_SIDE), Image.LANCZOS)
        tmp = path + ".tmp"
        if ext in (".jpg", ".jpeg"):
            im.convert("RGB").save(tmp, "JPEG", quality=JPEG_QUALITY, optimize=True, progressive=True)
        elif ext == ".webp":
            im.save(tmp, "WEBP", quality=JPEG_QUALITY, method=6)
        else:
            im.save(tmp, "PNG", optimize=True)
        after = os.path.getsize(tmp)
        if too_big or after < before * 0.95:
            os.replace(tmp, path)
            changed.append(path)
            print(f"{path}: {before // 1024} KB -> {after // 1024} KB, {im.size[0]}x{im.size[1]}")
        else:
            os.remove(tmp)

print(f"{len(changed)} image(s) compressed")
sys.exit(0)
