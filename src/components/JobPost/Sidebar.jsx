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
} from "react-icons/fi";

const LinkItems = [
  { name: "Home", icon: FiHome, path: "/home" },
  { name: "Post a Job", icon: FiBriefcase, path: "/postjob" },
  { name: "Messages", icon: FiMessageSquare },
  { name: "Applicants", icon: FiStar },
  { name: "Settings", icon: FiSettings },
];

const Header = ({ onOpen }) => (
  <Flex
    as="nav"
    align="center"
    justify="space-between"
    wrap="wrap"
    padding="1rem"
    bg={useColorModeValue("blue.500", "blue.800")}
    color={useColorModeValue("white", "gray.200")}
  >
    <Flex align="center" mr={5}>
      <Text fontSize="lg" fontWeight="bold">
        Company Name
      </Text>
    </Flex>
    <HStack spacing={8} alignItems="center">
      <HStack as="nav" spacing={4} display={{ base: "none", md: "flex" }}>
        {LinkItems.map((link) => (
          <Text key={link.name} fontSize="md">
            {link.name}
          </Text>
        ))}
      </HStack>
    </HStack>
    <Box display={{ base: "flex", md: "none" }}>
      <IconButton
        icon={<FiMenu />}
        onClick={onOpen}
        variant="outline"
        aria-label="Open menu"
      />
    </Box>
  </Flex>
);

const SidebarContent = ({ onClose, ...rest }) => (
  <Box
    transition="3s ease"
    bg={useColorModeValue("white", "gray.900")}
    borderRight="1px"
    borderRightColor={useColorModeValue("gray.200", "gray.700")}
    w={{ base: "full", md: 60 }}
    pos="fixed"
    h="full"
    {...rest}
  >
    <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
      <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold">
        Logo
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

const MobileNav = ({ onOpen, ...rest }) => {};

export const SidebarWithHeader = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box minH="100vh" bg={useColorModeValue("gray.100", "gray.900")}>
      <SidebarContent
        onClose={() => onClose}
        display={{ base: "none", md: "block" }}
      />
      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full"
      >
        <DrawerContent>
          <SidebarContent onClose={onClose} />
        </DrawerContent>
      </Drawer>
      {/* mobilenav */}
      <MobileNav onOpen={onOpen} />
      <Box ml={{ base: 0, md: 60 }} p="4">
        {/* Content */}
      </Box>
    </Box>
  );
};
