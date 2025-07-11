import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  ButtonGroup,
  Typography,
} from "@material-ui/core";
import CheckIcon from "@material-ui/icons/Check";
import CloseIcon from "@material-ui/icons/Close";
import useStyles from "../../../styles";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import makePayment from "../../../Utils/makePayment";
import { decryptData } from "../../../crypto";
import planData from "./planData";

const ViewUpgrade = ({ planName }) => {
  const classes = useStyles();
  const token = decryptData(sessionStorage.getItem("token"));

  const parsePlanName = (planName) => {
    const periodMapping = {
      "3 Month": "quarterly",
      "6 Month": "halfYearly",
      "12 Month": "yearly",
    };
    const planMapping = {
      Basic: "Basic Plan",
      Standard: "Standard Plan",
      Perimum: "Premium Plan",
    };

    const period = Object.keys(periodMapping).find((key) =>
      planName.includes(key)
    );
    const plan = Object.keys(planMapping).find((key) => planName.includes(key));

    return {
      selectedPeriod: period ? periodMapping[period] : "quarterly",
      selectedPlan: plan ? planMapping[plan] : "Basic Plan",
    };
  };

  const [selectedPeriod, setSelectedPeriod] = useState("");
  const [selectedPlan, setSelectedPlan] = useState("");
  const [planId, setPlanId] = useState("");

  const [initialPlan, setInitialPlan] = useState({ selectedPlan: "", selectedPeriod: "" });

  useEffect(() => {
    if (planName) {
      const initialSelections = parsePlanName(planName);
      setSelectedPeriod(initialSelections.selectedPeriod);
      setSelectedPlan(initialSelections.selectedPlan);
      setInitialPlan(initialSelections);
    }
  }, [planName]);

  const isSelected = (planName, featureName) => {
    const plan = planData.find((p) => p.name === planName);
    const feature = plan.features.find((f) => f.name === featureName);
    return feature && feature[selectedPeriod];
  };

  useEffect(() => {
    if (selectedPeriod === "quarterly") {
      if (selectedPlan === "Basic Plan") {
        setPlanId(2);
      }
      if (selectedPlan === "Standard Plan") {
        setPlanId(1);
      }
      if (selectedPlan === "Premium Plan") {
        setPlanId(3);
      }
    }
    if (selectedPeriod === "halfYearly") {
      if (selectedPlan === "Basic Plan") {
        setPlanId(5);
      }
      if (selectedPlan === "Standard Plan") {
        setPlanId(8);
      }
      if (selectedPlan === "Premium Plan") {
        setPlanId(9);
      }
    }
    if (selectedPeriod === "yearly") {
      if (selectedPlan === "Basic Plan") {
        setPlanId(6);
      }
      if (selectedPlan === "Standard Plan") {
        setPlanId(7);
      }
      if (selectedPlan === "Premium Plan") {
        setPlanId(10);
      }
    }
  }, [selectedPeriod, selectedPlan]);

  const handlePeriodClick = (period) => {
    setSelectedPeriod(period);
  };

  const handlePlanClick = (plan) => {
    setSelectedPlan(plan);
  };

  const handleOnlinePayment = () => {
    makePayment(
      {
        plan_id: planId,
      },
      token
    );
  };
  
  return (
    <div
      className={`${classes.bgwhite} ${classes.mt1} ${classes.maxh76} ${classes.pagescroll}`}
    >
      <TableContainer
        className={`${classes.mt1} ${classes.upgradetable}`}
        component={Paper}
      >
        <Table
          className={`${classes.w85} ${classes.m0auto}`}
          aria-label="simple table"
        >
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              {planData.map((plan) => (
                <TableCell
                  key={plan.name}
                  align="center"
                  className={`${
                    selectedPlan === plan.name ? classes.selectedPlan : ""
                  } ${classes.fontsize6} ${classes.fw600} ${classes.w20}`}
                >
                  {plan.name}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {planData[0].features.map((feature, index) => (
              <TableRow key={index}>
                <TableCell component="th" scope="row">
                  {feature.name}
                </TableCell>
                {planData.map((plan) => (
                  <TableCell
                    key={plan.name}
                    align="center"
                    className={`${
                      selectedPlan === plan.name ? classes.selectedPlan : ""
                    }
                      ${classes.w20} `}
                  >
                    {typeof isSelected(plan.name, feature.name) ===
                    "boolean" ? (
                      isSelected(plan.name, feature.name) ? (
                        <CheckIcon />
                      ) : (
                        <CloseIcon />
                      )
                    ) : (
                      isSelected(plan.name, feature.name)
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <div
        className={`${classes.dflex} ${classes.justifyflexend} ${classes.mr3}`}
      >
        <div className={classes.w60}>
          <ButtonGroup
            className={`${classes.buttonGroup}`}
            // color="primary"
            aria-label="outlined primary button group"
          >
            <Button
              className={
                selectedPeriod === "quarterly" && classes.selectedMonth
              }
              onClick={() => handlePeriodClick("quarterly")}
            >
              Quarterly{" "}
              {selectedPeriod === "quarterly" && (
                <CheckCircleIcon className={classes.ml0_5} />
              )}
            </Button>
            <Button
              className={
                selectedPeriod === "halfYearly" && classes.selectedMonth
              }
              onClick={() => handlePeriodClick("halfYearly")}
            >
              Half Yearly{" "}
              {selectedPeriod === "halfYearly" && (
                <CheckCircleIcon className={classes.ml0_5} />
              )}
            </Button>
            <Button
              className={selectedPeriod === "yearly" && classes.selectedMonth}
              onClick={() => handlePeriodClick("yearly")}
            >
              Yearly{" "}
              {selectedPeriod === "yearly" && (
                <CheckCircleIcon className={classes.ml0_5} />
              )}
            </Button>
          </ButtonGroup>

          <div className={classes.priceTag}>
            {planData.map((plan) => (
              <Button
                onClick={() => handlePlanClick(plan.name)}
                variant="outlined"
                style={{ marginLeft: "10px" }}
                className={`${
                  selectedPlan === plan.name ? classes.selectedPriceTag : ""
                } ${classes.button}`}
              >
                <div>
                  <Typography className={`${classes.fontSize7}`}>
                    {plan.name}
                  </Typography>
                  <Typography
                    className={`${classes.fontsize6} ${classes.fw700}`}
                  >
                    ₹{plan.prices[selectedPeriod]}
                  </Typography>
                </div>
                <div>
                  {selectedPlan === plan.name && (
                    <CheckCircleIcon className={classes.ml0_5} />
                  )}
                </div>
              </Button>
            ))}
          </div>
          <div className={`${classes.dflex} ${classes.justifyflexend}`}>
            {selectedPlan !== initialPlan.selectedPlan || selectedPeriod !== initialPlan.selectedPeriod ? (
              <Button className={classes.bluebtn} onClick={handleOnlinePayment}>
                Continue With Selected Plan
              </Button>
            ) : (
              <Button className={classes.transparentbtn}>
                Already Purchased
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewUpgrade;
