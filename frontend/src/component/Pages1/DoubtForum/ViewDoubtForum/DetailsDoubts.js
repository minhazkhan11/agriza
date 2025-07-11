import React, { useEffect, useState } from "react";
import useStyles from "../../../../styles";
import {ReactComponent as TotalDoubtsIcon} from "../../../images/doutforumimage/totaldoubtsicon.svg";
import {ReactComponent as PendingDoubtsIcon} from "../../../images/doutforumimage/pendingdoubtsicon.svg";
import { Typography } from "@material-ui/core";
import { decryptData } from "../../../../crypto";
import axios from "axios";

const DetailsDoubts = () => {
  const classes = useStyles();
  const [count,setCount]=useState("");
  const [doubt,setDoubtPending]=useState("");

  const fetchData = async () => {
    const decryptedToken = decryptData(sessionStorage.getItem("token"));

    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/v1/b2b/doubtforum`,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      );
      if (response.data.success) {
        setCount(response.data?.count);
        setDoubtPending(response.data?.doubt_pending);
        
      } else {
        console.error("API request failed");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <div
        className={`${classes.mt1} ${classes.px2} ${classes.py0_5} ${classes.bgwhite} ${classes.dflex}  ${classes.alignitemscenter}`}
      >
        <div className={`${classes.dflex} ${classes.alignitemscenter }`}>
            <TotalDoubtsIcon />&nbsp;&nbsp;
            <Typography
              className={`${classes.textcolorformlabel} ${classes.fontfamilyDMSans} ${classes.fontSize8}`}
            >
              Total Doubts :&nbsp;&nbsp;
              <Typography component="span" className={`${classes.textcolorformlabel} ${classes.fontFamilyJost} ${classes.fontSize12} ${classes.fw500 }`}>{count}</Typography>
            </Typography>
        </div>
        <div className={`${classes.dflex} ${classes.alignitemscenter } ${classes.ml5 }`}>
            <PendingDoubtsIcon />&nbsp;&nbsp;
            <Typography
              className={`${classes.textcolorformlabel} ${classes.fontfamilyDMSans} ${classes.fontSize8}`}
            >
             Pending Doubts :&nbsp;&nbsp;
              <Typography component="span"className={`${classes.textcolorformlabel} ${classes.fontFamilyJost} ${classes.fontSize12} ${classes.fw500 }`}>{doubt}</Typography>
            </Typography>
        </div>
      </div>
    </>
  );
};

export default DetailsDoubts;
