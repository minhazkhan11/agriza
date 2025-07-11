import React, { useRef, useState, useEffect } from "react";
import useStyles from "../../../styles";
import imagePath from "../../images/profile/Photo.png";
import { ReactComponent as EditIcon } from "../../images/profile/edit.svg";
import axios from "axios";
import { decryptData } from "../../../crypto";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

const ImageUploadComponent = ({ fetchDataFromAPI }) => {
  const classes = useStyles();
  const fileInputRef = useRef();
  const decryptedToken = decryptData(sessionStorage.getItem("token"));
  const [profileImage, setProfileImage] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  const handleIconClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      // Convert file to data URL to display it
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
        uploadImage(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await axios.put(
        `${process.env.REACT_APP_API_BASE_URL}/v1/b2b/profile/update`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        toast.success("Image uploaded successfully!");
        fetchData();
        // Additional success handling
      } else {
        toast.error("Failed to upload image.");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Error in uploading image.");
    }
  };

  const fetchData = async () => {
    const response = await fetchDataFromAPI(decryptedToken);

    if (response.status === 200) {
      const { user } = response.data;
      setProfileImage(user.image_url);
      console.log("user.image_url", user.image_url);
    } else {
      console.log("Data not found");
    }
  };

  useEffect(() => {
    fetchData();
  }, [decryptedToken]);

  const imageStyle = {
    width: "170px",
    height: "120px",
    borderRadius: "12px",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.25)",
  };

  return (
    <>
      <ToastContainer />
      <div className={classes.positionrelative}>
        <img
          src={
            selectedFile
              ? selectedFile
              : profileImage
              ? profileImage
              : imagePath
          }
          alt="Profile"
          style={imageStyle}
        />
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: "none" }}
        />
        <button
          className={`${classes.bgnone} ${classes.bordernone} ${classes.editposition}`}
          onClick={handleIconClick}
        >
          <EditIcon />
        </button>
      </div>
    </>
  );
};

export default ImageUploadComponent;
