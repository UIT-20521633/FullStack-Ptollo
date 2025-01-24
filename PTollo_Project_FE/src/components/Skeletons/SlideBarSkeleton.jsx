import React from "react";
import { Users } from "lucide-react";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Avatar from "@mui/material/Avatar";
import Skeleton from "@mui/material/Skeleton";

const SidebarSkeleton = () => {
  // Create 8 skeleton items
  const skeletonContacts = Array(8).fill(null);

  return (
    <Box
      component="aside"
      sx={{
        height: "100%",
        borderRight: 1,
        borderColor: "divider",
        display: "flex",
        flexDirection: "column",
        transition: "all 0.2s",
      }}>
      {/* Header */}
      <Box
        sx={{
          borderBottom: 1,
          borderColor: "divider",
          p: 2,
        }}>
        <Box display="flex" alignItems="center" gap={2}>
          <Users width={24} height={24} />
          <Typography
            variant="body1"
            fontWeight="medium"
            sx={{ display: { xs: "none", lg: "block" } }}>
            Contacts
          </Typography>
        </Box>
      </Box>

      {/* Skeleton Contacts */}
      <Box
        sx={{
          overflowY: "auto",
          py: 2,
        }}>
        <List>
          {skeletonContacts.map((_, idx) => (
            <ListItem
              key={idx}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                p: 2,
              }}>
              {/* Avatar skeleton */}
              <Avatar
                sx={{
                  width: 48,
                  height: 48,
                  bgcolor: "grey.300",
                }}>
                <Skeleton variant="circular" width={48} height={48} />
              </Avatar>

              {/* User info skeleton - only visible on larger screens */}
              <Box sx={{ display: { xs: "none", lg: "block" }, flex: 1 }}>
                <Skeleton
                  variant="text"
                  width="80%"
                  height={24}
                  sx={{ mb: 1 }}
                />
                <Skeleton variant="text" width="50%" height={18} />
              </Box>
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  );
};

export default SidebarSkeleton;
