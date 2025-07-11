import { Button, Checkbox, Typography } from "@material-ui/core";
import React, { useEffect, useState } from "react";
// import ProfileIcon from "../../../images/EmailIcon/inboxprofileicon.png";
import useStyles from "../../../../../styles";
import { decryptData } from "../../../../../crypto";
import axios from "axios";

function Inbox({ handleMailOpen, Data }) {
  const classes = useStyles();
  const decryptedToken = decryptData(sessionStorage.getItem("token"));
  const [checkedItems, setCheckedItems] = useState([]);
  const handleCheckboxChange = (id) => {
    setCheckedItems((prevState) =>
      prevState.includes(id)
        ? prevState.filter((item) => item !== id)
        : [...prevState, id]
    );
  };

  const handleDelete = () => {
    axios({
      method: "DELETE",
      url: `${process.env.REACT_APP_API_BASE_URL}/v1/b2b/mail/inbox`,
      headers: {
        Authorization: `Bearer ${decryptedToken}`,
      },
      data: {
        ids: checkedItems,
      },
    }).then(
      (response) => {
        console.log("Delete response:", response.data);
      },
      (error) => {
        console.error("Delete request failed:", error.response?.data?.message);
      }
    );
  };

  return (
    <div className={` ${classes.pagescroll} ${classes.h54vh}`}>
      <div
        className={`${classes.dflex} ${classes.justifyflexend} ${classes.mr1_5} ${classes.py1}`}
      >
        <Button
          className={`${classes.deletebtn}`}
          onClick={handleDelete}
          disabled={checkedItems.length === 0}
        >
          Delete
        </Button>
      </div>

      {Data.map((data, i) => (
        <div
          className={`${classes.dflex} ${classes.w100} ${classes.justifyspacebetween} ${classes.alignitemscenter} ${classes.bggrey1} ${classes.p1}`}
        >
          <div className={`${classes.w10}`}>
            <Checkbox
              checked={checkedItems.includes(data.id)}
              onChange={() => handleCheckboxChange(data.id)}
            />
          </div>
          <Button
            className={`${classes.dflex} ${classes.w90} ${classes.justifyspacebetween} ${classes.alignitemscenter} ${classes.texttransformcapitalize} `}
            onClick={() => handleMailOpen(data)}
            key={i}
          >
            <div className={`${classes.dflex} ${classes.w30}`}>
              <img
                className={`${classes.mr0_5}`}
                src={data.image}
                alt="img"
                width="23px"
                height="23px"
              />
              <Typography
                className={` ${classes.fontsize1} ${
                  data.read === "unread" && classes.fw600
                } ${classes.textoverflowhidden}`}
              >
                {data.name}
              </Typography>
              {data.read === "unread" && (
                <Typography
                  className={`${classes.textcolorgreen} ${classes.textuppercase} ${classes.fontsize2} ${classes.borderradius6px} ${classes.bggrey} ${classes.py0_2x0_5}`}
                >
                  {data.tag}
                </Typography>
              )}
            </div>

            <div
              className={`${classes.dflex} ${classes.w40} ${classes.textoverflowhidden}`}
            >
              <Typography
                component="span"
                className={` ${classes.fontsize1} ${
                  data.read === "unread" && classes.fw600
                }`}
              >
                {data.title}
                <Typography
                  component="span"
                  className={`${classes.fontsize1} ${classes.textcolorgrey} ${classes.fw500} ${classes.ml0_5}`}
                >
                  {data.message.replace(/<[^>]+>/g, "")}
                </Typography>
              </Typography>
            </div>
            <div>
              <Typography
                className={` ${classes.fontsize1} ${classes.textcolorgrey}`}
              >
                {data.time}
              </Typography>
            </div>
          </Button>
        </div>
      ))}
    </div>
  );
}

export default Inbox;
