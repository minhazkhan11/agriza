import { Fragment, useState } from "react";
import Box from "@material-ui/core/Box";
import Paper from "@material-ui/core/Paper";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const Header = ({
  title,
  description,
  setTitle,
  setDescription,
  onHeaderDataChange,
  onQuillDataChange,
}) => {
  // State to store data from ReactQuill fields
  const [quillData, setQuillData] = useState({
    main_heading: "",
    form_description: "",
  });

  // Function to handle changes in ReactQuill fields
  const handleQuillChange = (content, field) => {
    setQuillData((prevState) => ({
      ...prevState,
      [field]: content, // Update the corresponding field in the state
    }));

    // Pass the updated JSON object to the parent component
    onQuillDataChange({
      ...quillData,
      [field]: content,
    });
  };

  return (
    <Fragment>
      <ReactQuill
        placeholder="Form Heading"
        onChange={(content) => handleQuillChange(content, "main_heading")}
        style={{
          marginBottom: "20px",
        }}
      />

      <ReactQuill
        placeholder="Form Description"
        onChange={(content) => handleQuillChange(content, "form_description")}
      />
    </Fragment>
  );
};

export default Header;
