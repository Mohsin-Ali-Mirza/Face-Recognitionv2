import os
import csv
from tkinter import Tk, Label, Button, filedialog
from PIL import Image, ImageTk
import pickle
import os

class ImageLabelingApp:
    def __init__(self, root, images_directory, csv_filename,processed_images,checkpoint_file):
        self.root = root
        self.images_directory = images_directory
        self.csv_filename = csv_filename
        self.checkpoint_file = checkpoint_file
        self.processed_images = processed_images

        self.image_paths = []
        self.current_index = 0

        self.label_yolo = Label(root, text="Yolo Model")
        self.label_opencv = Label(root, text="OpenCV Model")
        self.label_dlib = Label(root, text="Dlib Model")

        self.button_yes = Button(root, text="Yes", command=self.on_yes_button)
        self.button_no = Button(root, text="No", command=self.on_no_button)
        self.button_skip = Button(root, text="Skip", command=self.on_skip_button)

        self.load_images()
        self.display_image()

    def load_images(self):
        if os.path.exists(self.checkpoint_file):
            with open(self.checkpoint_file, 'rb') as f:
                self.processed_images = pickle.load(f)
                print("Loaded {} already processed images".format(len(self.processed_images)))
                # print(len(self.processed_images))
        for root, dirs, files in os.walk(self.images_directory):
            for file in files:
                if file.lower().endswith(('.png', '.jpg', '.jpeg', '.gif')):
                    if os.path.join(root, file) in self.processed_images:
                        continue
                    self.image_paths.append(os.path.join(root, file))

    def display_image(self):
        if 0 <= self.current_index < len(self.image_paths):
            image_path = self.image_paths[self.current_index]
            self.processed_images.add(image_path) 
            print(len(self.processed_images))
            # print(image_path)
            image = Image.open(image_path)
            image = image.resize((300, 300), Image.Resampling.LANCZOS)
            photo = ImageTk.PhotoImage(image)

            self.label_yolo.grid(row=0, column=0)
            self.label_opencv.grid(row=0, column=1)
            self.label_dlib.grid(row=0, column=2)

            self.button_yes.grid(row=1, column=0)
            self.button_no.grid(row=1, column=1)
            self.button_skip.grid(row=1, column=2)

            self.label_yolo.image = photo
            self.label_opencv.image = photo
            self.label_dlib.image = photo

            self.label_yolo.configure(image=photo)
            self.label_opencv.configure(image=photo)
            self.label_dlib.configure(image=photo)

            self.root.title(f"Image Labeling - {os.path.basename(image_path)} - {image_path}")



    def on_yes_button(self):
        self.update_csv("Yes")
        self.next_image()

    def on_no_button(self):
        self.update_csv("No")
        self.next_image()

    def on_skip_button(self):
        self.update_csv("None")
        self.next_image()

    def update_csv(self, label):
        current_image_path = self.image_paths[self.current_index]
        model_name = os.path.basename(current_image_path).split('_')[0]
        row = [current_image_path, "None", "None", "None"]
        if model_name == "yolo":
            row[1] = label
        elif model_name == "opencv":
            row[2] = label
        elif model_name == "dlib":
            row[3] = label
        

        # print(len(self.processed_images))
        with open(self.csv_filename, 'a', newline='') as csvfile:
            csv_writer = csv.writer(csvfile)
            csv_writer.writerow(row)
        print(len(self.processed_images))

        
           


    def next_image(self):
        self.current_index += 1
        self.clear_labels()
        self.display_image()
        # print(len(self.processed_images))
        with open(self.checkpoint_file, 'wb') as f:
            pickle.dump(self.processed_images, f)

    def clear_labels(self):
        self.label_yolo.grid_forget()
        self.label_opencv.grid_forget()
        self.label_dlib.grid_forget()
        self.button_yes.grid_forget()
        self.button_no.grid_forget()
        self.button_skip.grid_forget()




if __name__ == "__main__":
    root = Tk()
    root.geometry("900x400")
    root.title("Image Labeling App")

    images_directory = filedialog.askdirectory(title="Select Images Directory")
    csv_filename = filedialog.asksaveasfilename(
        title="Select or Create CSV File",
        defaultextension=".csv",
        filetypes=[("CSV files", "*.csv")]
    )

    with open(csv_filename, 'a', newline='') as csvfile:
        csv_writer = csv.writer(csvfile)
        csv_writer.writerow(["imagepath", "Yolo Model", "OpenCv Model", "Dlib Model"])


        
    processed_images = set()
    checkpoint_file = "processed_images.pkl"

    

    app = ImageLabelingApp(root, images_directory, csv_filename,processed_images,checkpoint_file)
    root.mainloop()
