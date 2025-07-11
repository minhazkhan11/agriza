import React, { useEffect, useState } from "react";
import useStyles from "../../../../../styles";
// import ProfileIcon from "../../../images/EmailIcon/inboxprofileicon.png";
import {
  Avatar,
  IconButton,
  MenuItem,
  Select,
  Typography,
} from "@material-ui/core";
import PrintOutlinedIcon from "@material-ui/icons/PrintOutlined";
import FileCopyOutlinedIcon from "@material-ui/icons/FileCopyOutlined";
import DeleteOutlinedIcon from "@material-ui/icons/DeleteOutlined";
import StarBorderOutlinedIcon from "@material-ui/icons/StarBorderOutlined";
import LocalOfferOutlinedIcon from "@material-ui/icons/LocalOfferOutlined";
import { decryptData } from "../../../../../crypto";
import axios from "axios";
import { toast } from "react-toastify";

function MailContent({value1}) {
  const classes = useStyles();
  const [value, setValue] = useState(1);
  const [singleMail, setSingleMail] = React.useState([]);
const fetchSingleMailData = async (id) => {
  const decryptedToken = decryptData(sessionStorage.getItem("token"));
  const onemailUrl = `${process.env.REACT_APP_API_BASE_URL}/v1/b2b/mail/inbox/${id}`;
  try {
    const response = await axios.get(onemailUrl, {
      headers: {
        Authorization: `Bearer ${decryptedToken}`,
      },
    });
    return response?.data;
  } catch (error) {
    console.error("Error fetching data: ", error);
  }
};

useEffect(() => {
  const fetchMailData = async () => {
    try {
      const data = await fetchSingleMailData(value1.id);
      if (data) {
        setSingleMail(data);
      }
    } catch (error) {
      console.error("Error fetching mail data: ", error);
      // You can also add error handling here, like displaying a message to the user
      toast.error("Failed to fetch mail data. Please try again later.");
    }
  };
  fetchMailData();
}, [value1.id]);

  const menuProps = {
    getContentAnchorEl: null,
    anchorOrigin: {
      vertical: "bottom",
      horizontal: "left",
    },
    disablePortal: true,
  };

  const formattedDate = (dateString) => {
    const date = new Date(dateString);
    const options = { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' };
    const formatted = date.toLocaleString('en-US', options);
    const day = date.getDate();
    const suffix = (day === 1 || day === 21 || day === 31) ? 'st' : (day === 2 || day === 22) ? 'nd' : (day === 3 || day === 23) ? 'rd' : 'th';
    return formatted.replace(/,/g, '') + suffix;
  };
  
  const formatted = formattedDate(value1?.date);

  return (
    <div
      className={`${classes.mt1} ${classes.p1} ${classes.pagescroll} ${classes.h54vh}`}
    >
      <div className={`${classes.dflex} ${classes.justifyspacebetween}`}>
        <div className={`${classes.dflex}`}>
          <Avatar alt="img" src={value1?.image} className={`${classes.mr0_5}`} />
          <div>
            <Typography
              className={`${classes.mr0_5} ${classes.fontsize1} ${classes.fw600} ${classes.lightblackcolor}`}
              component="span"
            >
             {value1?.name}
            </Typography>
            <Typography
              className={`${classes.mr0_5} ${classes.fontsize1} ${classes.ligthcolor}`}
              component="span"
            >
              {value1?.from}
            </Typography>
            <div>
              <Typography
                component="span"
                className={`${classes.mr0_5} ${classes.fontsize1} ${classes.ligthcolor}`}
              >
                To:
                <Select
                  className={`${classes.fontsize1} ${classes.ligthcolor} ${classes.selectEmpty}`}
                  labelId="category-label"
                  id="state"
                  value={value}
                  // onChange={handleChange}
                  displayEmpty
                  disableUnderline
                  MenuProps={menuProps}
                >
                  <MenuItem disabled value="">
                    <div className={classes.defaultselect}>select</div>
                  </MenuItem>
                  <MenuItem value={1}>me</MenuItem>
                </Select>
              </Typography>
              <Typography
                component="span"
                className={`${classes.mr0_5} ${classes.fontsize1} ${classes.ligthcolor}`}
              >
                {formatted}
              </Typography>
            </div>
          </div>
        </div>
        {/* <div>
          <IconButton className={`${classes.p6px}`}>
            <PrintOutlinedIcon />
          </IconButton>
          <IconButton className={`${classes.p6px}`}>
            <FileCopyOutlinedIcon />
          </IconButton>
          <IconButton className={`${classes.p6px}`}>
            <DeleteOutlinedIcon />
          </IconButton>
          <IconButton className={`${classes.p6px}`}>
            <StarBorderOutlinedIcon />
          </IconButton>
          <IconButton className={`${classes.p6px}`}>
            <LocalOfferOutlinedIcon />
          </IconButton>
        </div> */}
      </div>
      <div className={`${classes.mt1} ${classes.ml3}`}>
        <Typography
          variant="p"
          className={`${classes.mr0_5} ${classes.fontsize1} ${classes.ligthcolor}`}
          dangerouslySetInnerHTML={{ __html: value1.message }} >
        </Typography>
      </div>
    </div>
  );
}

export default MailContent;
