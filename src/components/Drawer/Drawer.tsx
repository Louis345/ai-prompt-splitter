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
import NewSplitterButton from "../../components/NewSplitterButton/NewSplitterButton";
import { Link } from "react-router-dom";
import { Button } from "@mui/material";
import DrawerItem from "../DrawerItem/DrawerItem";

const drawerWidth = 240;

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
  summaries?: {
    title: string;
    chunks: string[];
  }[];
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  // ... Your styles ...
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  // ... Your styles ...
}));

interface HeaderDrawerProps {
  open?: boolean;
  handleDrawerOpen?: () => void;
  handleDrawerClose?: () => void;
  createCollection: (title: string) => void;
  onClear: () => void;
  setOpen: (isOpen: boolean) => void;
}

const HeaderDrawer: React.FC<HeaderDrawerProps> = ({
  open,
  onClear,
  setOpen,
  createCollection,
  summaries,
  setSummaries,
}) => {
  const theme = useTheme();
  console.log("summaries", summaries);
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={() => {
              console.log("handleDrawerOpen");
              setOpen(true);
            }}
            edge="start"
            sx={{ mr: 2, ...(open && { display: "none" }) }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            <Link
              to="/summary"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              AI Code Splitter
            </Link>
          </Typography>
          <Button
            component={Link}
            to="/youtube-transcript"
            color="inherit"
            variant="text"
          >
            Go to Youtube Transcript
          </Button>
        </Toolbar>
      </AppBar>
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
            <NewSplitterButton
              onClick={() => {
                setSummaries((prevSummaries) => {
                  return [
                    ...prevSummaries,
                    {
                      title: "", // or "Untitled" or any default name you prefer
                      chunks: [],
                      id: Date.now(), // This is a temporary id using the current timestamp, assuming that you might replace this with an actual id once saved to the backend
                    },
                  ];
                });
              }}
            />
          </Box>
        </DrawerHeader>
        {summaries.map((summary, index) => (
          <DrawerItem
            key={index}
            title={summary.title}
            id={summary.id}
            onUpdateTitle={(newTitle) => {
              createCollection(newTitle);
              // You might also need to handle the update in the parent state
            }}
            onDelete={() => {
              // Handle the deletion logic here
              // You might want to remove this summary from the parent state
            }}
          />
        ))}
      </Drawer>
    </Box>
  );
};

export default HeaderDrawer;
