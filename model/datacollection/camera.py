import cv2
import time

class Camera:
    def __init__(self, x_res, y_res):
        # Create an object to read  
        # from camera 
        self.video = cv2.VideoCapture(0) 
        
        # We need to check if camera 
        # is opened previously or not 
        if (self.video.isOpened() == False):  
            print("Error reading video file") 
        
        # We need to set resolutions. 
        # so, convert them from float to integer. 
        frame_width = int(self.video.get(x_res)) 
        frame_height = int(self.video.get(y_res)) 
        
        self.size = (frame_width, frame_height)
    
    def record(self, run_var):
        # Below VideoWriter object will create 
        # a frame of above defined The output  
        # is stored in 'filename.avi' file. 
        result = cv2.VideoWriter('filename.avi',  
                                cv2.VideoWriter_fourcc(*'MJPG'), 
                                10, self.size) 
            
        while not run_var:
            time.sleep(0.2)
            print("ye")
        while run_var: 
            ret, frame = self.video.read() 
            print("ya")
            if ret == True:  
        
                # Write the frame into the 
                # file 'filename.avi' 
                result.write(frame) 
        
                # Display the frame 
                # saved in the file 
                cv2.imshow('Frame', frame) 
        
                # Press Q on keyboard  
                # to stop the process 
                if cv2.waitKey(1) & 0xFF == ord('q'): 
                    break        
            # Break the loop 
            else: 
                break
        
        # When everything done, release  
        # the video capture and video  
        # write objects 
        video.release() 
        result.release() 
            
        # Closes all the frames 
        cv2.destroyAllWindows()

if __name__ == "__main__":
    pass