import { useState } from "react";
import ImageCropPicker from "react-native-image-crop-picker";
import { Alert } from "react-native";

export type ImageType = {
  uri: string;
  type?: string;
  name?: string;
};

const useImagePicker = () => {
  const [selectedImage, setSelectedImage] = useState<ImageType | undefined>(
    undefined
  );

  const showImagePickerOptions = () => {
    Alert.alert(
      "Choose Image Source",
      "Select an image from",
      [
        {
          text: "Camera",
          onPress: openCameraForDP,
        },
        {
          text: "Gallery",
          onPress: openGalleryForDP,
        },
        {
          text: "Cancel",
          style: "destructive",
        },
      ],
      { cancelable: true }
    );
  };

  const openCameraForDP = () => {
    ImageCropPicker.openCamera({
      width: 300,
      height: 400,
      cropping: true,
    }).then((image) => {
      console.log(image);
      const filename = image.path.split("/").pop();

      const imageObj = {
        uri: image.path,
        type: image.mime,
        name: filename,
      };
      setSelectedImage(imageObj);
    });
  };

  const openGalleryForDP = () => {
    ImageCropPicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
    }).then((image) => {
      console.log(image);
      const filename = image.path.split("/").pop();

      const imageObj = {
        uri: image.path,
        type: image.mime,
        name: filename,
      };
      setSelectedImage(imageObj);
    });
  };

  return {
    selectedImage,
    setSelectedImage,
    openCameraForDP,
    openGalleryForDP,
    showImagePickerOptions,
  };
};

export default useImagePicker;
