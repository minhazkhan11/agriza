import React, { useState, useEffect } from 'react';
import Modal from '@material-ui/core/Modal';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';
import { decryptData } from "../../../../crypto";

const useStyles = makeStyles((theme) => ({
  modalContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    borderRadius: '8px',
    outline: 'none',
    width: '50%',
    maxHeight: '80%',
    overflowY: 'auto',
  },
  modalHeader: {
    marginBottom: theme.spacing(2),
    fontWeight: 'bold',
    color: theme.palette.text.primary, 
  },
  modalSection: {
    marginBottom: theme.spacing(2),
  },
  noDataText: {
    fontStyle: 'italic',
  },
  closeButtonContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: theme.spacing(2),
  },
  custombtnblue: {
    background: "#00577B",
    color: "white",
    fontSize: "1rem",
    fontFamily: "Outfit",
    fontWeight: "600",
    textTransform: "capitalize",
    padding: "0.4rem 2rem",
    "&:hover": {
      background: "#00577B",
      color: "white",
    },
  },
  listContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
    gap: theme.spacing(2),
    alignItems: 'start'
  },
}));

const TeacherDetailModal = ({ open, onClose, teacherId }) => {
  const classes = useStyles();
  const decryptedToken = decryptData(sessionStorage.getItem("token"));

  const [teacher, setTeacher] = useState(null);
  const [error, setError] = useState(null);

  const fetchData = async (teacherId) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/v1/b2b/teacher/${teacherId}`,
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      );
      setTeacher(response.data.teacher);
      setError(null);
    } catch (error) {
      console.error("Error fetching data: ", error);
      setError("Failed to load teacher data");
    }
  };

  useEffect(() => {
    if (teacherId) {
      fetchData(teacherId);
    }
  }, [teacherId]);

  const renderListItems = (items, noDataText) => {
    if (items && items.length > 0) {
      return items.map((item, index) => (
        <Typography key={item.id} variant="body1">
          {item.course_name || item.batch_name}
        </Typography>
      ));
    } else {
      return <Typography className={classes.noDataText}>{noDataText}</Typography>;
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <div className={classes.modalContainer}>
        <Typography variant="h5" className={classes.modalHeader}>
          Teacher Name: {teacher?.full_name || "Loading..."}
        </Typography>
        {error ? (
          <Typography variant="subtitle1" color="error">{error}</Typography>
        ) : (
          <>
              <div className={classes.modalSection}>
          <Typography variant="subtitle1" className={classes.modalHeader}>Assigned Courses:</Typography>
          <div className={classes.listContainer}>
            {renderListItems(teacher?.teacher_information?.courses, 'No courses assigned to this teacher')}
          </div>
        </div>
        <div className={classes.modalSection}>
          <Typography variant="subtitle1" className={classes.modalHeader}>Assigned Batches:</Typography>
          <div className={classes.listContainer}>
            {renderListItems(teacher?.teacher_information?.batches, 'No batches assigned for this teacher')}
          </div>
        </div>
          </>
        )}
        <div className={classes.closeButtonContainer}>
          <Button variant="contained" color="primary" onClick={onClose} className={`${classes.custombtnblue}`}>Close</Button>
        </div>
      </div>
    </Modal>
  );
};

export default TeacherDetailModal;