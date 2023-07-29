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

const drawerWidth = 240;

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
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
  open: boolean;
  handleDrawerOpen: () => void;
  handleDrawerClose: () => void;
  summaries: { title: string; chunks: any[] }[];
  onClear: () => void;
  setOpen: (isOpen: boolean) => void;
}

const HeaderDrawer: React.FC<HeaderDrawerProps> = ({
  open,
  onClear,
  setOpen,
}) => {
  const theme = useTheme();
  console.log("open", open);
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
            AI Code Splitter
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
          <IconButton onClick={() => setOpen(false)}>
            {theme.direction === "ltr" ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <NewSplitterButton onClick={onClear} />
      </Drawer>
    </Box>
  );
};

export default HeaderDrawer;
