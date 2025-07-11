import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

// Define styles
const styles = StyleSheet.create({
  page: {
    marginTop: 100,
    padding: 20,
    fontSize: 10,
  },
  title: {
    fontSize: 10,
    textAlign: "center",
    marginBottom: 0,
    fontWeight: "bold",
  },
  title1: {
    fontSize: 12,
    textAlign: "center",
    marginBottom: 0,
    fontWeight: "bold",
  },
  title2: {
    fontSize: 12,
    textAlign: "center",
    marginBottom: "20px",
    marginTop: "5px",
    fontWeight: "bold",
    textDecoration: "underline",
  },
  section: {
    marginBottom: 8,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 2,
    paddingLeft: "10px",
    paddingBottom: 4,
  },
  table: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#000",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
  },
  cell: {
    flex: 1,
    padding: 4,
    borderRightWidth: 1,
    borderRightColor: "#000",
  },
  headerCell: {
    fontWeight: "bold",
    backgroundColor: "#ddd",
  },
  issue: {
    fontWeight: 600,
    marginBottom: "10px",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  value: {
    // backgroundColor:'red',
    // flexDirection: "row",
    width: "35%",
  },
  gap: { marginLeft: 5, marginBottom: 3 },
});

export const LicenseOformPDF = ({ selectedCategory, name }) => {
  const initials = selectedCategory?.license_id?.beneficiary_name
    .split(" ")
    .map((word) => word[0])
    .join("");

  const getFinancialYear = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.getMonth(); // 0 = Jan, 3 = April
    return month >= 3
      ? `${year}-${(year + 1).toString().slice(-2)}`
      : `${year - 1}-${year.toString().slice(-2)}`;
  };
  return (
    <Document>
      <Page style={styles.page}>
        {/* Title */}
        <Text style={styles.title}>Form (O)</Text>
        <Text style={styles.title1}>(See Clause 8 & 11)</Text>
        <Text style={styles.title2}>
          Certificate of Source for carrying on the Business of selling
          fertilizers in Wholesale/Retail
        </Text>
        <View style={styles.issue}>
          <Text>
            NO: {initials}/{getFinancialYear(selectedCategory?.updated_at)}/
            {String(selectedCategory?.id).padStart(2, "0")}
          </Text>
          <Text>Date of Issue- {new Date().toLocaleDateString("en-GB")}</Text>
        </View>
        {/* Supplier Information */}
        <View style={styles.section}>
          <Text
            style={{
              fontWeight: "bold",
              textTransform: "capitalize",
              marginBottom: "5px",
            }}
          >
            1. Particulars of the Concern Issuing the Certificate of source
          </Text>
          <View style={styles.row}>
            <Text>{"(a)"} Name & Full Address </Text>
            <View style={styles.value}>
              <View style={{ flexDirection: "row" }}>
                <Text>:</Text>
                <Text style={styles.gap}>
                  {selectedCategory?.license_id?.beneficiary_name}
                </Text>
              </View>
              <Text style={{ ...styles.gap, marginLeft: 8 }}>
                {selectedCategory?.license_id?.office_address}
              </Text>
              <Text style={{ ...styles.gap, marginLeft: 8 }}>
                {selectedCategory?.license_id?.place_id?.place_name} ,{" "}
                {selectedCategory?.license_id?.pin_code?.pin_code}
              </Text>
            </View>
          </View>
          <View style={styles.row}>
            <Text>{"(b)"} Status </Text>
            <View style={{ ...styles.value, flexDirection: "row" }}>
              <Text>:</Text>
              <Text style={[styles.gap, { textTransform: "capitalize" }]}>
                {selectedCategory?.license_id?.license_status}
              </Text>
            </View>
          </View>

          <View style={styles.row}>
            <Text>1. Details of Certificate of Registration</Text>
          </View>

          <View style={styles.row}>
            <Text>{"(i)"} Number</Text>
            <View style={{ ...styles.value, flexDirection: "row" }}>
              <Text>:</Text>
              <Text style={styles.gap}>
                {selectedCategory?.license_id?.license_no}
              </Text>
            </View>
          </View>

          <View style={styles.row}>
            <Text>{"(ii)"} Date of Issue</Text>
            <View style={{ ...styles.value, flexDirection: "row" }}>
              <Text>:</Text>
              <Text style={styles.gap}>
                {new Date(
                  selectedCategory?.license_id?.date_of_issue
                ).toLocaleDateString("en-GB")}
              </Text>
            </View>
          </View>
          <View style={styles.row}>
            <Text>{"(iii)"} Date of Expiry</Text>
            <View style={{ ...styles.value, flexDirection: "row" }}>
              <Text>:</Text>
              <Text style={styles.gap}>
                {new Date(
                  selectedCategory?.license_id?.date_of_expiry
                ).toLocaleDateString("en-GB")}
              </Text>
            </View>
          </View>
          <View style={styles.row}>
            <Text>{"(iv)"} Authority by whom Issued</Text>
            <View style={{ ...styles.value, flexDirection: "row" }}>
              <Text>:</Text>
              <Text style={styles.gap}>
                {selectedCategory?.license_id?.author_by_issue}
              </Text>
            </View>
          </View>

          <View style={{ ...styles.row, fontWeight: 600, marginTop: 5 }}>
            <Text>
              2. Particulars of Person to whom the certificate of source is
              being issued
            </Text>
          </View>
          <View style={styles.row}>
            <Text>{"(a)"} Name & Full Address</Text>
            <View style={styles.value}>
              <View style={{ flexDirection: "row" }}>
                <Text>:</Text>
                <Text style={styles.gap}> {name}</Text>
              </View>
              <Text style={{ ...styles.gap, marginLeft: 8 }}></Text>
              <Text style={{ ...styles.gap, marginLeft: 8 }}></Text>
            </View>
          </View>
          <View style={styles.row}>
            <Text>{"(b)"} Status</Text>
            <View style={{ ...styles.value, flexDirection: "row" }}>
              <Text>:</Text>
              <Text style={styles.gap}></Text>
            </View>
          </View>

          <View style={styles.row}>
            <Text>
              {"(c)"} If hold a valid certificate of registration the details
              thereof
            </Text>
          </View>
          <View style={{ ...styles.row }}>
            <Text>{"(i)"} Number</Text>
            <View style={{ ...styles.value, flexDirection: "row" }}>
              <Text>:</Text>
              <Text style={styles.gap}></Text>
            </View>
          </View>
          <View style={{ ...styles.row }}>
            <Text>{"(ii)"} Date of issue</Text>
            <View style={{ ...styles.value, flexDirection: "row" }}>
              <Text>:</Text>
              <Text style={styles.gap}> </Text>
            </View>
          </View>
          <View style={{ ...styles.row }}>
            <Text>{"(iii)"} Date of expiry</Text>
            <View style={{ ...styles.value, flexDirection: "row" }}>
              <Text>:</Text>
              <Text style={styles.gap}></Text>
            </View>
          </View>
          <View style={{ ...styles.row }}>
            <Text>{"(iv)"} Authority by whom Issued</Text>
            <View style={{ ...styles.value, flexDirection: "row" }}>
              <Text>:</Text>
              <Text style={styles.gap}></Text>
            </View>
          </View>
        </View>
        {/* Fertilizer Details Table */}
        <View style={styles.section}>
          <Text style={{ fontWeight: "bold", textTransform: "capitalize" }}>
            2. Details of Fertilizer(s) to be Supplied
          </Text>
          <View style={styles.table}>
            {/* Header Row */}
            <View style={[styles.tableRow, styles.headerCell]}>
              <Text style={[styles.cell, { flex: 0.3 }]}>S.No</Text>
              <Text style={styles.cell}>Company</Text>
              <Text style={styles.cell}>Name of Fertilizer</Text>
              <Text style={styles.cell}>Brand Name</Text>
            </View>

            {/* Sample Data Rows */}
            {selectedCategory.license_products.map((item, index) => (
              <View key={index} style={styles.tableRow}>
                <Text style={[styles.cell, { flex: 0.3 }]}>{index + 1}</Text>
                <Text style={styles.cell}>{item.source_of_supply}</Text>
                <Text style={styles.cell}>{item.name_of_product}</Text>
                <Text style={styles.cell}>{item.brand_name}</Text>
              </View>
            ))}
          </View>
        </View>
        <Text
          style={{
            margin: "0px 10px 10px 10px",
          }}
        >
          <Text
            style={{
              fontWeight: "bold",
              textTransform: "capitalize",
              display: "flex",
            }}
          >
            Declaration:
          </Text>{" "}
          Declared that the Fertilizer mentioned above will be supplied
          conforming to the standards laid down under the fertilizer (control)
          order 1985 and as the case may be, grades / formulation (of mixtures
          of Fertilizers) notified by the Central / State Government & packed &
          marked in containers as provided under clause 12 of the Fertilizer
          (control) order, 1985.
        </Text>
        <View
          style={{
            flexDirection: "column",
            alignItems: "flex-end",
            marginRight: 10,
          }}
        >
          <Text>
            For:{" "}
            <Text
              style={{
                fontWeight: "bold",
                textTransform: "capitalize",
              }}
            >
              {selectedCategory?.license_id?.beneficiary_name}
            </Text>
          </Text>
          {selectedCategory?.license_id?.signatureandseal?.photo_path && (
            <Image
              src={selectedCategory.license_id.signatureandseal.photo_path}
              style={{ width: 100, height: 50, marginTop: 10 }}
            />
          )}
          <Text
            style={{
              fontWeight: "bold",
              textTransform: "capitalize",
            }}
          >
            Authorized Signatory
          </Text>
        </View>
      </Page>
    </Document>
  );
};
