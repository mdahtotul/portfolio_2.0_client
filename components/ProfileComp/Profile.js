// import SimpleFormButton from "@/components/SimpleButton/SimpleFormButton";
import { useStateContext } from "@/context/ContextProvider";
import defaultImage from "@/public/images/def_review.png";
import { UPDATE_USER_DETAILS } from "@/services/graphql/mutation";
import { failedToast, successToast } from "@/services/utils/toasts";
import { singleUpload } from "@/services/utils/uploadFunc";
import styles from "@/styles/Profile.module.css";
import { useMutation } from "@apollo/client";
import Image from "next/image";
import { useState } from "react";
import { MdClose, MdEdit } from "react-icons/md";
import Switch from "react-switch";

const Profile = ({ userData }) => {
  const { currentColor, darkTheme } = useStateContext();
  const [avatarFile, setAvatarFile] = useState(null);
  const [updateComp, setUpdateComp] = useState(false);

  const [formData, setFormData] = useState({
    name: userData?.name,
    email: userData?.email,
    avatar: "",
    dialCode: "",
    designation: "",
    phone: "",
    cloudinary_id: "",
  });

  const [updateUser] = useMutation(UPDATE_USER_DETAILS);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "avatar" && files) {
      setAvatarFile(e.target.files[0]);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleReset = () => {
    setFormData({
      name: "",
      avatar: "",
      dialCode: "",
      designation: "",
      phone: "",
      cloudinary_id: "",
    });
    setAvatarFile(null);
    document.getElementById("avatar").value = "";
  };

  const handleImageHandler = async (e) => {
    e.preventDefault();
    try {
      if (avatarFile) {
        const uploadedData = await singleUpload(avatarFile);
        successToast(darkTheme, "Image updated successfully");

        await updateProfileHandler(
          uploadedData?.secure_url,
          uploadedData?.public_id
        );
        successToast(darkTheme, "Profile updated successfully!");
        handleReset();
      } else {
        const data = await updateProfileHandler();
        console.log("db data", data);
        successToast(darkTheme, "Profile updated successfully!");
        handleReset();
      }
    } catch (err) {
      console.log("Error at handleImageHandler", err);
      failedToast(darkTheme, err.message);
    }
  };

  const updateProfileHandler = async (avatarURL = "", cloudinaryID = "") => {
    // e.preventDefault();
    try {
      const newData = {
        name: formData?.name || userData?.name,
        avatar: avatarURL || formData?.avatar || userData?.avatar,
        dialCode: formData?.dialCode || userData?.dialCode,
        designation: formData?.designation || userData?.designation,
        phone: formData?.phone || userData?.phone,
        cloudinary_id:
          cloudinaryID || formData?.cloudinary_id || userData?.cloudinary_id,
      };
      const { data } = await updateUser({
        variables: {
          id: userData?.id,
          input: newData,
        },
      });
      console.log("update data", data);
      return data;
    } catch (err) {
      console.log("Error at updateProfileHandler", err);
      failedToast(darkTheme, err.message);
    }
  };

  // css conditionalMode for dark mode
  const conditionalMode = darkTheme ? styles.dark : styles.light;
  return (
    <div className={`${conditionalMode} ${styles.profile_wrapper}`}>
      {!updateComp ? (
        <>
          <div className={styles.form_wrapper}>
            <div className={styles.upper_div_wrapper}>
              <div className={styles.avatar_div}>
                <Image
                  src={userData?.avatar || defaultImage}
                  layout="fill"
                  alt="Profile Image"
                />
              </div>
            </div>
            <div className={styles.input_div_wrapper}>
              <div className={styles.input_div}>
                <p>{userData?.name}</p>
              </div>
              <div className={styles.input_div}>
                <p>{userData?.email}</p>
              </div>
              <div className={styles.input_div}>
                <p>
                  {userData?.dialCode}
                  {userData?.phone}
                </p>
              </div>
              <div className={styles.input_div}>
                <p>{userData?.designation}</p>
              </div>
            </div>
          </div>
        </>
      ) : (
        // update profile form
        <>
          <form className={styles.form_wrapper} onSubmit={handleImageHandler}>
            <div className={styles.input_field}>
              <input
                onChange={handleChange}
                type="file"
                name="avatar"
                id="avatar"
              />
            </div>
            <div className={styles.input_field}>
              <label htmlFor="name">Name</label>
              <input
                style={{
                  color: currentColor,
                }}
                type="text"
                id="name"
                name="name"
                defaultValue={formData.name}
                disabled
              />
            </div>
            <div className={styles.input_field}>
              <label htmlFor="email">Email</label>
              <input
                style={{
                  color: currentColor,
                }}
                type="text"
                id="email"
                name="email"
                defaultValue={formData.email}
                disabled
              />
            </div>
            <div className={styles.input_field}>
              <label htmlFor="phone">Phone</label>
              <input
                style={{
                  color: currentColor,
                }}
                type="text"
                id="phone"
                name="phone"
                defaultValue={formData.phone}
                disabled
              />
            </div>
            <div className={styles.input_field}>
              <label htmlFor="designation">Designation</label>
              <input
                style={{
                  color: currentColor,
                }}
                type="text"
                id="designation"
                name="designation"
                defaultValue={formData.designation}
                disabled
              />
            </div>
            <input type="submit" value="Upload" />
          </form>
        </>
      )}

      <div className={styles.edit_div}>
        <p>Edit profile ?</p>{" "}
        <Switch
          checked={updateComp}
          onChange={() => setUpdateComp((prev) => !prev)}
          offColor={!darkTheme ? "#fff" : "#3c3e41"}
          onColor={!darkTheme ? "#d1d9e6" : "#3c3e41"}
          offHandleColor={currentColor}
          onHandleColor={darkTheme ? "#fff" : "#3c3e41"}
          uncheckedIcon={<MdEdit className={styles.edit_icon} />}
          checkedIcon={<MdClose className={styles.edit_icon} />}
        />
      </div>
    </div>
  );
};

export default Profile;
