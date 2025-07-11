import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

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

export const LicenseOformPDF = ({ orders }) => {
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
          <Text>NO: MSCPL/Ind./WHL/2024-25/06</Text>
          <Text>Date of Issue- 10/03/2025</Text>
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
                <Text style={styles.gap}>{orders?.beneficiary_name}</Text>
              </View>
              <Text style={{...styles.gap,marginLeft:8}}>{orders?.beneficiary_name}</Text>
              <Text style={{...styles.gap,marginLeft:8}}>{orders?.beneficiary_name}</Text>
            </View>
          </View>
          <View style={styles.row}>
            <Text>{"(b)"} Status </Text>
            <View style={{ ...styles.value, flexDirection: "row" }}>
              <Text>:</Text>
              <Text style={styles.gap}> {orders?.license_status}</Text>
            </View>
          </View>

          <View style={styles.row}>
            <Text>1. Details of Certificate of Registration</Text>
          </View>

          <View style={styles.row}>
            <Text>{"(i)"} Number</Text>
            <View style={{ ...styles.value, flexDirection: "row" }}>
              <Text>:</Text>
              <Text style={styles.gap}> RS/439/1401/31/2024</Text>
            </View>
          </View>

          <View style={styles.row}>
            <Text>{"(ii)"} Date of Issue</Text>
            <View style={{ ...styles.value, flexDirection: "row" }}>
              <Text>:</Text>
              <Text style={styles.gap}>
                {orders?.date_of_issue
                  ? new Date(orders?.date_of_issue).toLocaleString("en-US", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })
                  : ""}
              </Text>
            </View>
          </View>
          <View style={styles.row}>
            <Text>{"(iii)"} Date of Expiry</Text>
            <View style={{ ...styles.value, flexDirection: "row" }}>
              <Text>:</Text>
              <Text style={styles.gap}>
                {orders?.date_of_expiry
                  ? new Date(orders?.date_of_expiry).toLocaleString("en-US", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })
                  : ""}
              </Text>
            </View>
          </View>
          <View style={styles.row}>
            <Text>{"(iv)"} Authority by whom Issued</Text>
            <View style={{ ...styles.value, flexDirection: "row" }}>
              <Text>:</Text>
              <Text style={styles.gap}>{orders?.author_by_issue}</Text>
            </View>
          </View>

          <View style={{...styles.row,fontWeight:600,marginTop:5}}>
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
                <Text style={styles.gap}> M/S Dinesh Kumar Janki Ballabh</Text>
              </View>
              <Text style={{...styles.gap,marginLeft:8}}>{orders?.beneficiary_name}</Text>
              <Text style={{...styles.gap,marginLeft:8}}>{orders?.beneficiary_name}</Text>
            </View>
          </View>
          <View style={styles.row}>
            <Text>{"(b)"} Status</Text>
            <View style={{ ...styles.value, flexDirection: "row" }}>
              <Text>:</Text>
              <Text style={styles.gap}> Retailer</Text>
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
            2. Details of Fertilizers to be Supplied
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
            {[
              {
                company: "Agrophos India Ltd. ytest",
                fertilizer:
                  "Single Super Phosphate (16% P2O5 Powder & Granular)",
                brand: "Krishi Samridhi Brand",
              },
              {
                company: "Agrophos India Ltd.",
                fertilizer:
                  "Boronated Single Super Phosphate (16% P2O5 Powder & Granular)",
                brand: "Krishi Samridhi Brand",
              },
              {
                company: "Agrophos India Ltd.",
                fertilizer:
                  "Zincated Single Super Phosphate (16% P2O5 Powder & Granular)",
                brand: "Krishi Samridhi Brand",
              },
              {
                company: "Agrophos India Ltd.",
                fertilizer:
                  "Zincated & Boronated Single Super Phosphate (16% P2O5 Powder & Granular)",
                brand: "Krishi Samridhi Brand",
              },
            ].map((item, index) => (
              <View key={index} style={styles.tableRow}>
                <Text style={[styles.cell, { flex: 0.3 }]}>{index + 1}</Text>
                <Text style={styles.cell}>{item.company}</Text>
                <Text style={styles.cell}>{item.fertilizer}</Text>
                <Text style={styles.cell}>{item.brand}</Text>
              </View>
            ))}
          </View>
        </View>
      </Page>
    </Document>
  );
};
