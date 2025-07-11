import React, { useState, useEffect, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Button,
  Fade,
  FormControl,
  FormLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  endAdornment
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useStyles from "../../../../styles";
import { Avatar, Divider, IconButton } from "@material-ui/core";
import Image from "../../../images/DashboardIcon/avatar.png";
import { ReactComponent as VisibilityIcon } from "../../../images/DashboardIcon/visibilityicon.svg";
import { ReactComponent as DeleteIcon } from "../../../images/DashboardIcon/deleteicon.svg";
import clsx from "clsx";
import InputAdornment from "@material-ui/core/InputAdornment";
import TelegramIcon from '@material-ui/icons/Telegram';
import { decryptData } from "../../../../crypto";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import Quill styles




function Commentpopup(props) {
  const { open, handleOpenClose, fetchData, info } = props;
  const classes = useStyles();
  const decryptedToken=decryptData(sessionStorage.getItem("token"))
  const [data,setData]=useState("");
  const [commit,setCommit]=useState([]);
  const quillRef = useRef(null);
  const [answer, setAnswer] = useState("");
  const [image, setImage] = useState("");

 


  const handleCancel = () => {
    handleOpenClose();
  };

  const menuProps = {
    getContentAnchorEl: null,
    anchorOrigin: {
      vertical: "bottom",
      horizontal: "left",
    },
    disablePortal: true,
  };
  const fetchData1 = async (info) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/v1/b2b/doubtforum/${info}`,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      );
      if (response.data.success) {
        setData(response.data?.doubtForum[0]);
        setCommit(response.data?.doubtForum?.[0]?.question_commit || []);
      } else {
        console.error("API request failed");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData1(info);
  }, [info]);
  const modules = {
    toolbar: [
      [
        "bold",
        "italic",
        "underline",
        "strike",
        { script: "sub" },
        { script: "super" },
        { color: [] },
        { background: [] },
      ],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image"],
      ["code-block"],
    ],
  };

  const formats = [
    "header",
    "font",
    "size",
    "list",
    "bold",
    "italic",
    "underline",
    "strike",
    "color",
    "background",
    "script",
    "link",
    "blockquote",
    "code-block",
    "align",
    "image",
  ];
  const handleChange = (content, delta, source, editor) => {
    if (source === "user") {
      const imageDelta = delta.ops.find((op) => op.insert && op.insert.image);
      if (imageDelta) {
        const imageBase64 = imageDelta.insert.image;
        const base64WithoutPrefix = imageBase64.split(";base64,")[1];
        const binaryString = atob(base64WithoutPrefix);
        const arrayBuffer = new ArrayBuffer(binaryString.length);
        const uint8Array = new Uint8Array(arrayBuffer);
        for (let i = 0; i < binaryString.length; i++) {
          uint8Array[i] = binaryString.charCodeAt(i);
        }
        const blob = new Blob([uint8Array], { type: "image/jpeg" });
        const file = new File([blob], "image.jpg", { type: "image/jpeg" });
        console.log(file, "okokok");
        setImage(file);

        const imageTag = `<img src="${imageBase64}" alt="Inserted Image" />`;
        setAnswer((prevQuestion) => prevQuestion + imageTag);
        return;
      }
      setAnswer(editor.getHTML()); 
      console.log(answer, "okokok");
    }
  };

  const handleFormSubmit = async () => {
    if (!answer) {
      toast.error("Insert Your Commit");
      return;
    }

    try {
      const user = {
        doubtForumAnswer: {
          answer: answer,
          question_id: info,
        },
      };

      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/v1/b2b/doubtforum/comments/add`,
        user,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
            // "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        toast.success("Commit created successfully!");
        fetchData1();
      } else {
        toast.error("Commit is not created !");
      }
    } catch (error) {
      console.error("An error occurred:", error);
      toast.error(error.response.data.message || "Commit is not created !");
    }
    handleOpenClose();
  };


  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <Fade in={open}>
        <div className={`${classes.doubtforumpopup} ${classes.p1}`}>
          <div
            className={`${classes.bgwhite} ${classes.borderradius6px}`}
          >
            <Typography
              className={` ${classes.fontfamilyoutfit} ${classes.fontsize5} ${classes.textblack} ${classes.fw400}   `}
            >
              Reported Comments ({commit.length})
            </Typography>
            <Divider className={`${classes.mb0_5}`} />

            <div className={`${classes.h46vh} ${classes.pagescroll}`}>
              
              
                  <div
                    className={`${classes.dflex} ${classes.justifyspacebetween} ${classes.mt1} ${classes.px1} `}
                  >
                    <div  className={`${classes.w10}`}>
                      <Avatar alt="img.." src={data?.addedBy?.image_url} />
                    </div>
                    <div className={`${classes.w85}`}>
                      <div
                        className={`${classes.dflex} ${classes.justifyspacebetween} ${classes.alignitemscenter}`}
                      >
                        <div>
                          <Typography
                            className={`${classes.fontfamilyoutfit} ${classes.fontsize4} ${classes.fw600}`}
                          >
                            {data?.addedBy?.full_name}
                          </Typography>
                        </div>
                        <div>
                          <Typography
                            className={`${classes.lightbrowncolor} ${classes.fontFamilyJost} ${classes.fontSize10}`}
                          >
                             {new Date(data.created_at).toLocaleDateString(
                              "en-US",
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              }
                            )}
                          </Typography>
                        </div>
                      </div>
                      Q.
                      <Typography
                        className={`${classes.m0_5}  ${classes.fontfamilyoutfit} ${classes.fontsize3} ${classes.fw500} ${classes.textcolorgrey} ${classes.fw400}`}
                        variant="h3"
                        dangerouslySetInnerHTML={{ __html: data.question }}
                      >
                      </Typography>
                      <div>
                        <IconButton className={`${classes.p0}`}>
                          <VisibilityIcon />
                        </IconButton>
                        <IconButton className={`${classes.p0}`}>
                          <DeleteIcon />
                        </IconButton>
                      </div>
                    </div>
                  </div>
              
            <div className={`${classes.h46vh} ${classes.pagescroll}`}>
              {commit.map((data, i) => (
                <>
                  <div
                    className={`${classes.dflex} ${classes.justifyspacebetween} ${classes.mt1} ${classes.px1} `}
                  >
                    <div key={i} className={`${classes.w10}`}>
                      <Avatar alt="img.."  src={data.addedBy.image_url} />
                    </div>
                    <div className={`${classes.w85}`}>
                      <div
                        className={`${classes.dflex} ${classes.justifyspacebetween} ${classes.alignitemscenter}`}
                      >
                        <div>
                          <Typography
                            className={`${classes.fontfamilyoutfit} ${classes.fontsize4} ${classes.fw600}`}
                          >
                            {data.addedBy.full_name}
                          </Typography>
                        </div>
                        <div>
                          <Typography
                            className={`${classes.lightbrowncolor} ${classes.fontFamilyJost} ${classes.fontSize10}`}
                          >
                          {new Date(data.created_at).toLocaleDateString(
                                "en-US",
                                {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                }
                              )}
                          </Typography>
                        </div>
                      </div>
                      <Typography
                        className={`${classes.m0_5}  ${classes.fontfamilyoutfit} ${classes.fontsize3} ${classes.fw500} ${classes.textcolorgrey} ${classes.fw400}`}
                        dangerouslySetInnerHTML={{ __html: data.answer }}
                        >
                      </Typography>
                      <div>
                        <IconButton className={`${classes.p0}`}>
                          <VisibilityIcon />
                        </IconButton>
                        <IconButton className={`${classes.p0}`}>
                          <DeleteIcon />
                        </IconButton>
                      </div>
                    </div>
                  </div>
                </>
              ))}
            </div>

            </div>
            <div className={classes.positionrelative}>
            <ReactQuill
                ref={quillRef}
                value={answer}
                onChange={handleChange}
                modules={modules}
                formats={formats}
                className={classes.placeholder}
                placeholder="Start asking answer"
                style={{ width: "100%" }}
              />
                <Button
                onClick={handleFormSubmit}
                className={`${classes.editposition} ${classes.p0_5}`}
                style={{ alignSelf: "end", marginTop: "0.5rem" }}
              >
                Answer
              </Button>
            </div>
            
          </div>
        </div>
      </Fade>
    </>
  );
}

export default Commentpopup;
