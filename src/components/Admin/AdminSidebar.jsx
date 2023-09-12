import React from "react";
import {
  IconButton,
  Avatar,
  Box,
  CloseButton,
  Flex,
  HStack,
  VStack,
  Icon,
  useColorModeValue,
  Text,
  Drawer,
  DrawerContent,
  useDisclosure,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import {
  FiHome,
  FiSettings,
  FiMenu,
  FiTrendingUp,
  FiBriefcase,
  FiUser,
  FiFileText,
  FiMail,
} from "react-icons/fi";

const AdminLinkItems = [
  { name: "Home", icon: FiHome, path: "/home" },
  { name: "User Management", icon: FiUser, path: "/usermanagement" },
  { name: "Company Management", icon: FiBriefcase, path: "/companymanagement" },
  { name: "Review Management", icon: FiMail, path: "/reviewmanagement" },
  { name: "Reports", icon: FiFileText, path: "/reports" },
  { name: "Analytics", icon: FiTrendingUp, path: "/analytics" },
  { name: "Settings", icon: FiSettings, path: "/adminsettings" },
];

const AdminSidebarContent = ({ onClose, ...rest }) => (
  <Box
    transition="3s ease"
    bg={"blue.900"}
    borderRight="1px"
    borderRightColor={useColorModeValue("gray.200", "gray.700")}
    w={{ base: "full", md: 60 }}
    pos="fixed"
    h="full"
    {...rest}
  >
    <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
      <Text
        color={"white"}
        fontSize="2xl"
        fontFamily="monospace"
        fontWeight="bold"
      >
        Admin Panel
      </Text>
      <CloseButton display={{ base: "flex", md: "none" }} onClick={onClose} />
    </Flex>
    {AdminLinkItems.map((link) => (
      <NavItem key={link.name} icon={link.icon} path={link.path}>
        {link.name}
      </NavItem>
    ))}
  </Box>
);

const NavItem = ({ icon, children, path, ...rest }) => (
  <Link to={path || "#"} style={{ textDecoration: "none" }}>
    <Flex
      align="center"
      p="4"
      mx="4"
      borderRadius="lg"
      role="group"
      cursor="pointer"
      color={"white"}
      _hover={{
        bg: "cyan.400",
        color: "white",
      }}
      {...rest}
    >
      {icon && (
        <Icon
          mr="4"
          fontSize="16"
          _groupHover={{
            color: "white",
          }}
          as={icon}
        />
      )}
      {children}
    </Flex>
  </Link>
);

export const AdminSidebarWithHeader = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Flex minH="100vh" bg={useColorModeValue("gray.100", "gray.900")}>
      <AdminSidebarContent
        onClose={() => onClose}
        display={{ base: "none", md: "block" }}
      />
      <Box flex="1" ml={{ base: 0, md: 60 }} p="4">
        {children}
      </Box>
    </Flex>
  );
};

export default AdminSidebarWithHeader;
