import React from "react";
import useStyles from "../../../../../styles";
import {
  Avatar,
  Divider,
  IconButton,
  Button,
  Typography,
} from "@material-ui/core";
import KeyboardArrowRightIcon from "@material-ui/icons/KeyboardArrowRight";
import { useNavigate } from "react-router-dom";
import NoDataFoundImage from "../../../../images/commonicon/nodatafoundimage.jpg";

function DoubtForum({ dashboardData }) {
  const classes = useStyles();
  const navigate = useNavigate();

  return (
    <div
      className={`${classes.bgwhite} ${classes.h600px} ${classes.pagescroll} ${classes.p0_5} ${classes.boxshadow1} ${classes.borderradius6px}`}
    >
      <div
        className={`${classes.dflex} ${classes.justifyspacebetween} ${classes.alignitemscenter}`}
      >
        <Typography
          className={`${classes.my1} ${classes.fontfamilyoutfit} ${classes.fontsize5} ${classes.fw700}`}
        >
          Doubt Forum
        </Typography>
        <Button
          className={`${classes.viewallbtn}`}
          onClick={() => navigate(`/admin/doubtforum`)}
        >
          View All <KeyboardArrowRightIcon style={{ fontSize: "medium" }} />
        </Button>
      </div>
      <div>
        { dashboardData && dashboardData?.length !== 0 ? (
          dashboardData?.map((data, i) => (
            <>
              <div
                className={`${classes.dflex} ${classes.justifyspacebetween} ${classes.alignitemscenter}`}
              >
                <div key={i} className={`${classes.w20}`}>
                  <Avatar alt="img.." src={data?.user?.image_url} />
                </div>
                <div className={`${classes.w80}`}>
                  <div
                    className={`${classes.dflex} ${classes.justifyspacebetween} ${classes.alignitemscenter}`}
                  >
                    <div>
                      <Typography
                        className={`${classes.fontfamilyoutfit} ${classes.fontsize4} ${classes.fw600}`}
                      >
                        {data?.user?.full_name}
                      </Typography>
                      {/* <Typography
                      className={`${classes.fontfamilyoutfit} ${classes.fontsize2} ${classes.fw500}`}
                    >
                      On Divyanshi Panwar Comment
                    </Typography> */}
                    </div>
                    {/* <div>
                    <IconButton className={`${classes.p0_2}`}><VisibilityIcon /></IconButton>
                    <IconButton className={`${classes.p0_2}`}><DeleteIcon /></IconButton>
                  </div> */}
                  </div>
                  <Typography
                    className={`${classes.mt0_5} ${classes.mb1}  ${classes.fontfamilyoutfit} ${classes.fontsize3} ${classes.fw500} ${classes.textcolorgrey}`}
                    dangerouslySetInnerHTML={{ __html: data?.question }}
                  />
                </div>
              </div>
              {i !== dashboardData.length - 1 && (
                <Divider className={`${classes.mb0_5}`} />
              )}
            </>
          ))
        ) : (
          <div
            className={`${classes.dflex} ${classes.justifycenter} ${classes.mt50per}`}
          >
            <img style={{ opacity: "0.8" }} src={NoDataFoundImage} alt="img" />
          </div>
        )}
      </div>
    </div>
  );
}

export default DoubtForum;
