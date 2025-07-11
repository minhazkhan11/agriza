import React, { useEffect, useState } from "react";
import PageHeader from "../../PageHeader";
import { ReactComponent as LearnerIcon } from "../../../images/learnersimage/learnericon.svg";
import useStyles from "../../../../styles";
import AssignViewLearner from "./ViewAssignTeacher";
import { Button } from "@material-ui/core";
import { useNavigate } from "react-router-dom";
import { decryptData } from "../../../../crypto";
import axios from "axios";
import { toast } from "react-toastify";

function AssignLearner() {
  const classes = useStyles();
  const Heading = [
    {
      id: 1,
      pageicon: <LearnerIcon />,
      mainheading: "Assign Teacher",
    },
  ];

  const [anchorEl, setAnchorEl] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const decryptedToken = decryptData(sessionStorage.getItem("token"));
  const [learners, setLearners] = useState([]);
  const navigate = useNavigate();

  const [isCourseDropdownOpen, setIsCourseDropdownOpen] = useState(false);
  const [isBatchDropdownOpen, setIsBatchDropdownOpen] = useState(false);

  const handleCourseDropdownOpen = () => {
    setIsCourseDropdownOpen(true);
  };

  const handleCourseDropdownClose = () => {
    setIsCourseDropdownOpen(false);
  };

  const handleCourseChange = (event) => {
    setSelectedCourses(event.target.value);
    handleCourseDropdownClose(); // Close the dropdown after selection
  };

  const handleBatchDropdownOpen = () => {
    setIsBatchDropdownOpen(true);
  };

  const handleBatchDropdownClose = () => {
    setIsBatchDropdownOpen(false);
  };

  const handleBatchChange = (event) => {
    setSelectedBatch(event.target.value);
    handleBatchDropdownClose(); 
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/v1/b2b/teacher`,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      );
      setLearners(response.data.teachers);
      console.log(response.data.teachers, "newteacher");
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const rows = learners?.map((d, index) => ({
    id: d.id ? d.id : index, // Use d.id if available, otherwise use the index
    staff_id: d.id ? d.id : "N/A",
    staff_name: d.full_name ? d.full_name : "N/A",
    phone: d.phone ? d.phone : "N/A",
    email: d.email ? d.email : "N/A",
    course_name: d.role ? d.role : "N/A",
    created_at: d.created_at ? d.created_at : "N/A",
    active_status: d.active_status ? d.active_status : "N/A",
  }));

  const filteredRows = rows
    ? rows
        .filter((d) => {
          const isSearchMatch =
            (d.staff_id &&
              d.staff_id
                .toString()
                .toLowerCase()
                .includes(searchQuery.toLowerCase())) ||
            d.staff_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            d.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
            d.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            d.course_name.toLowerCase().includes(searchQuery.toLowerCase());

          return isSearchMatch;
        })
        .map((row, index) => ({
          ...row,
          srno: index + 1,
        }))
    : [];

  let [Id, setId] = useState("");
  const handleCheckboxClick = (selectedIDs) => {
    console.log("Selected IDs:", selectedIDs);
    setId(selectedIDs);
  };
  const columns = [
    {
      field: "staff_name",
      headerName: "Teacher Name",
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
      width: 200,
      flex: 1,
      sortable: true,
      disableColumnMenu: true,
      autoPageSize: false,
    },
    {
      field: "staff_id",
      headerName: "Teacher ID",
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
      width: 200,
      flex: 1,
      sortable: true,
      disableColumnMenu: true,
      autoPageSize: false,
    },
    {
      field: "phone",
      headerName: "Phone No.",
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
      width: 110,
      flex: 1,
      sortable: true,
      disableColumnMenu: true,
      autoPageSize: false,
    },
    {
      field: "email",
      headerName: "Email ID",
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
      width: 180,
      flex: 1,
      sortable: true,
      disableColumnMenu: true,
      autoPageSize: false,
    },
  ];



  const menuProps = {
    getContentAnchorEl: null,
    anchorOrigin: {
      vertical: "bottom",
      horizontal: "left",
    },
    disablePortal: true,
  };


  
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [cources, setCources] = useState([]);
  const fetchCources = async () => {
    try {
      const decryptedToken = decryptData(sessionStorage.getItem("token"));

      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/v1/b2b/course`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
            // Add other headers if needed
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setCources(data.courses);
        console.log(cources);
        console.log(data.courses, "courses");
      } else {
        console.error("Failed to fetch courses data");
      }
    } catch (error) {
      console.error("Error fetching courses data:", error);
    }
  };

  useEffect(() => {
    fetchCources();
  }, []);
  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState([]);
  useEffect(() => {
    const fetchBatches = async () => {
      try {
        const decryptedToken = decryptData(sessionStorage.getItem("token"));

        // Ensure selectedCourses is not empty before making the request
        if (selectedCourses.length > 0) {
          const response = await fetch(
            `${process.env.REACT_APP_API_BASE_URL}/v1/b2b/batch/by_course_ids/list`,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${decryptedToken}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                batch: {
                  course_ids: selectedCourses,
                },
              }),
            }
          );

          if (response.ok) {
            const data = await response.json();
            setBatches(data.batches);
          } else {
            console.error("Failed to fetch batches data:", response);
          }
        }
      } catch (error) {
        console.error("Error fetching batches data:", error);
      }
    };

    fetchBatches();
  }, [selectedCourses]); // Dependency array includes selectedCourses

  const handleStatus = () => {
    // Check if any teacher is not selected
    if (Id.length === 0) {
      toast.error("Please select at least one teacher.");
      return;
    }
    // Check if any course is not selected
    if (selectedCourses.length === 0) {
      toast.error("Please select at least one course.");
      return;
    }
    // Check if any batch is not selected
    if (selectedBatch.length === 0) {
      toast.error("Please select at least one batch.");
      return;
    }
    const data = {
      teacher: {
        ids: Id,
        course_ids: selectedCourses,
        batch_ids: selectedBatch,
      },
    };
    console.log(data, "data");

    axios
      .put(
        `${process.env.REACT_APP_API_BASE_URL}/v1/b2b/teacher/assign`,
        data,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      )
      .then((response) => {
        console.log("Teacher assigned successfully", response);
        fetchData();
        toast.success("Teacher assigned successfully");

        setTimeout(() => {
          navigate(`/admin/teacher`);
        }, 2000);

        handleClose();
      })
      .catch((error) => {
        console.error("Error assigning teacher:", error);
        toast.error("Teacher is not assigned");
      });
  };

  return (
    <div className={`${classes.p2} ${classes.pb0} ${classes.h91vh}`}>
      <PageHeader Heading={Heading} />

      <div
        className={`${classes.w100}  ${classes.mt0_5} ${classes.h79vh} ${classes.borderradius6px}`}
        // className={`${classes.bgwhite}  ${classes.dflex} ${classes.flexdirectioncolumn} ${classes.alignitemsend} ${classes.justifyspacebetween} ${classes.inputpadding} ${classes.inputborder} ${classes.boxshadow3} ${classes.borderradius6px}  ${classes.mt1}`}
      >
        <AssignViewLearner
          isCourseDropdownOpen={isCourseDropdownOpen}
          handleCourseDropdownOpen={handleCourseDropdownOpen}
          handleCourseDropdownClose={handleCourseDropdownClose}
          selectedCourses={selectedCourses}
          handleCourseChange={handleCourseChange}
          menuProps={menuProps}
          cources={cources}
          isBatchDropdownOpen={isBatchDropdownOpen}
          handleBatchDropdownOpen={handleBatchDropdownOpen}
          handleBatchDropdownClose={handleBatchDropdownClose}
          selectedBatch={selectedBatch}
          handleBatchChange={handleBatchChange}
          batches={batches}
          columns={columns}
          filteredRows={filteredRows}
          handleCheckboxClick={handleCheckboxClick}
        />
        <div className={`${classes.w100} ${classes.dflex} ${classes.justifyflexend}`}>
      <Button
        variant="contained"
        color="primary"
        className={`${classes.bluebtn} ${classes.my0_5}`}
        onClick={handleStatus}
      >
        Save & Assign
      </Button>
     </div>
      </div>
    </div>
  );
}
export default AssignLearner;
