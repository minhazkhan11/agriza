import React from "react";
import EditDocumentCompany from "./EditDocumentCompany";
import EditDocumentProprietor from "./EditDocumentProprietor";
import EditDocumentPartnership from "./EditDocumentPartnership";

function EditDocument({ constitutionsName , businessEntityId }) {
  return (
    <>
      {constitutionsName === "Sole Proprietorship Firm" ? (
        <EditDocumentProprietor businessEntityId={businessEntityId}/>
      ) : constitutionsName === "Partnership Firm" ? (
        <EditDocumentPartnership businessEntityId={businessEntityId}/>
      ) : (
        <EditDocumentCompany businessEntityId={businessEntityId}/>
      )}
    </>
  );
}
export default EditDocument;
