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
  FiStar,
  FiSettings,
  FiMenu,
  FiBriefcase,
  FiMessageSquare,
  FiMap,
  FiPlus,
  FiBookmark,
} from "react-icons/fi";

const LinkItems = [
  { name: "Home", icon: FiHome, path: "/home" },
  { name: "Post a Job", icon: FiPlus, path: "/postjob" },
  { name: "Main", icon: FiMap, path: "/employerscareercompass" },
  { name: "Jobs", icon: FiBriefcase, path: "/vacancieslist" },
  { name: "Messages", icon: FiMessageSquare, path: "/messages" },
  { name: "Planner", icon: FiBookmark, path: "/planner" },
  { name: "Applicants", icon: FiStar, path: "/applicants" },
];

const SidebarContent = ({ onClose, ...rest }) => (
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
        Recruiter Dashboard
      </Text>
      <CloseButton display={{ base: "flex", md: "none" }} onClick={onClose} />
    </Flex>
    {LinkItems.map((link) => (
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

export const SidebarWithHeader = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Flex minH="100vh" bg={useColorModeValue("gray.100", "gray.900")}>
      <SidebarContent
        onClose={() => onClose}
        display={{ base: "none", md: "block" }}
      />

      <Box flex="1" ml={{ base: 0, md: 60 }} p="4">
        {children}
      </Box>
    </Flex>
  );
};
