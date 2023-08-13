import { Card, Stack, Typography, Box, Divider, Switch } from "@mui/material";
import { grey } from "@mui/material/colors";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";

type ListItemProps = {
  name: string;
};

export default function ListItem({ name }: ListItemProps) {
  return (
    <Card sx={{ bgcolor: "#343541" }}>
      <Box sx={{ p: 2, display: "flex" }}>
        <ChatBubbleIcon sx={{ color: grey[500] }} />
        <Stack spacing={0.5}>
          <Typography fontWeight={700}>{name}</Typography>
        </Stack>
      </Box>
      <Divider />
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ px: 2, py: 1, bgcolor: "#162433" }}
      >
        <Switch />
      </Stack>
    </Card>
  );
}
