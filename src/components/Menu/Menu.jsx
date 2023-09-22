import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Button,
  Menu as ChakraMenu,
  MenuButton,
  MenuDivider,
  MenuGroup,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import React, { useEffect, useState } from "react";
import useUser from "../../customhooks/useUser";
import { fetchRecruiterDetails } from "../../services/fetchRecruiterDetails";

export function Menu() {
  const navigate = useNavigate();
  const { isAuthenticated, userId, userRole } = useUser();
  const [companyId, setCompanyId] = useState(null);

  useEffect(() => {
    if (isAuthenticated && userId && userRole === "Recruiter") {
      const token = localStorage.getItem("token");
      fetchRecruiterDetails(userId, token)
        .then((data) => {
          setCompanyId(data.companyId);
        })
        .catch((error) => {
          console.error("Error fetching recruiter details:", error);
        });
    }
  }, [isAuthenticated, userId, userRole]);

  const handleLogout = () => {
    const token = localStorage.getItem("token");
    const refreshToken = localStorage.getItem("refreshToken");
    axios
      .post("https://localhost:7013/api/Accounts/Logout", null, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        window.dispatchEvent(new Event("storage"));
        navigate("/");
      })
      .catch((error) => {
        console.error("An error occurred during logout:", error);
      });
  };
  return (
    <ChakraMenu>
      <MenuButton bg={"transparent"} as={Button}>
        <HamburgerIcon boxSize={6} cursor={"pointer"} />
      </MenuButton>
      <MenuList>
        <MenuGroup title="Profile">
          <MenuItem onClick={() => navigate(`/profile/${userId}`)}>
            My Account
          </MenuItem>

          {userRole === "Recruiter" && (
            <MenuItem
              onClick={() => {
                if (companyId) {
                  navigate("/companydetails");
                } else {
                  navigate("/companydetailform");
                }
              }}
            >
              Company Details
            </MenuItem>
          )}
          <MenuItem onClick={() => navigate(`/payments/${userId}`)}>
            Payments{" "}
          </MenuItem>
        </MenuGroup>
        <MenuDivider />
        <MenuItem color="#2557a7" onClick={handleLogout}>
          Sign out
        </MenuItem>
      </MenuList>
    </ChakraMenu>
  );
}
