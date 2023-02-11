import { deleteDoc, doc, setDoc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import React, { useEffect, useState } from "react";
import "../App.css";
import "../css/GlobalCategory.css";
import { db, storage } from "../firebase";

const Category1 = ({ data, id }) => {
  const categoryHeader = "Paper Presentation";
  const [categoryPoints, setCategoryPoints] = useState(0);
  const [categoryCount, setCategoryCount] = useState(0);
  const section = localStorage.getItem("adminSection");
  const dept = localStorage.getItem("adminDept");
  const year = localStorage.getItem("adminYear");

  const category1Data = data.filter((d) => {
    return d.activityCategory === categoryHeader;
  });

  useEffect(() => {
    const sum = category1Data.reduce((acc, cur) => acc + cur.weightage, 0);
    const totalItems = category1Data.length;
    setCategoryCount(totalItems);
    setCategoryPoints(sum);
  });

  const handleChangeStatus = async (d, docStatus) => {
    try {
      await setDoc(
        doc(
          db,
          `alldept/${dept}/years/${year}/sections/${section}/allStudents/${id}/all`,
          d.id
        ),
        {
          ...d,
          approval: docStatus,
        }
      );
    } catch (error) {
      alert(error);
    }
  };

  return (
    <div
      className={
        category1Data.length > 0
          ? "category-container"
          : "category-container category-disabled"
      }
    >
      <div className="category-header">
        <h4>
          {categoryHeader}
          <span style={{ fontSize: "15px" }}> (MAX - 75 points)</span>
        </h4>
        <div
          className={
            category1Data.length > 0
              ? "category-values-container"
              : "category-values-container category-disabled"
          }
        >
          <section className="category-values-section">
            <h6>Category Count : {categoryCount}</h6>
          </section>
          <section className="category-values-section">
            <h6>Category points: {categoryPoints}</h6>
          </section>
        </div>
      </div>

      {category1Data.length > 0 ? (
        <div className="data-grid">
          {category1Data.map((d, index) => {
            return (
              <div className={d.approval==="pending"?"individual-data-body pending":"individual-data-body"} key={d.id}>
                <div className="activity-header-bar">
                  <span className="h1">0{index + 1}</span>
                </div>
                <div className="activity-data">
                  <div className="data text-overflow-hide">
                    <div>
                      Weightage:
                      <span>{d.weightage}</span>
                    </div>
                    <div>
                      Category:
                      <span>{d.category}</span>
                    </div>
                    {d.level && (
                      <div>
                        Level:
                        <span>{d.level}</span>
                      </div>
                    )}
                  </div>
                  <div className="action-button-group">
                    <a href={d.pdf} target="_blank" rel="noreferrer noopener">
                      <button className="button view-proof-button zoom">
                        Preview PDF
                      </button>
                    </a>
                    <div className="btn-grp">
                      <button
                        className="action-button reject-btn"
                        onClick={() => {
                          let value = prompt("Enter yes to reject");
                          if (value.toLocaleLowerCase() === "yes") {
                            handleChangeStatus(d, "Rejected");
                          }
                        }}
                      >
                        {d.approval === "Rejected" ? "Rejected" : "Reject"}
                      </button>
                      <button
                        className="action-button approve-btn"
                        onClick={() => {
                          if (
                            // confirming before download
                            window.confirm(
                              "Are you sure you want to delete this?"
                            ) === true
                          ) {
                            handleChangeStatus(d, "Approved");
                          }
                        }}
                      >
                        {d.approval === "Approved" ? "Approved" : "Approve"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="no-data-container pb-5">No Applications</div>
      )}
    </div>
  );
};

export default Category1;
