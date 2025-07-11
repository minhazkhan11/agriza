import React from "react";
import { Avatar, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import useStyles from "../../../../../styles";
import PersonIcon from '@material-ui/icons/Person';


function CustomerDetail({orders}) {
  const classes = useStyles();
  return (
    <>
      <div className={` ${classes.borderradius10px} ${classes.border1999} ${classes.p1}`}>
        <div className={`${classes.dflex} ${classes.alignitemscenter}`}>
          <div className={`${classes.borderradius50} ${classes.border1999} ${classes.dflex} ${classes.alignitemscenter} ${classes.justifycenter}`}>
          {orders?.user?.image_url ? <Avatar src={orders?.user?.image_url} alt="img" /> : <PersonIcon />}
          </div>
          <Typography
          className={`${classes.fontfamilyoutfit} ${classes.fontsize4} ${classes.fw400} ${classes.lineheightnormal} ${classes.textaligncenter} ${classes.ml1}`}
           variant="h4">{orders?.user?.full_name}</Typography>
        </div>
        <div className={`${classes.dflex} ${classes.mt0_5}`}>
          <Typography
          className={`${classes.fontfamilyoutfit} ${classes.fontsize1} ${classes.fw400} ${classes.lineheightnormal} ${classes.textaligncenter}`}
           variant="h5">Email: </Typography>
          <Typography
          className={`${classes.fontfamilyoutfit} ${classes.fontsize1} ${classes.fw400} ${classes.wordbreakall} ${classes.lineheightnormal} ${classes.textaligncenter} ${classes.ml0_5}`}
           variant="h6">{orders?.user?.email}</Typography>
        </div>

        <div className={`${classes.dflex} ${classes.mt0_5}`}>
          <Typography
          className={`${classes.fontfamilyoutfit} ${classes.fontsize1} ${classes.fw400} ${classes.lineheightnormal} ${classes.textaligncenter}`}
           variant="h5">Contact:</Typography>{" "}
          <Typography
          className={`${classes.fontfamilyoutfit} ${classes.fontsize1} ${classes.fw400} ${classes.lineheightnormal} ${classes.textaligncenter} ${classes.ml0_5}`}
           variant="h6"> {orders?.user?.phone}</Typography>
        </div>
        {orders?.user?.delivery_address &&
        <div className={`${classes.dflex} ${classes.flexdirectioncolumn} ${classes.mt0_5}`}>
          <Typography
          className={`${classes.fontfamilyoutfit} ${classes.fontsize1} ${classes.fw600} `}
           variant="h4"> Shipping Address</Typography>

          <Typography 
          className={`${classes.fontfamilyoutfit} ${classes.fontsize1} ${classes.fw400} ${classes.lineheightnormal}`}
          variant="h6">
            {orders?.user?.delivery_address}
          </Typography>
        </div>
        }
      </div>
    </>
  );
}

export default CustomerDetail;
