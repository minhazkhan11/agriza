import React from "react";
import useStyles from "../../styles";
import { ReactComponent as BackIcon } from "../images/pageheadingicon/backicon.svg";
import { Button, Typography } from "@material-ui/core";
import { useNavigate } from "react-router-dom";

function QuestionHead({ Heading = [] }) { 
  
  const classes = useStyles();
  const navigate = useNavigate();


  return (
    <>
    {Heading && Heading.map((data)=>(
    <div
      className={`${classes.p1} ${classes.bgwhite} ${classes.boxshadow3} ${classes.dflex} ${classes.justifyspacebetween} ${classes.alignitemscenter}`}
    >
      {data.logo && <div className={`${classes.w10}`}>
        <img src={data.logo} alt="img" width="100%" />
      </div>}
      <div
        className={`${data.path ? classes.w65 : classes.w100} ${classes.dflex} ${classes.justifyspacebetween} ${classes.alignitemscenter}`}
      >
      {data.headings.map((heading)=>(
        <div className={` ${classes.w30}`}>
          <div className={`${classes.boxshadow5} ${classes.px1} ${classes.py0_5} ${classes.borderradius6px}`}>
            <Typography
              variant="h3"
              gutterBottom
              className={`${classes.fontsize1} ${classes.fontfamilyDMSans} ${classes.fw700}`}
            >
              {heading.label}
            </Typography>
            
            <Typography
              variant="h3"
              className={`${classes.fontsize1} ${classes.fontfamilyDMSans} ${classes.fw400}`}
            >
              {heading.content}
            </Typography>
          </div>
          
        </div>
        ))}
      </div>
      {data.path && <div className={classes.btnContainer}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate(data.path)}
          className={classes.transparentbtn}
        >
          <BackIcon />
          Back
        </Button>
      </div>}
    </div>
    
    ))}
    </>
  );
}
export default QuestionHead;
