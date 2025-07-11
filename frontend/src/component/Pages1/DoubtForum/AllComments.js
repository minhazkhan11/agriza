import React, { useEffect, useState } from "react";
import PageHeader from "../PageHeader";
import useStyles from "../../../styles";
import { ReactComponent as DoubtForumIcon } from "../../images/doutforumimage/dooutformicon.svg";
import { ReactComponent as BackIcon } from "../../images/pageheadingicon/backicon.svg";
import Comments from "./Comments";
import axios from "axios";
import { decryptData } from "../../../crypto";


const AllComments = () => {
  const classes = useStyles();
  const decryptedToken=decryptData(sessionStorage.getItem("token"))
 const [length,setLength]=useState("");
  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/v1/b2b/doubtforum/answers/all`,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      );
      if (response.data.success) {
        setLength(response.data.doubtForumAnswers.length)
       
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
  const Heading = [
    {
      id: 1,
      pageicon: <DoubtForumIcon />,
      mainheading: `All Comments (${length})`,
      addbtntext: "Back",
      addbtnicon: <BackIcon />,
      addbtnstyle: "transparentbtn",
      path: "/admin/doubtforum",
    },
  ];

  return (
    <>
      <div className={`${classes.p2} ${classes.pb0}`}>
        <PageHeader Heading={Heading} />
        <Comments />
      </div>
    </>
  );
};

export default AllComments;
