import { useNavigate } from "react-router-dom"; // Import useNavigate
import axios from "axios"; // Import axios if it's not already imported
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
import React from "react";

export function Menu() {
  const navigate = useNavigate();

  const handleLogout = () => {
    const token = localStorage.getItem("token");
    axios
      .post("https://localhost:7013/api/Accounts/Logout", null, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        localStorage.removeItem("token");
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
          <MenuItem>My Account</MenuItem>
          <MenuItem>Payments </MenuItem>
        </MenuGroup>
        <MenuDivider />
        <MenuGroup title="Help">
          <MenuItem>Docs</MenuItem>
          <MenuItem>FAQ</MenuItem>
        </MenuGroup>
        <MenuDivider />
        <MenuItem color="#2557a7" onClick={handleLogout}>
          Sign out
        </MenuItem>
      </MenuList>
    </ChakraMenu>
  );
}
