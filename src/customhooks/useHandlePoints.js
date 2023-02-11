import  {  useState } from "react";

const useHandlePoints = ({ totalWeightage }) => {
  const [activityPoint, setActivityPoint] = useState(0);
  const calculateActivityPoints = () => {
    if (totalWeightage >= 80) {
      setActivityPoint(3);
    } else if (totalWeightage >= 50 && totalWeightage <= 79) {
      setActivityPoint(2);
    } else if (totalWeightage >= 20 && totalWeightage <= 49) {
      setActivityPoint(1);
    } else {
      setActivityPoint(0);
    }
  };
  return [activityPoint, calculateActivityPoints];
};

export default useHandlePoints;
