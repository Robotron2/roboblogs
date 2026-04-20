import sys
from PIL import Image

def trim_with_tolerance(im, tol=15):
    bg_color = im.getpixel((0,0))
    # Create mask of pixels that are NOT the background color
    # using a tolerance threshold
    diff_data = []
    has_content = False
    
    bbox_left = im.size[0]
    bbox_top = im.size[1]
    bbox_right = 0
    bbox_bottom = 0
    
    for y in range(im.size[1]):
        for x in range(im.size[0]):
            p = im.getpixel((x,y))
            # Check if pixel differs from bg_color significantly
            diff = sum(abs(p[i] - bg_color[i]) for i in range(3))
            if diff > tol:
                bbox_left = min(bbox_left, x)
                bbox_top = min(bbox_top, y)
                bbox_right = max(bbox_right, x)
                bbox_bottom = max(bbox_bottom, y)
                has_content = True
                
    if has_content:
        padding = 10
        p_bbox = (
            max(0, bbox_left - padding),
            max(0, bbox_top - padding),
            min(im.size[0], bbox_right + padding),
            min(im.size[1], bbox_bottom + padding)
        )
        return im.crop(p_bbox)
    return im

for file_path in sys.argv[1:]:
    try:
        im = Image.open(file_path).convert("RGBA")
        old_size = im.size
        im = trim_with_tolerance(im, tol=30)
        im.save(file_path)
        print(f"Trimmed {file_path} from {old_size} to {im.size}")
    except Exception as e:
        print(f"Error {file_path}: {e}")
