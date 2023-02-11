import React, { useEffect, useState } from "react";
import "../css/Dashboard.css";
import "../App.css";
import "../css/Main.css";
import { Link, useNavigate } from "react-router-dom";
import {
  collection,
  doc,
  setDoc,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";
import DashboardBody from "../components/DashboardBody";
import NewAdmin from "../components/NewAdmin";
import Tooltip from "@material-ui/core/Tooltip";
import useHandlePoints from "../customhooks/useHandlePoints";
const Dashboard = () => {
  const [rollNos, setRollNos] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [studentId, setStudentId] = useState("");
  const navigate = useNavigate();
  const [dashboardColor, setDashboardColor] = useState("#69159D");
  const [adminFound, setAdminFound] = useState(false);
  const [adminInfo, setAdminInfo] = useState([]);
  const [uploadData, setUploadData] = useState({});
  const [adminDept, setAdminDept] = useState("");
  const [adminYear, setAdminYear] = useState("");
  const [adminSection, setAdminSection] = useState("");
  const [useFetching, setUserFetching] = useState(true);
  const [totalWeightage, setTotalWeightage] = useState(0);
  const [verifiedRollnos, setVerifiedRollnos] = useState();
  const [notVerifiedRollnos, setNotVerifiedRollnos] = useState();
  const [allUsers, setAllUsers] = useState([]);
  const [fetchedRollNos, setFetchedRollNos] = useState(false);
  const [selectedRollno, setSelectedRollno] = useState("");
  const section = localStorage.getItem("adminSection");
  const dept = localStorage.getItem("adminDept");
  const year = localStorage.getItem("adminYear");
  const [activityPoint, calculateActivityPoints] = useHandlePoints({
    totalWeightage,
  });
  const [force, setForce] = useState(false);

  useEffect(() => {
    let list = [];
    const unsub = onSnapshot(
      collection(db, `activitypoints`),
      (snapShot) => {
        snapShot.docs.forEach((doc) => {
          list.push(doc.id);
        });
        console.log(list);
        setVerifiedRollnos(list);
      },
      (error) => {
        alert(error);
      }
    );
    return () => {
      unsub();
    };
  }, []);

  useEffect(() => {
    let list = [];
    const unsub = onSnapshot(
      collection(
        db,
        `allUsers/${dept}/allYears/${year}/allSections/${section}/allUsers`
      ),
      (snapShot) => {
        snapShot.docs.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() });
        });
        console.log(list);
        let values = list.map((l) => l.studentId);
        setRollNos(values);
        setFetchedRollNos(true);
        setAllUsers(list);
      },
      (error) => {
        alert(error);
      }
    );
    return () => {
      unsub();
    };
  }, []);

  const handleUser = async (e) => {
    e.preventDefault();
    try {
      const id = "id" + new Date().getTime();
      await setDoc(doc(db, `allAdmins/`, localStorage.getItem("admin")), {
        ...uploadData,
        timeStamp: serverTimestamp(),
      });
      setAdminFound(true);
    } catch (error) {
      alert(error);
    }
  };

  const handleInput = (e) => {
    const id = e.target.id;
    const value = e.target.value;
    setUploadData({ ...uploadData, [id]: value });
  };

  useEffect(() => {
    let list = [];
    const unsub = onSnapshot(
      collection(db, `allAdmins`),
      (snapShot) => {
        snapShot.docs.forEach((doc) => {
          if (doc.id === localStorage.getItem("admin")) {
            setAdminFound(true);
            list.push({ id: doc.id, ...doc.data() });
            localStorage.setItem("adminYear", doc.data().adminYear);
            localStorage.setItem("adminSection", doc.data().adminSection);
            localStorage.setItem("adminDept", doc.data().adminDept);
          }
        });
        setAdminInfo(list);
        setUserFetching(false);
      },
      (error) => {
        alert(error);
      }
    );
    return () => {
      unsub();
    };
  }, []);

  useEffect(() => {
    let list = [];
    const unsub = onSnapshot(
      collection(db, `theme`),
      (snapShot) => {
        snapShot.docs.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() });
        });
        setDashboardColor(list[0].color);
      },
      (error) => {
        alert(error);
      }
    );
    return () => {
      unsub();
    };
  }, [dashboardColor]);

  useEffect(() => {
    let list = [];
    if (localStorage.getItem("student-id") === null) {
      const unsub = onSnapshot(
        collection(db, `allUsers`),
        (snapShot) => {
          snapShot.docs.forEach((doc) => {
            list.push({ id: doc.data()["studentId"] });
          });
          let values = list.map((l) => l.id);
          localStorage.setItem("student-id", JSON.stringify(values));
          setRollNos(JSON.parse(localStorage.getItem("student-id")));
        },
        (error) => {
          alert(error);
        }
      );
      return () => {
        unsub();
      };
    } else {
      setRollNos(JSON.parse(localStorage.getItem("student-id")));
    }
  }, []);

  const handleTheme = async (e) => {
    let tempColor = e.target.value;
    setDashboardColor(tempColor);
    try {
      await setDoc(doc(db, `theme`, "color"), {
        color: tempColor,
      });
    } catch (err) {
      console.log(err);
    }
  };

  const handleFilter = () => {
    if (rollNos.includes(searchInput.toUpperCase())) {
      setStudentId(searchInput.toLowerCase());
    } else if (searchInput === "") {
      alert("Input empty");
    } else {
      alert("No such record found");
    }
  };

  const handleChangeApproval = async (sid, object, docId) => {
    try {
      await setDoc(
        doc(
          db,
          `alldept/${dept}/years/${year}/sections/${section}/allStudents/${sid}/all`,
          docId
        ),
        {
          ...object,
          approval: "Approved",
        }
      );
    } catch (error) {
      alert(error);
    }
  };

  const handleForceActivityPoint = async (sid) => {
    console.log("here" + totalWeightage + " " + activityPoint);
    try {
      await setDoc(doc(db, `activitypoints`, sid), {
        totalWeightage: totalWeightage,
        activityPoint: activityPoint,
        timeStamp: serverTimestamp(),
      });
    } catch (error) {
      alert(error);
    }
  };

  useEffect(() => {
    calculateActivityPoints();
  }, [totalWeightage]);

  useEffect(() => {
    if (force === true) {
      rollNos.forEach((sid) => {
        let list = [];
        let weightage = 0;
        const unsub = onSnapshot(
          collection(
            db,
            `alldept/${dept}/years/${year}/sections/${section}/allStudents/${sid}/all`
          ),
          (snapShot) => {
            snapShot.docs.forEach((doc) => {
              const object = {};
              const data = doc.data();
              for (const key of Object.keys(data)) {
                object[key] = data[key];
              }
              handleChangeApproval(sid, object, doc.id);
              weightage += doc.data().weightage;
              console.log(weightage);
              list = [];
            });
            setTotalWeightage(weightage);
            calculateActivityPoints();
            handleForceActivityPoint(sid);
          },
          (error) => {
            alert(error);
          }
        );
        return () => {
          unsub();
        };
      });
    }
    setForce(false);
  });

  return useFetching ? (
    <div className="loading-container">
      <span className="loader"></span>
    </div>
  ) : !adminFound ? (
    <div className="new-admin-container">
      <div className="new-admin-form">
        <form onSubmit={handleUser}>
          <select
            required
            id="adminDept"
            name="adminDept"
            onChange={(e) => {
              handleInput(e);
              setAdminDept(e.target.value);
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
              setAdminYear(e.target.value);
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
              setAdminSection(e.target.value);
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
  ) : dashboardColor ? (
    <div className="dashboard-container">
      <div
        className="dashboard-nav"
        style={{ backgroundColor: dashboardColor }}
      >
        <div className="logo">
          <h6
            onClick={() => {
              setStudentId("");
              document.getElementById("searchinput").value = "";
            }}
          >
            Dashboard
          </h6>
        </div>
        <div className="search-container">
          <div className="input-group">
            <input
              type="text"
              className="form-control search-record-input"
              placeholder="Search for records..."
              id="searchinput"
              onChange={(e) => {
                setSearchInput(e.target.value);
              }}
            />
            <div
              onClick={() => {
                handleFilter();
              }}
              className="search-icon input-group-text"
            >
              Search
            </div>
          </div>
        </div>
        <div className="nav-settings">
          <div className="force-verify">
            <button
              className="button force-link-button"
              onClick={() => {
                setForce(true);
              }}
            >
              Force Verify
            </button>
          </div>
          <div className="extract-data">
            <Link to="extract">
              <button className="button extract-link-button">
                Extract Data
              </button>
            </Link>
          </div>
          <div className="change-color">
            <select
              className="change-color-dropdown"
              onChange={(e) => {
                handleTheme(e);
              }}
            >
              <option style={{ display: "none" }}>Theme</option>
              <option value="#69159D">Violet</option>
              <option value="#B22437">Red</option>
              <option value="#C53F1C">Orange</option>
              <option value="#202025">Black</option>
              <option value="#107A40">Green</option>
              <option value="#185BBC">Blue</option>
            </select>
          </div>
          <div className="logout-button-container">
            <button
              className="button logout-button"
              onClick={() => {
                localStorage.removeItem("user");
                localStorage.removeItem("student-id");
                navigate("/");
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
      <div className="dashboard-body">
        {!studentId ? (
          <div className="main-component">
            <div className="not-verified">
              <div className="main-header-1">
                <h5>NOT VERIFIED</h5>
              </div>
              <div className="main-data-group tooltip-example">
                {allUsers && verifiedRollnos ? (
                  allUsers.map((d, index) => {
                    return (
                      !verifiedRollnos.includes(d.studentId) && (
                        <Tooltip title={d.name} placement="top" key={index}>
                          <section
                            className="main-data-individual"
                            variant="contained"
                            type="button"
                            onClick={() => {
                              setStudentId(d.studentId);
                            }}
                          >
                            {d.studentId}
                          </section>
                        </Tooltip>
                      )
                    );
                  })
                ) : (
                  <div className="loading-container">
                    <span className="loader"></span>
                  </div>
                )}
              </div>
            </div>
            <div className="verified">
              <div className="main-header-2">
                <h5>VERIFIED</h5>
              </div>
              <div className="main-data-group tooltip-example">
                {allUsers && verifiedRollnos ? (
                  allUsers.map((d, index) => {
                    return (
                      verifiedRollnos.includes(d.studentId) && (
                        <Tooltip title={d.name} placement="top" key={index}>
                          <section
                            className="main-data-individual"
                            variant="contained"
                            type="button"
                            onClick={() => {
                              setStudentId(d.studentId);
                            }}
                          >
                            {d.studentId}
                          </section>
                        </Tooltip>
                      )
                    );
                  })
                ) : (
                  <div className="loading-container">
                    <span className="loader"></span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <DashboardBody studentId={studentId.toUpperCase()} />
        )}
      </div>
      <p></p>
    </div>
  ) : (
    <div className="loading-container">
      <span className="loader"></span>
    </div>
  );
};

export default Dashboard;
