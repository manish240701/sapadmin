import { deleteDoc, doc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import React, { useEffect, useState } from "react";
import "../App.css";
import "../css/GlobalCategory.css";
import { db, storage } from "../firebase";

const Category2 = ({ data, id }) => {
  const categoryHeader = "Project Presentation";
  const [categoryPoints, setCategoryPoints] = useState(0);
  const [categoryCount, setCategoryCount] = useState(0);
  const category2Data = data.filter((d) => {
    return d.activityCategory === categoryHeader;
  });

  useEffect(() => {
    const sum = category2Data.reduce((acc, cur) => acc + cur.weightage, 0);
    const totalItems = category2Data.length;
    setCategoryCount(totalItems);
    setCategoryPoints(sum);
  });

  const handleDelete = async (fileId, fileName) => {
    try {
      await deleteDoc(doc(db, `all/${id}/all`, fileId));
      const desertRef = ref(storage, `${id}/${fileName}`);

      deleteObject(desertRef)
        .then(() => {
          console.log("fully deleted");
        })
        .catch((error) => {
          alert(error);
        });
      alert("success");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div
      className={
        category2Data.length > 0
          ? "category-container"
          : "category-container category-disabled"
      }
    >
      <div className="category-header">
        <h4>
          {categoryHeader}
          <span style={{ fontSize: "15px" }}> (MAX - 100 points)</span>
        </h4>
        <div
          className={
            category2Data.length > 0
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

      {category2Data.length > 0 ? (
        <div className="data-grid">
          {category2Data.map((d, index) => {
            return (
              <div className="individual-data-body" key={d.id}>
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
                    <button
                      className="button delete-record-button zoom"
                      onClick={() => {
                        if (
                          window.confirm(
                            "Are you sure you want to delete this record"
                          )
                        ) {
                          handleDelete(d.id, d.fileName);
                        }
                      }}
                    >
                      delete
                    </button>
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

export default Category2;
