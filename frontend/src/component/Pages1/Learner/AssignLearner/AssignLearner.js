import React, { useEffect, useState } from "react";
import PageHeader from "../../PageHeader";
import { ReactComponent as LearnerIcon } from "../../../images/learnersimage/learnericon.svg";
import useStyles from "../../../../styles";
import LearnerDetails from "../../../CustomComponent/LearnerDetails";
import AssignViewLearner from "./ViewAssignLearner";
import { decryptData } from "../../../../crypto";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@material-ui/core";

function AssignLearner() {
  const classes = useStyles();
  const Heading = [
    {
      id: 1,
      pageicon: <LearnerIcon />,
      mainheading: "Assign Learner",
    },
  ];
  let { selectedCource1, selectedBatch1 } = useParams();

  const [anchorEl, setAnchorEl] = useState(null);
  const popoveropen = Boolean(anchorEl);
  const id = popoveropen ? "simple-popover" : undefined;
  const [selectedRowId, setSelectedRowId] = useState();

  const [searchQuery, setSearchQuery] = useState("");
  const decryptedToken = decryptData(sessionStorage.getItem("token"));
  const [learners, setLearners] = useState([]);
  const navigate = useNavigate();

  const handleClick = (event, rowId) => {
    setAnchorEl(event.currentTarget);
    setSelectedRowId(rowId);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/v1/b2b/learner/all/filter?course_id=${selectedCource1}&batch_id=${selectedBatch1}`,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      );
      setLearners(response.data.learners);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedCource1, selectedBatch1, decryptedToken]);




  const fetchDataWithoutFilters = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/v1/b2b/learner/not/assigned`,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      );
      setLearners(response.data.learners);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  useEffect(() => {
    fetchDataWithoutFilters();
  }, []);


  const rows = learners.map((d) => ({
    id: d?.id ? d.id : "N/A",
    full_name: d?.full_name ? d.full_name : "N/A",

    phone: d?.phone ? d.phone : "N/A",
    email: d?.email ? d.email : "N/A",
    course_name: d?.learner_information?.course?.course_name
      ? d.learner_information.course.course_name
      : "N/A",
    batch_name: d?.learner_information?.batch?.batch_name
      ? d.learner_information.batch.batch_name
      : "N/A",
      guardian_name: d?.learner_information?.guardian_name
      ? d.learner_information.guardian_name
      : "N/A",
    created_at: d?.created_at ? d?.created_at : "N/A",
    active_status: d?.active_status ? d?.active_status : "N/A",
  }));

  const filteredRows = rows
    .filter((d) => {
      const isSearchMatch = d.full_name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      return isSearchMatch;
    })
    .map((row, index) => ({
      ...row,
      srno: index + 1,
    }));



  const columns = [
    {
      field: "full_name",
      headerName: "Name",
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
      width: 200,
      flex: 1,
      sortable: true,
      disableColumnMenu: true,
      autoPageSize: false,
    },
    {
      field: "guardian_name",
      headerName: "Father / Gaurdian Name",
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
      headerName: "Ph.No.",
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
    {
      field: "course_name",
      headerName: "Course",
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
      type: "number",
      width: 110,
      sortable: true,
      disableColumnMenu: true,
      autoPageSize: false,
    },

    {
      field: "batch_name",
      headerName: "Batch",
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
      type: "number",
      width: 110,
      sortable: true,
      disableColumnMenu: true,
      autoPageSize: false,
    },
  ];
  const [selectedCource, setSelectedCource] = useState("");

  const handleCourceChange = (event) => {
    setSelectedCource(event.target.value);
  };

  const menuProps = {
    getContentAnchorEl: null,
    anchorOrigin: {
      vertical: "bottom",
      horizontal: "left",
    },
    disablePortal: true,
  };
  const [cources, setCources] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState("");
  const fetchCources = async () => {
    try {
      const decryptedToken = decryptData(sessionStorage.getItem("token"));

      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/v1/b2b/course`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
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

  const handleBatchChange = (event) => {
    setSelectedBatch(event.target.value);
  };

  useEffect(() => {
    if (selectedCource) {
      const fetchBatches = async (selectedCource) => {
        try {
          const decryptedToken = decryptData(sessionStorage.getItem("token"));

          const response = await fetch(
            `${process.env.REACT_APP_API_BASE_URL}/v1/b2b/batch/by_course_id/${selectedCource}`,

            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${decryptedToken}`,
              },
            }
          );

          if (response.ok) {
            const data = await response.json();
            console.log(data?.batches, "data");
            setBatches(data.batches);
          } else {
            console.error("Failed to fetch batches data");
          }
        } catch (error) {
          console.error("Error fetching batches data:", error);
        }
      };
      fetchBatches(selectedCource);
    }
  }, [selectedCource]);
  let [Id, setId] = useState("");

  const handleCheckboxClick = (selectedIDs) => {
    console.log("Selected IDs:", selectedIDs);
    setId(selectedIDs);
  };

  const handleStatus = async () => {

     // Validation checks
  if (!Id || Id.length === 0) {
    toast.error("Please select at least one learner.");
    return;
  }
  if (!selectedCource) {
    toast.error("Please select a course.");
    return;
  }
  if (!selectedBatch) {
    toast.error("Please select a batch.");
    return;
  }

  
    try {
      const data = {
        learner: {
          ids: Id,
          course_id: selectedCource,
          batch_id: selectedBatch,
        },
      };
      console.log(data, "data");

      const response = await axios.put(
        `${process.env.REACT_APP_API_BASE_URL}/v1/b2b/learner/assign`,
        data,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      );

      console.log("Learner assigned successfully", response);
      fetchData();
      toast.success("Learner assigned successfully");
      handleClose();

      setTimeout(() => {
        navigate(`/admin/learner`);
      }, 2000);
    } catch (error) {
      console.error("Error changed Learner status:", error);
      toast.error("Learner is not assigned ", error);
    }
  };

  return (
    <div className={`${classes.p2} ${classes.pb0} ${classes.pt1}`}>
      <PageHeader Heading={Heading} />
      <LearnerDetails />
     
     <div   className={`${classes.w100} ${classes.h49vh} ${classes.bgwhite} ${classes.borderradius6px}`}>
     <AssignViewLearner
        menuProps={menuProps}
        columns={columns}
        filteredRows={filteredRows}
        handleStatus={handleStatus}
        cources={cources}
        selectedCource={selectedCource}
        handleCourceChange={handleCourceChange}
        batches={batches}
        selectedBatch={selectedBatch}
        handleBatchChange={handleBatchChange}
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
