from ultralytics import YOLO
import cv2
import os
import time
# Load the YOLO model
model = YOLO("yolov8n-face.pt")

# Specify the path to the folder containing the images
folder_path = "images"  # Replace with the actual path
image_files = os.listdir(folder_path)

# Define the desired image width and height
desired_width = 800
desired_height = 600

for image_file in image_files:
    image_path = os.path.join(folder_path, image_file)

    # Read the original image
    img = cv2.imread(image_path)
    results = model.predict(image_path)
    result = results[0]

    # Draw rectangles around detected objects
    for box in result.boxes:
        top_left_x = round(box.xyxy[0].tolist()[0])
        top_left_y = round(box.xyxy[0].tolist()[1])
        bottom_right_x = round(box.xyxy[0].tolist()[2])
        bottom_right_y = round(box.xyxy[0].tolist()[3])

        cv2.rectangle(img, (top_left_x, top_left_y), (bottom_right_x, bottom_right_y), (50, 200, 129), 2)

    resized_img = cv2.resize(img, (500, int(img.shape[0] * 500 / img.shape[1])), interpolation=cv2.INTER_AREA)
    cv2.imshow('img', resized_img)

    time.sleep(1)

    key = cv2.waitKey(1) & 0xFF

    if key == ord('q'):
        exit_flag = True
# Close any open windows
    cv2.destroyAllWindows()
