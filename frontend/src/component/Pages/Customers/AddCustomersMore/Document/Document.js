import React from "react";
import DocumentCompany from "./DocumentCompany";
import DocumentProprietor from "./DocumentProprietor";
import DocumentPartnership from "./DocumentPartnership";

function Document({ constitutionsName, businessEntityId }) {
  return (
    <>
      {constitutionsName === "Sole Proprietorship Firm" ? (
        <DocumentProprietor businessEntityId={businessEntityId} />
      ) : constitutionsName === "Partnership Firm" ? (
        <DocumentPartnership businessEntityId={businessEntityId} />
      ) : (
        <DocumentCompany businessEntityId={businessEntityId} />
      )}
    </>
  );
}
export default Document;
