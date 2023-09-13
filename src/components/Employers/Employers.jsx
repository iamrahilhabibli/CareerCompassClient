import React, { useState, useEffect } from "react";
import useUser from "../../customhooks/useUser";
import { fetchRecruiterDetails } from "../../services/fetchRecruiterDetails";

export function Employers() {
  const { userId, token } = useUser(); // Assuming `token` is also available from `useUser`
  const [recruiterDetails, setRecruiterDetails] = useState(null);

  useEffect(() => {
    if (userId && token) {
      fetchRecruiterDetails(userId, token).then((details) => {
        console.log(details);
        setRecruiterDetails(details);
      });
    }
  }, [userId, token]);

  return (
    <>
      {recruiterDetails ? (
        <div>
          HELLO {recruiterDetails.firstName.toUpperCase()}{" "}
          {recruiterDetails.lastName.toUpperCase()}
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </>
  );
}
