import { collection, onSnapshot } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import "../App.css";
import "../css/Extract.css";
import { db } from "../firebase";
import * as XLSX from "xlsx";
import JSZip from "jszip";
import { Link, Navigate, useNavigate } from "react-router-dom";

const SuperAdmin = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  let [rollNos, setRollNos] = useState([]);
  const zip = new JSZip();
  const [isLoading, setIsLoading] = useState(true);
  const [fetchedRollNos, setFetchedRollNos] = useState(false);
  const [pdfLinks, setPdfLinks] = useState();
  const [activityData, setActivityData] = useState({});
  const [pdfDownloadStatus, setPdfDownloadStatus] = useState(false);
  const [year, setYear] = useState("");
  const [section, setSection] = useState("");
  const [department, setDepartment] = useState("");
  const [activity, setActivity] = useState("");
  const [beginSearch, setBeginSearch] = useState(false);
  const handleExtractAllDoc = () => {
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(
      workbook,
      XLSX.utils.json_to_sheet(activityData),
      "activity data"
    );
    data.forEach((d, index) => {
      XLSX.utils.book_append_sheet(
        workbook,
        XLSX.utils.json_to_sheet(d),
        rollNos[index]
      );
    });
    XLSX.writeFile(workbook, `data.xlsx`);
  };

  const handleExtractPdf = async () => {
    const promises = pdfLinks.map(async (link) => {
      setPdfDownloadStatus(true);
      const response = await fetch(link);
      const blob = await response.blob();
      return { link, blob };
    });

    const linkBlobs = await Promise.all(promises);
    linkBlobs.forEach((linkBlob) => {
      let fileName = decodeURIComponent(linkBlob.link.split("/").pop());
      fileName = fileName.split(".pdf")[0] + ".pdf";
      zip.file(fileName, linkBlob.blob);
    });

    const content = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(content);
    const link = document.createElement("a");
    link.download = "pdfs.zip";
    link.href = url;
    link.click();
    setPdfDownloadStatus(false);
  };

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, `activitypoints`),
      (snapShot) => {
        let list = [];
        snapShot.docs.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() });
        });
        setActivityData(list);
        setIsLoading(false);
      },
      (error) => {
        alert("error fetching data");
      }
    );
    return () => {
      unsub();
    };
  });

  useEffect(() => {
    if (section) {
      let list = [];
      const unsub = onSnapshot(
        collection(
          db,
          `allUsers/${department}/allYears/${year}/allSections/${section}/allUsers`
        ),
        (snapShot) => {
          snapShot.docs.forEach((doc) => {
            list.push(doc.data()["studentId"]);
          });
          setRollNos(list);
          setFetchedRollNos(true);
        },
        (error) => {
          alert(error);
        }
      );
      return () => {
        unsub();
      };
    }
  }, [section]);

  useEffect(() => {
    if (section) {
      let links = [];
      console.log(rollNos + "rollnos");
      rollNos.forEach((id, index) => {
        alert(
          `alldept/${department}/years/${year}/sections/${section}/allStudents/${id}/all`
        );
        const unsub = onSnapshot(
          collection(
            db,
            `alldept/${department}/years/${year}/sections/${section}/allStudents/${id}/all`
          ),
          (snapShot) => {
            let list = [];
            snapShot.docs.forEach((doc) => {
              if (activity !== "") {
                if (doc.data().activityCategory === activity) {
                  links.push({ pdf: doc.data()["pdf"] });
                  list.push({ id: doc.id, ...doc.data() });
                }
              } else {
                links.push({ pdf: doc.data()["pdf"] });
                list.push({ id: doc.id, ...doc.data() });
              }
            });
            let values = links.map((l) => l.pdf);
            console.log(values);
            setPdfLinks(values);
            setData((prev) => [
              ...prev.slice(0, index),
              list,
              ...prev.slice(index + 1),
            ]);
            setIsLoading(false);
          },
          (error) => {
            alert("error fetching data");
          }
        );
        return () => {
          unsub();
        };
      });
    }
  }, [fetchedRollNos, activity]);

  return (
    <>
      <div className="extract">
        <div className="extract-button-group">
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
          <br />
          <br />
          select event
          <select
            name="export-category"
            id="export-category"
            onChange={(e) => {
              setActivity(e.target.value);
            }}
          >
            <option value="">All</option>
            <option value="Project Presentation">Project Presentation</option>
            <option value="Paper Presentation">Paper Presentation</option>
          </select>
          <br />
          <br />
          <button
            className="button extract-button"
            onClick={() => {
              handleExtractAllDoc();
            }}
          >
            Extract all Documents"
          </button>
          <br />
          <br />
          <button
            className="button extract-button mt-3"
            onClick={() => {
              handleExtractPdf();
              setBeginSearch(true);
            }}
          >
            {pdfDownloadStatus ? "Downloading..." : "Extract PDFs"}
          </button>
          <br />
          <h6
            onClick={() => {
              navigate(-1);
            }}
            style={{ color: "#0155B7", cursor: "pointer" }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className=" me-2 bi bi-arrow-left"
              viewBox="0 0 16 16"
            >
              <path
                fillRule="evenodd"
                d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"
              />
            </svg>
            Go back
          </h6>
        </div>
      </div>
    </>
  );
};

export default SuperAdmin;
