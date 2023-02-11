import { useEffect, useState } from "react";
import "../css/DashboardBody.css";
import "../App.css";
import bgimg from "../assets/default-background.png";
import {
  collection,
  doc,
  onSnapshot,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import Category1 from "./Category1";
import Category2 from "./Category2";
import Category3 from "./Category3";
import Category4 from "./Category4";
import Category5 from "./Category5";
import Category6 from "./Category6";
import Category7 from "./Category7";
import Category8 from "./Category8";
import Category9 from "./Category9";
import Category10 from "./Category10";
import Category11 from "./Category11";
import Category12 from "./Category12";
import useHandlePoints from "../customhooks/useHandlePoints";

const DashboardBody = ({ studentId }) => {
  const id = studentId;
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState([]);
  const [totalWeightage, setTotalWeightage] = useState(0);
  const [activityPoint, calculateActivityPoints] = useHandlePoints({
    totalWeightage,
  });

  const section = localStorage.getItem("adminSection");
  const dept = localStorage.getItem("adminDept");
  const year = localStorage.getItem("adminYear");

  const handleStorePoints = async () => {
    try {
      await setDoc(doc(db, `activitypoints`, id), {
        totalWeightage: totalWeightage,
        activityPoint: activityPoint,
        timeStamp: serverTimestamp(),
      });
      alert("stored");
    } catch (error) {
      alert(error);
    }
    const config = {
      SecureToken: "4cd9d7bd-ce92-4a0b-8385-69f7e23166a9 ",
      To: ["gowdamanish20@gmail.com", "manosundarm.21cse@kongu.edu"],
      From: "manishkumarr.19cse@kongu.edu",
      Subject: "Your SAP points are out",
      Body: "Your SAP points are out",
    };
    if (window.Email) {
      window.Email.send(config).then((message) => {
        alert("email sent successfully");
      });
    }
  };

  useEffect(() => {
    if (id) {
      setIsLoading(true);
      const unsub = onSnapshot(
        collection(
          db,
          `alldept/${dept}/years/${year}/sections/${section}/allStudents/${id}/all`
        ),
        (snapShot) => {
          let list = [];
          let weightage = 0;
          snapShot.docs.forEach((doc) => {
            list.push({ id: doc.id, ...doc.data() });
            if (doc.data().approval === "Approved") {
              weightage += doc.data().weightage;
            }
          });
          setTotalWeightage(weightage);
          setData(list);
          setIsLoading(false);
        },
        (error) => {
          setError("Error fetching data");
        }
      );
      return () => {
        unsub();
      };
    }
  }, [id]);

  useEffect(() => {
    calculateActivityPoints();
  }, [totalWeightage]);

  const downloadReport = () => {
    const element = document.getElementById("report");
    window.html2pdf(element).from().save();
  };

  return (
    <div className="dashboard-body-container" id="report">
      {id && isLoading ? (
        <div className="loading-container">
          <span className="loader"></span>
        </div>
      ) : id && !isLoading ? (
        <div className="details-container">
          <div className="details-header" >
            <h1>{id}</h1>
            <section className="eligible-points">
              <section>
                <h6>Total Weightage {totalWeightage}</h6>
                <h6>Activity Points {activityPoint}</h6>
              </section>
            </section>
            <section style={{ minWidth: "200px",display:"flex" }} >
              <button
                className="button save-points-button me-3"
                onClick={() => {
                  handleStorePoints();
                }}
              >
                Push to database
              </button>
              <button
                className="button save-points-button"
                onClick={() => {
                  downloadReport();
                }}
              >
                Download Report
              </button>
            </section>
          </div>
          <div className="all-categories">
            <Category1 data={data} id={id} />
            <Category2 data={data} id={id} />
            <Category3 data={data} id={id} />
            <Category4 data={data} id={id} />
            <Category5 data={data} id={id} />
            <Category6 data={data} id={id} />
            <Category7 data={data} id={id} />
            <Category8 data={data} id={id} />
            <Category9 data={data} id={id} />
            <Category10 data={data} id={id} />
            <Category11 data={data} id={id} />
            <Category12 data={data} id={id} />
          </div>
        </div>
      ) : (
        <div className="default-container">
          <img src={bgimg} alt="background image" />
        </div>
      )}
    </div>
  );
};

export default DashboardBody;
