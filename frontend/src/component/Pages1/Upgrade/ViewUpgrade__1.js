import React, { useState, useEffect } from "react";
import useStyles from "../../../styles";
import Typography from "@material-ui/core/Typography";
import { decryptData } from "../../../crypto";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import CheckIcon from "@material-ui/icons/Check";
import CloseIcon from "@material-ui/icons/Close";
import { Button, Tab, Tabs } from "@material-ui/core";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import makePayment from "../../../Utils/makePayment";

function ViewUpgrade() {
  const classes = useStyles();
  const style = [
    {
      style: "viewtable",
      height: "maxh60",
    },
  ];
  const planData = [
    {
      id: 1,
      name: "Course And Batch Management Course And Batch",
      basic: true,
      standard: true,
      premium: true,
    },
    {
      id: 2,
      name: "Learner And Teacher Management rfgrff",
      basic: true,
      standard: true,
      premium: false,
    },
    {
      id: 3,
      name: "Assign Teacher",
      basic: true,
      standard: true,
      premium: false,
    },
    {
      id: 1,
      name: "Course And Batch Management",
      basic: true,
      standard: true,
      premium: true,
    },
    {
      id: 2,
      name: "Learner And Teacher Management erwerwrw e",
      basic: true,
      standard: true,
      premium: false,
    },
    {
      id: 3,
      name: "Assign Teacher",
      basic: true,
      standard: true,
      premium: false,
    },
  ];
  // const planData2 = [
  //   {
  //     id: 1,
  //     name: "Course And Batch Management Course ",
  //     basic: [
  //       {
  //         three_month: true,
  //         six_month: true,
  //         twelve_month: true
  //       }
  //     ],
  //     standard:  [
  //       {
  //         three_month: true,
  //         six_month: true,
  //         twelve_month: true
  //       }
  //     ],
  //     premium:  [
  //       {
  //         three_month: true,
  //         six_month: true,
  //         twelve_month: true
  //       }
  //     ],
  //   },
  //   {
  //     id: 2,
  //     name: "Learner And Teacher Management",
  //     basic: true,
  //     standard: true,
  //     premium: false,
  //   },
  //   {
  //     id: 3,
  //     name: "Assign Teacher",
  //     basic: true,
  //     standard: true,
  //     premium: false,
  //   },
  //   {
  //     id: 1,
  //     name: "Course And Batch Management",
  //     basic: true,
  //     standard: true,
  //     premium: true,
  //   },
  //   {
  //     id: 2,
  //     name: "Learner And Teacher Management ",
  //     basic: true,
  //     standard: true,
  //     premium: false,
  //   },
  //   {
  //     id: 3,
  //     name: "Assign Teacher",
  //     basic: true,
  //     standard: true,
  //     premium: false,
  //   },
  // ];
  const [forceUpdate, setForceUpdate] = useState(false);
  const [validity, setValidity] = useState("Quaterly");
  const [plan, setPlan] = useState("Basic");
  const [planid, setPlanId] = useState("");

  const handleChangeValidity = (event, newValue) => {
    setValidity(newValue);
    console.log(validity, "plan");
  };

  console.log('planid' , planid , validity , plan)
  
  const handleChangePlan = (event, newValue) => {
    const currentValidity = validity;
    setPlan(newValue);
    console.log(newValue, "plan");
    setForceUpdate(!forceUpdate);

    if (currentValidity === "Quarterly") {
      if (plan === "Basic") {
        setPlanId(2);
      }
      if (plan === "Standard") {
        setPlanId(1);
      }
      if (plan === "Premium") {
        setPlanId(3);
      }
    }
    if (currentValidity === "Half Yearly") {
      if (plan === "Basic") {
        setPlanId(5);
      }
      if (plan === "Standard") {
        setPlanId(8);
      }
      if (plan === "Premium") {
        setPlanId(9);
      }
    }
    if (currentValidity === "Yearly") {
      if (plan === "Basic") {
        setPlanId(6);
      }
      if (plan === "Standard") {
        setPlanId(7);
      }
      if (plan === "Premium") {
        setPlanId(10);
      }
    }
  };

  const token = decryptData(sessionStorage.getItem("token"));
  const handleOnlinePayment = () => {
   
    makePayment(
      {
        plan_id: planid,
      },
      token
    );
  };

  return (
    <>
      <ToastContainer />
      <div
        className={`${classes.bgwhite} ${classes.pagescroll} ${classes.maxh76} ${classes.boxshadow3} ${classes.borderradius6px} ${classes.mt1} ${classes.p2}`}
      >
        <div className={`${classes.w85} ${classes.m0auto}`}>
          <div
            className={`${classes.dflex} ${classes.justifyspacebetween} ${classes.alignitemsend}`}
          >
            <div className={`${classes.w40}`}>
              {planData.map((data) => (
                <Typography
                  className={`${classes.fontsize6} ${classes.fw500} ${classes.p0_5} ${classes.lineheight2} ${classes.textoverflow}`}
                >
                  {data?.name}
                </Typography>
              ))}
            </div>
            <div
              className={`${plan === "Basic" && classes.selectedplan} ${
                classes.dflex
              } ${classes.flexdirectioncolumn} ${classes.justifyspacebetween} ${
                classes.w20
              }`}
            >
              <Typography
                className={`${classes.fontsize5} ${classes.fw600} ${classes.textaligncenter} ${classes.my1}`}
              >
                Basic
              </Typography>
              {planData.map((data) => (
                <div className={`${classes.p0_5} ${classes.textaligncenter}`}>
                  {data?.basic ? <CheckIcon /> : <CloseIcon />}
                </div>
              ))}
            </div>
            <div
              className={`${plan === "Standard" && classes.selectedplan} ${
                classes.dflex
              } ${classes.flexdirectioncolumn} ${classes.justifyspacebetween} ${
                classes.w20
              }`}
            >
              <Typography
                className={`${classes.fontsize5} ${classes.fw600} ${classes.textaligncenter} ${classes.my1}`}
              >
                Standard
              </Typography>
              {planData.map((data) => (
                <div className={`${classes.p0_5} ${classes.textaligncenter}`}>
                  {data?.standard ? <CheckIcon /> : <CloseIcon />}
                </div>
              ))}
            </div>
            <div
              className={`${plan === "Premium" && classes.selectedplan} ${
                classes.dflex
              } ${classes.flexdirectioncolumn} ${classes.justifyspacebetween} ${
                classes.w20
              }`}
            >
              <Typography
                className={`${classes.fontsize5} ${classes.fw600} ${classes.textaligncenter} ${classes.my1}`}
              >
                Premium
              </Typography>
              {planData.map((data) => (
                <div className={`${classes.p0_5} ${classes.textaligncenter}`}>
                  {data?.premium ? <CheckIcon /> : <CloseIcon />}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div
          className={`${classes.w85} ${classes.m1auto} ${classes.dflex} ${classes.justifyflexend}`}
        >
          <Tabs
            value={validity}
            indicatorColor="primary"
            textColor="primary"
            onChange={handleChangeValidity}
            className={`${classes.upgradetabs}`}
            aria-label="disabled tabs example"
            TabIndicatorProps={{ hidden: true }}
          >
            <Tab
              value="Quaterly"
              label={
                <>
                  Quaterly{" "}
                  {validity === "Quaterly" && (
                    <CheckCircleIcon className={classes.ml0_5} />
                  )}
                </>
              }
            />
            <Tab
              value="Half Yearly"
              label={
                <>
                  Half Yearly{" "}
                  {validity === "Half Yearly" && (
                    <CheckCircleIcon className={classes.ml0_5} />
                  )}
                </>
              }
            />
            <Tab
              value="Yearly"
              label={
                <>
                  Yearly{" "}
                  {validity === "Yearly" && (
                    <CheckCircleIcon className={classes.ml0_5} />
                  )}
                </>
              }
            />
          </Tabs>
        </div>
        <div
          className={`${classes.w85} ${classes.m1auto} ${classes.dflex} ${classes.justifyflexend}`}
        >
          <Tabs
            value={plan}
            indicatorColor="primary"
            textColor="primary"
            onChange={handleChangePlan}
            className={` ${classes.upgradebutton} ${classes.wrapperalignend}`}
            aria-label="disabled tabs example"
            TabIndicatorProps={{ hidden: true }}
          >
            <Tab
              value="Basic"
              label={
                <>
                  <div>
                    <Typography className={`${classes.fontSize7}`}>
                      Basic
                    </Typography>
                    <Typography
                      className={`${classes.fontsize6} ${classes.fw700}`}
                    >
                      {validity === "Quaterly"
                        ? "₹3000"
                        : validity === "Half Yearly"
                        ? "₹6000"
                        : "₹10200"}
                    </Typography>
                  </div>
                  <div>
                    {plan === "Basic" && (
                      <CheckCircleIcon className={classes.ml0_5} />
                    )}
                  </div>
                </>
              }
            />
            <Tab
              value="Standard"
              label={
                <>
                  <div>
                    <Typography className={`${classes.fontSize7}`}>
                      Standard
                    </Typography>
                    <Typography
                      className={`${classes.fontsize6} ${classes.fw700}`}
                    >
                      {validity === "Quaterly"
                        ? "₹4500"
                        : validity === "Half Yearly"
                        ? "₹9000"
                        : "₹25200"}
                    </Typography>
                  </div>
                  <div>
                    {plan === "Standard" && (
                      <CheckCircleIcon className={classes.ml0_5} />
                    )}
                  </div>
                </>
              }
            />
            <Tab
              value="Premium"
              label={
                <>
                  <div>
                    <Typography className={`${classes.fontSize7}`}>
                      Premium
                    </Typography>
                    <Typography
                      className={`${classes.fontsize6} ${classes.fw700}`}
                    >
                      {validity === "Quaterly"
                        ? "₹25500"
                        : validity === "Half Yearly"
                        ? "₹51000"
                        : "₹100200"}
                    </Typography>
                  </div>
                  <div>
                    {plan === "Premium" && (
                      <CheckCircleIcon className={classes.ml0_5} />
                    )}
                  </div>
                </>
              }
            />
          </Tabs>
        </div>
        <div
          className={`${classes.w85} ${classes.m1auto} ${classes.dflex} ${classes.justifyflexend}`}
        >
          <Button className={classes.bluebtn} onClick={handleOnlinePayment}>
            Continue With Selected Plan
          </Button>
        </div>
      </div>
    </>
  );
}
export default ViewUpgrade;
