from PIL import Image

img = Image.open('src/assets/images/hero-bg.png')
w, h = img.size

# We will print a grid of 80x20 characters representing the brightness in the bottom half of the image
# to visualize the car's shape.
cols = 80
rows = 24

start_y = int(h * 0.5)
end_y = h

y_step = (end_y - start_y) // rows
x_step = w // cols

chars = " .:-=+*#%@"

for r in range(rows):
    row_str = ""
    y = start_y + r * y_step
    for c in range(cols):
        x = c * x_step
        if x >= w or y >= h:
            continue
        pixel = img.getpixel((x, y))
        r_val, g_val, b_val = pixel[:3]
        brightness = 0.299*r_val + 0.587*g_val + 0.114*b_val
        char_idx = min(int(brightness / 25.5), 9)
        row_str += chars[char_idx]
    print(row_str)
