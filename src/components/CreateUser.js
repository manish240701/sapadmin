import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";

const CreateUser = () => {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [year, setYear] = useState("");
  const [section, setSection] = useState("");
  const [department, setDepartment] = useState("");

  const handleCreate = (e) => {
    e.preventDefault()
    createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      createUser();
    })
    .catch((error) => {
      alert(error);
    });
  };

  const createUser = async () => {
    try {
      await setDoc(doc(db, `allAdmins`, email), {
        adminDept: department,
        adminSection: section,
        adminYear: year,
        timeStamp: serverTimestamp(),
      });
      alert("user created successfully");
    } catch (error) {
      alert(error);
    }
    createUser();
  };
  return (
    <div>
      <form onSubmit={handleCreate} style={{ textAlign: "start" }}>
        Enter Email
        <input
          type="email"
          placeholder="email"
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <br />
        Enter Password
        <input
          type="password"
          placeholder="password"
          required
          onChange={(e) => setPassword(e.target.value)}
        />
        <br />
        select year*
        <select required onChange={(e) => setYear(e.target.value)}>
          <option value="" style={{ display: "none" }}>
            Select Year
          </option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
        </select>
        <br />
        Select dept*
        <select required onChange={(e) => setDepartment(e.target.value)}>
          <option value="" style={{ display: "none" }}>
            Select Department
          </option>
          <option value="CSE">CSE</option>
          <option value="ECE">ECE</option>
          <option value="CHEM">CHEM</option>
          <option value="MECH">MECH</option>
        </select>
        <br />
        select section*
        <select required onChange={(e) => setSection(e.target.value)}>
          <option value="" style={{ display: "none" }}>
            Select Section
          </option>
          <option value="A">A</option>
          <option value="B">B</option>
          <option value="C">C</option>
          <option value="D">D</option>
        </select>
        <button type="submit">Create User</button>
      </form>
    </div>
  );
};

export default CreateUser;
