import React, { useEffect, useState } from "react";
import TableViewSearch from "../../CustomComponent/TableViewSearch";
import useStyles from "../../../styles";
import { ToastContainer } from "react-toastify";
import {
  Divider,
  InputAdornment,
  TextField,
  Typography,
} from "@material-ui/core";
import { Avatar, IconButton } from "@material-ui/core";
import { ReactComponent as VisibilityIcon } from "../../images/DashboardIcon/visibilityicon.svg";
import { ReactComponent as DeleteIcon } from "../../images/DashboardIcon/deleteicon.svg";
import Image from "../../images/DashboardIcon/avatar.png";
import { decryptData } from "../../../crypto";
import axios from "axios";

const Comments = () => {
  const classes = useStyles();

  const Heading = [
    {
      id: 1,
      // inputlable: "Enter Name / Code*",
      inputplaceholder: "Search By Name or ID",
      //   allcomments: "yes",
    },
  ];

  const dummyData = [
    {
      id: 1,
      title: "Steve Smith",
      subtitle: "On Divyanshi Panwar Comment",
      message:
        "Ask. 305 inspirational designs, illustrations, and graphic elements from the world's best designers. Want more inspiration? Browse our search results. Ask. 305 inspirational designs, illustrations, and graphic elements from the world's best designers. Want more inspiration? Browse our search results. Ask. 305 inspirational designs, illustrations, and graphic elements from the world's best designers. Want more inspiration? Browse our search results.",
      image: Image,
      time: "04h",
    },
    {
      id: 2,
      title: "Steve Smith",
      subtitle: "On Divyanshi Panwar Comment",
      message:
        "Ask. 305 inspirational designs, illustrations, and graphic elements from the world's best designers. Want more inspiration? Browse our search results. Ask. 305 inspirational designs, illustrations, and graphic elements from the world's best designers. Want more inspiration? Browse our search results. Ask. 305 inspirational designs, illustrations, and graphic elements from the world's best designers. Want more inspiration? Browse our search results.",
      time: "04h",
    },
    {
      id: 3,
      title: "Steve Smith",
      subtitle: "On Divyanshi Panwar Comment",
      message:
        "Ask. 305 inspirational designs, illustrations, and graphic elements from the world's best designers. Want more inspiration? Browse our search results. Ask. 305 inspirational designs, illustrations, and graphic elements from the world's best designers. Want more inspiration? Browse our search results. Ask. 305 inspirational designs, illustrations, and graphic elements from the world's best designers. Want more inspiration? Browse our search results.",
      image: Image,
      time: "04h",
    },
    {
      id: 4,
      title: "Steve Smith",
      subtitle: "On Divyanshi Panwar Comment",
      message:
        "Ask. 305 inspirational designs, illustrations, and graphic elements from the world's best designers. Want more inspiration? Browse our search results. Ask. 305 inspirational designs, illustrations, and graphic elements from the world's best designers. Want more inspiration? Browse our search results. Ask. 305 inspirational designs, illustrations, and graphic elements from the world's best designers. Want more inspiration? Browse our search results.",
      image: Image,
      time: "04h",
    },
    {
      id: 5,
      title: "Steve Smith",
      subtitle: "On Divyanshi Panwar Comment",
      message:
        "Ask. 305 inspirational designs, illustrations, and graphic elements from the world's best designers. Want more inspiration? Browse our search results. Ask. 305 inspirational designs, illustrations, and graphic elements from the world's best designers. Want more inspiration? Browse our search results. Ask. 305 inspirational designs, illustrations, and graphic elements from the world's best designers. Want more inspiration? Browse our search results.",
      image: Image,
      time: "04h",
    },
  ];
  const decryptedToken=decryptData(sessionStorage.getItem("token"))
  const [rows,setRows]=useState([]);
  const [searchQuery, setSearchQuery] = useState("");
 
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
        
        const formattedRows = response.data.doubtForumAnswers.map((row, index) => ({
          id: row.id ? row.id : "",
         
          title: row.question.addedBy.full_name?row.question.addedBy.full_name:"",
          subtitle: `${"On"} ${row.addedBy.full_name?row.addedBy.full_name:""} ${"Comment"}`,
          message: row.answer ? row.answer : "",
            
          image: row.question.addedBy.image_url? row.question.addedBy.image_url:"",
          time: row.created_at
          ? new Date(row.created_at).toLocaleDateString("en-US", {
              day: "numeric",
              month: "short",
              year: "numeric"
            })
          : "",
        }));
        setRows(formattedRows);
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
  const filteredRows = (rows || []).filter((row) => {
    const searchString = searchQuery.toLowerCase();
    return Object.values(row).some(
      (value) => value && value.toString().toLowerCase().includes(searchString)
    );
  });
  const handleSearch = (searchQuery) => {
    setSearchQuery(searchQuery);
  };
  return (
    <>
      <ToastContainer />
      <div
        className={`${classes.bgwhite}  ${classes.alignitemsend}  ${classes.inputpadding} ${classes.inputborder} ${classes.boxshadow3}  ${classes.mt1}`}
      >
        <TableViewSearch Heading={Heading}onSearch={handleSearch} />
        <Divider className={` ${classes.bg535353}`} />
        <div >
          <div
            className={`${classes.bgwhite}  ${classes.pagescroll} ${classes.p0_5}  ${classes.borderradius6px}`}
          >
            <div className={`${classes.h61vh} ${classes.pagescroll}`}>
              {filteredRows.map((data, i) => (
                <>
                  <div
                    className={`${classes.dflex} ${classes.justifyaround} ${classes.mt1} ${classes.px1} `}
                  >
                    <div key={i} className={`${classes.w10}`}>
                      <Avatar alt="img.." src={data.image} width="100%"/>
                    </div>
                    <div className={`${classes.w90}`}>
                      <div
                        className={`${classes.dflex} ${classes.justifyspacebetween} ${classes.alignitemscenter}`}
                      >
                        <div>
                          <Typography
                            className={`${classes.fontsize4}  ${classes.fw500} ${classes.textblack} ${classes.fontFamilyJost}`}
                          >
                           {data?.title}
                          </Typography>
                          <Typography
                            className={`${classes.ligthcolor}  ${classes.fw400} ${classes.fontSize08} ${classes.fontFamilyJost}`}
                          >
                            {data.subtitle}
                          </Typography>
                        </div>
                        <div>
                          <Typography
                            className={`${classes.lightbrowncolor} ${classes.fontFamilyJost} ${classes.fontSize10}`}
                          >
                            {data.time}
                          </Typography>
                        </div>
                      </div>
                      <Typography
                        className={`${classes.mt0_5}  ${classes.fontfamilyDMSans} ${classes.fontsize3} ${classes.fw400} ${classes.textcolor7676} ${classes.fw400}`}
                        dangerouslySetInnerHTML={{ __html: data.message }} >

                      </Typography>
                      <div>
                        <IconButton className={`${classes.p0}`}>
                          <VisibilityIcon />
                        </IconButton>
                        <IconButton>
                          <DeleteIcon />
                        </IconButton>
                      </div>
                    </div>
                  </div>
                  <Divider className={` ${classes.bg535353}`} />
                </>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Comments;
