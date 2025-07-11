import React from "react";
import DocumentCompany from "./EditDocumentCompany";
import DocumentProprietor from "./DocumentProprietor";
import DocumentPartnership from "./DocumentPartnership";

function Document({ constitutionsName }) {
  return (
    <>
      {constitutionsName === "Sole Proprietorship Firm" ? (
        <DocumentProprietor />
      ) : constitutionsName === "Partnership Firm" ? (
        <DocumentPartnership />
      ) : (
        <DocumentCompany />
      )}
    </>
  );
}
export default Document;
