import React, { useEffect, useState } from "react";
import useStyles from "../../../../styles";
import QuestionHead from "../../../CustomComponent/QuestionHead";
import { useParams } from "react-router-dom";
import { decryptData } from "../../../../crypto";
import axios from "axios";
import ViewNotesContent from "./ViewNotesContent";

function NotesContent() {
  const classes = useStyles();
  const { rowId } = useParams();
  const decryptedToken = decryptData(sessionStorage.getItem("token"));

  const [notesDetails, setEbookDetails] = useState({
    notename: "",
    subjects: "",
    course: "",
    batch: "",
    logo: "",
  });

  useEffect(() => {
    const fetchDataFromAPI = async () => {
      try {
        const apiUrl = `${process.env.REACT_APP_API_BASE_URL}/v1/b2b/content/notes/${rowId}`;
        const response = await axios.get(apiUrl, {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        });

        if (response.status === 200 && response.data.success) {
          const noteDataaa = response?.data?.note;

          setEbookDetails({
            notename: noteDataaa?.name,
            subjects: noteDataaa?.subject.subject_name,
            course: noteDataaa?.course.course_name,
            batch: noteDataaa?.batch.batch_name,
            logo: noteDataaa?.image_url,
          });
        }
      } catch (error) {
        console.error("Error fetching data from the API:", error);
      }
    };

    fetchDataFromAPI();
  }, [rowId, decryptedToken]);

  const Heading = [
    {
      id: 1,
      logo: notesDetails.logo,
      path: "/admin/publishednotes",
      headings: [
        {
          id: 11,
          label: "Note Name",
          content: notesDetails.notename,
        },
        {
          id: 12,
          label: "Subject",
          content: notesDetails.subjects,
        },
        {
          id: 13,
          label: "Course",
          content: notesDetails.course,
        },
        {
          id: 14,
          label: "Batch",
          content: notesDetails.batch,
        },
      ],
    },
  ];

  return (
    <div className={classes.p2}>
      <QuestionHead Heading={Heading} />
      <ViewNotesContent  notename={notesDetails.notename} />
    </div>
  );
}

export default NotesContent;
