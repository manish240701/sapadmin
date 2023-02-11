import { collection, onSnapshot } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import "../App.css";
import "../css/Extract.css";
import { db } from "../firebase";
import * as XLSX from "xlsx";
import JSZip from "jszip";
import { Link, Navigate, useNavigate } from "react-router-dom";

const Extract = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  let [rollNos, setRollNos] = useState([]);
  const zip = new JSZip();
  const [isLoading, setIsLoading] = useState(true);
  const [fetchedRollNos, setFetchedRollNos] = useState(false);
  const [pdfLinks, setPdfLinks] = useState();
  const [activityData, setActivityData] = useState({});
  const [pdfDownloadStatus, setPdfDownloadStatus] = useState(false);
  const section = localStorage.getItem("adminSection");
  const dept = localStorage.getItem("adminDept");
  const year = localStorage.getItem("adminYear");
  const [filter, setFilter] = useState("");
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
    let list = [];
    const unsub = onSnapshot(
      collection(
        db,
        `allUsers/${dept}/allYears/${year}/allSections/${section}/allUsers`
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
  }, []);

  useEffect(() => {
    let links = [];
    console.log(rollNos + "rollnos");
    rollNos.forEach((id, index) => {
      const unsub = onSnapshot(
        collection(
          db,
          `alldept/${dept}/years/${year}/sections/${section}/allStudents/${id}/all`
        ),
        (snapShot) => {
          let list = [];
          snapShot.docs.forEach((doc) => {
            list.push({ id: doc.id, ...doc.data() });
            if (filter !== "") {
              if (doc.data().activityCategory === filter) {
                links.push({ pdf: doc.data()["pdf"] });
              }
            } else {
              links.push({ pdf: doc.data()["pdf"] });
            }
          });
          let values = links.map((l) => l.pdf);
          setPdfLinks(values);
          console.log(pdfLinks);
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
  }, [fetchedRollNos, filter]);

  return (
    <>
      {isLoading ? (
        <div className="loading-container">
          <span className="loader"></span>
        </div>
      ) : (
        <div className="extract">
          <div className="extract-button-group">
            <h1>Extract Data</h1>
            <h6>You will need to use a CORS extension to download the pdf</h6>
            <a
              href="https://chrome.google.com/webstore/detail/allow-cors-access-control/lhobafahddgcelffkeicbaginigeejlf?hl=en"
              className="extension-link"
            >
              Extension Link
            </a>
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
            <select
              name="export-category"
              id="export-category"
              onChange={(e) => {
                setFilter(e.target.value);
              }}
            >
              <option value="" style={{ display: "none" }}>
                Activity Filters
              </option>
              <option value="Project Presentation">Project Presentation</option>
              <option value="Paper Presentation">Paper Presentation</option>
            </select>

            <br />
            <button
              className="button extract-button mt-3"
              onClick={() => {
                handleExtractPdf();
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
      )}
    </>
  );
};

export default Extract;
