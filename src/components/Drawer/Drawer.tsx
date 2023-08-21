import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { Link, useNavigate } from "react-router-dom";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";

import DrawerItem from "../DrawerItem/DrawerItem";
import { Summary, UpdateCollectionParams } from "../../types";
import { useAuth } from "../../Context/AuthContext";
import { Menu, MenuItem } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";

import Cookies from "js-cookie";
import { useThemeContext } from "../../Context/ThemeContext";

const drawerWidth = 240;

const StyledAppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(() => {
  const { theme: localTheme } = useThemeContext();
  const muiTheme = useTheme();

  if (localTheme === "light") {
    return {
      backgroundColor: muiTheme.palette.primary.main, // Use the primary color from MUI theme
      color: "#333",
    };
  } else {
    return {
      backgroundColor: "#333",
      color: "#fff",
    };
  }
});

const DrawerHeader = styled("div")(({ theme }) => ({}));
const StyledDrawer = styled(Drawer)(() => {
  const { theme: localTheme } = useThemeContext();
  const muiTheme = useTheme(); // Get the MUI theme

  return {
    width: drawerWidth,
    flexShrink: 0,
    "& .MuiDrawer-paper": {
      width: drawerWidth,
      boxSizing: "border-box",
      background:
        localTheme === "light" ? muiTheme.palette.primary.main : "#202123", // Use the primary color from MUI theme for light mode
    },
  };
});

interface HeaderDrawerProps {
  open?: boolean;
  handleDrawerOpen?: () => void;
  handleDrawerClose?: () => void;
  updateCollection: (params: UpdateCollectionParams) => void;
  deleteCollection: (collectionId: string) => void;
  onClear: () => void;
  setOpen: (isOpen: boolean) => void;
  summaries: Summary[];
}

const HeaderDrawer: React.FC<HeaderDrawerProps> = ({
  open,
  onClear,
  setOpen,
  updateCollection,
  deleteCollection,
  summaries,
}) => {
  const theme = useTheme();
  const { theme: localTheme, toggleTheme } = useThemeContext();
  const { token, setToken } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => {
    setToken(null);
    Cookies.remove("token");
    navigate("/signin");
  };
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      {/*@ts-ignore*/}
      <StyledAppBar position="fixed" open={open}>
        <Toolbar>
          <Box sx={{ flexGrow: 1 }}>
            <IconButton
              aria-label="open drawer"
              onClick={() => {
                console.log("handleDrawerOpen");
                setOpen(true);
              }}
              edge="start"
              sx={{ mr: 2, ...(open && { display: "none" }) }}
              style={{ color: "#fff" }}
            >
              <MenuIcon style={{ color: "#fff" }} />
              <Typography variant="h6" noWrap>
                AI Code Splitter
              </Typography>
            </IconButton>
          </Box>
          {token && (
            <>
              <IconButton onClick={toggleTheme}>
                {localTheme === "light" ? (
                  <Brightness4Icon />
                ) : (
                  <Brightness7Icon />
                )}
              </IconButton>
              <IconButton color="inherit" onClick={handleClick}>
                <MoreVertIcon />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem component={Link} to="/summary" onClick={handleClose}>
                  AI Code Splitter
                </MenuItem>

                <MenuItem
                  component={Link}
                  to="/youtube-transcript"
                  onClick={handleClose}
                >
                  Go to Youtube Transcript
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    handleLogout();
                    handleClose();
                  }}
                >
                  Logout
                </MenuItem>
              </Menu>
            </>
          )}
        </Toolbar>
      </StyledAppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            background: "#202123",
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>
          <Box sx={{ display: "flex", marginBottom: "20px" }}>
            <IconButton onClick={() => setOpen(false)}>
              {theme.direction === "ltr" ? (
                <ChevronLeftIcon />
              ) : (
                <ChevronRightIcon />
              )}
            </IconButton>
          </Box>
        </DrawerHeader>
        {summaries.map((summary, index) => (
          <DrawerItem
            key={index}
            title={summary.title}
            id={summary.id.toString()}
            onUpdateTitle={(newTitle) => {
              updateCollection({ collectionId: summary.id, newName: newTitle });
            }}
            onDelete={() => {
              deleteCollection(summary.id.toString());
            }}
          />
        ))}
      </Drawer>
    </Box>
  );
};

export default HeaderDrawer;
