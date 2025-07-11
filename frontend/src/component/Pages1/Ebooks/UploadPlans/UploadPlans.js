import React, { useEffect, useState } from "react";
import useStyles from "../../../../styles";
import QuestionHead from "../../../CustomComponent/QuestionHead";
import UploadPlansForm from "./UploadPlansForm";
import { useParams } from "react-router-dom";
import { decryptData } from "../../../../crypto";
import axios from "axios";

function UploadPlans() {
  const classes = useStyles();
  const { rowId } = useParams();
  const decryptedToken = decryptData(sessionStorage.getItem("token"));

  const [ebookdetails, setEbookDetails] = useState({
    ebook_name: "",
    subjects: [],
    course: "",
    batch: "",
    logo: "", // Initially empty
  });

  useEffect(() => {
    const fetchDataFromAPI = async () => {
      try {
        const apiUrl = `${process.env.REACT_APP_API_BASE_URL}/v1/b2b/content/ebooks/${rowId}`;
        const response = await axios.get(apiUrl, {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        });

        if (response.status === 200 && response.data.success) {
          const ebookData = response.data.ebook;
          const subjectNames = ebookData.subjects.map(
            (subject) => subject.subject_name
          );
          const firstImageUrl =
            ebookData.images.length > 0 ? ebookData.images[0] : ""; // Check if images array is not empty, then set the first image URL

          setEbookDetails({
            ebook_name: ebookData.name,
            subjects: subjectNames,
            course: ebookData.course.course_name,
            batch: ebookData.batch.batch_name,
            logo: firstImageUrl, // Set the first image URL from the images array
          });
        }
      } catch (error) {
        console.error("Error fetching data from the API:", error);
      }
    };

    fetchDataFromAPI();
  }, [rowId, decryptedToken]);

  const subjectsString = ebookdetails.subjects.join(", ");

  const Heading = [
    {
      id: 1,
      logo: ebookdetails.logo,
      path: "/admin/ebooks",
      headings: [
        {
          id: 11,
          label: "E-Book Name",
          content: ebookdetails.ebook_name,
        },
        {
          id: 12,
          label: "Subject",
          content: subjectsString,
        },
        {
          id: 13,
          label: "Course",
          content: ebookdetails.course,
        },
        {
          id: 14,
          label: "Batch",
          content: ebookdetails.batch,
        },
      ],
    },
  ];

  return (
    <div className={classes.p2}>
      <QuestionHead Heading={Heading} />
      <UploadPlansForm ebookanme={ebookdetails.ebook_name} />
    </div>
  );
}

export default UploadPlans;
