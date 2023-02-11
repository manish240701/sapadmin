import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import React, { useState } from "react";
import { db } from "../firebase";

const NewAdmin = () => {
  const [uploadData, setUploadData] = useState({});
  const handleUser = async (e) => {
    e.preventDefault();
    try {
      const id = "id" + new Date().getTime();
      await setDoc(doc(db, `allAdmins/`, localStorage.getItem("admin")), {
        ...uploadData,
        timeStamp: serverTimestamp(),
      });
    } catch (error) {
      alert(error);
    }
  };

  const handleInput = (e) => {
    const id = e.target.id;
    const value = e.target.value;
    setUploadData({ ...uploadData, [id]: value });
  };
  return (
    <div className="new-admin-container">
      <div className="new-admin-form">
        <form onSubmit={handleUser}>
          <select
            required
            id="adminDept"
            name="adminDept"
            onChange={(e) => {
              handleInput(e);
            }}
          >
            <option defaultValue="empty" style={{ display: "none" }}>
              Select
            </option>
            <option value="CSE">CSE</option>
            <option value="MECH">MECH</option>
            <option value="ECE">ECE</option>
            <option value="CHEM">CHEM</option>
          </select>
          <select
            required
            id="adminYear"
            name="adminYear"
            onChange={(e) => {
              handleInput(e);
            }}
          >
            <option defaultValue="empty" style={{ display: "none" }}>
              Select
            </option>
            <option value="1">I</option>
            <option value="2">II</option>
            <option value="3">III</option>
            <option value="4">IV</option>
          </select>
          <select
            required
            id="adminSection"
            name="adminSection"
            onChange={(e) => {
              handleInput(e);
            }}
          >
            <option defaultValue="empty" style={{ display: "none" }}>
              Select
            </option>
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="C">C</option>
            <option value="D">D</option>
          </select>
          <input type="submit" />
        </form>
      </div>
    </div>
  );
};

export default NewAdmin;
