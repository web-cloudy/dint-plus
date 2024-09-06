import { Images } from "assets/images";
import { FONTS } from "constants";
import { COLORS } from "constants/Colors";
import React, { useState } from "react";
import {
    TouchableOpacity,
    Image,
    StyleSheet,
    View,
    Text,
    Modal,
    Platform,
} from "react-native";
import ImagePicker from "react-native-image-crop-picker";
import { PERMISSIONS, RESULTS, request, check } from "react-native-permissions";
import { ms } from "react-native-size-matters";

const VideoPicker = ({
    onPress,
    cropping,
    circular = true,
    mediaType = "video",
    icon,
}) => {
    const [modalVisible, setModalVisible] = useState(false);

    const handleImagePicker = async (isCamera) => {
        try {
            let image;
            if (isCamera) {
                // Open camera
                image = await ImagePicker.openCamera({
                    width: 500,
                    height: 500,
                    cropping: false,
                    compressImageMaxWidth: 1000,
                    compressImageMaxHeight: 1000,
                    compressImageQuality: 1,
                    compressVideoPreset: "MediumQuality",
                    includeExif: true,
                    mediaType,
                    // multiple: true,
                });
            } else {
                // Open photo library
                image = await ImagePicker.openPicker({
                    width: 500,
                    height: 500,
                    cropping: false,
                    compressImageMaxWidth: 1000,
                    compressImageMaxHeight: 1000,
                    compressImageQuality: 1,
                    compressVideoPreset: "MediumQuality",
                    includeExif: true,
                    mediaType,
                    // multiple: true,
                });
            }
            onPress(image);
            setModalVisible(false); // Close the modal after selecting an image
        } catch (error) {
            console.log("Error picking video:", error);
        }
    };

    const requestPermission = async () => {
        await request(
            Platform.OS === "ios"
                ? PERMISSIONS.IOS.PHOTO_LIBRARY
                : PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE
        );

        await request(
            Platform.OS === "ios"
                ? PERMISSIONS.IOS.CAMERA
                : PERMISSIONS.ANDROID.CAMERA
        );

        handleImagePicker(false);
    };


    return (
        <View>
            <TouchableOpacity
                style={styles.imgBtnContainer}
                onPress={() => {
                    requestPermission();
                }}
            >
                <View style={styles.uploadImgContainer}>
                    <Image source={Images.UploadVideo} style={styles.uploadImg} />
                </View>
                <Text style={styles.uploadVideoText}>{'UploadVideo'}</Text>
            </TouchableOpacity>

            <Modal
                transparent
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    onPress={() => setModalVisible(false)}
                />
                <View style={styles.modalContent}>
                    <View style={styles.modal_main_view}>
                        <View style={styles.mb_10}>
                            <Text style={styles.select_img_txt}>Select Image</Text>
                        </View>
                        <TouchableOpacity
                            style={styles.modal_btn_view}
                            onPress={() => handleImagePicker(true)}
                        >
                            <Image source={Images.CameraIcon} style={styles.camera_img} />
                            <Text style={styles.modal_btn_txt}>Take Photo...</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.modal_btn_view}
                            onPress={() => handleImagePicker(false)}
                        >
                            <Image source={Images.FolderIcon} style={styles.folder_img} />
                            <Text style={styles.modal_btn_txt}>Choose from Library...</Text>
                        </TouchableOpacity>
                        <View style={styles.cancel_btn_view}>
                            <TouchableOpacity onPress={() => setModalVisible(false)}>
                                <Text style={styles.cancel_btn_txt}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default VideoPicker;

const styles = StyleSheet.create({
    imgBtnContainer: {
        alignItems: "center",
        borderColor: COLORS.GreyTextBorder,
        borderWidth: ms(1),
        borderRadius: ms(8),
        padding: ms(15),
        paddingHorizontal: ms(30),
        // paddingVertical: ms(30),
        backgroundColor: COLORS.LightBlack,
        marginTop: ms(5),
    },
    uploadImgContainer: {
        backgroundColor: COLORS.LightBlack,
        padding: ms(8),
        borderRadius: ms(20),
    },
    uploadImg: {
        height: ms(20),
        width: ms(20),
    },
    uploadVideoText: {
        color: COLORS.TextInputPlaceholder,
        fontFamily: FONTS.robotoRegular,
        fontSize: ms(12),
        marginTop: ms(0),
    },
    modalContent: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    modal_main_view: {
        backgroundColor: COLORS.White,
        borderRadius: ms(10),
        padding: ms(20),
        paddingHorizontal: ms(40),
        shadowColor: COLORS.Black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    mb_10: {
        marginBottom: ms(10),
    },
    select_img_txt: {
        textAlign: "center",
        fontSize: ms(16),
        fontFamily: FONTS.robotoMedium,
        color: COLORS.Black,
        fontWeight: "500",
    },
    modal_btn_view: {
        flexDirection: "row",
        marginVertical: ms(5),
        alignItems: "center",
    },
    camera_img: {
        width: ms(22),
        height: ms(22),
        alignSelf: "center",
        marginRight: ms(5),
        tintColor: COLORS.Black,
    },
    modal_btn_txt: {
        fontSize: ms(15),
        fontFamily: FONTS.robotoMedium,
        fontWeight: "500",
        color: COLORS.Black,
        alignSelf: "center",
    },
    folder_img: {
        width: ms(20),
        height: ms(20),
        alignSelf: "center",
        marginLeft: ms(1.5),
        marginRight: ms(6.5),
        tintColor: COLORS.Black,
    },
    cancel_btn_view: {
        flexDirection: "row",
        justifyContent: "flex-end",
        marginTop: ms(10),
        // borderWidth: 1,
    },
    cancel_btn_txt: {
        fontSize: ms(13),
        fontFamily: FONTS.robotoMedium,
        color: COLORS.Black,
    },
    modalOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: COLORS.ModalBackground,
    },
});