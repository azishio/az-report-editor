import {
  Box,
  Button,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
} from "@mui/material";
import { useRouter } from "next/router";
import { styled } from "@mui/system";
import {
  Class,
  ContentCopy,
  DeleteForever,
  DriveFileRenameOutline,
  EventRepeat,
  InsertInvitation,
} from "@mui/icons-material";
import { useState } from "react";
import { Project, ProjectData } from "@/Functions/Files/project";

const Card_Project = styled(Card)({
  display: "flex",
  flexDirection: "column",
  width: 200,
});
export default function ProjectCard({ projectData }: { projectData: ProjectData }) {
  const router = useRouter();
  const { date_create, date_update, dirName } = projectData;
  const projectName = Project.toProjectName(dirName);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  return (
    <>
      <Box
        sx={{
          display: "flex",
          position: "relative",
        }}
      >
        <Button
          onClick={() => router.push(`/edit/${dirName}`)}
          sx={{
            height: "fit-content",
            padding: 0,
            textTransform: "none",
          }}
        >
          <Card_Project>
            <List
              dense
              sx={{
                "*": {
                  padding: 0,
                },
                padding: "10px",
              }}
            >
              <ListItem
                sx={{
                  alignItems: "flex-start",
                  display: "flex",
                }}
              >
                <ListItemIcon>
                  <Class fontSize="small" />
                </ListItemIcon>
                <Box
                  sx={{
                    ".MuiListItemText-primary": {
                      display: "inline",
                      width: "100%",
                      wordWrap: "break-word",
                    },
                  }}
                >
                  <ListItemText primary={projectName} />
                </Box>
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <InsertInvitation fontSize="small" />
                </ListItemIcon>
                <ListItemText primary={date_create} />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <EventRepeat fontSize="small" />
                </ListItemIcon>
                <ListItemText primary={date_update} />
              </ListItem>
            </List>
          </Card_Project>
        </Button>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Tooltip placement="right-end" title="名前の変更(未実装)">
            <IconButton>
              <DriveFileRenameOutline />
            </IconButton>
          </Tooltip>
          <Tooltip placement="right-end" title="フォルダパスをコピー（未実装）">
            <IconButton>
              <ContentCopy />
            </IconButton>
          </Tooltip>
          <Tooltip placement="right-end" title="削除">
            <IconButton onClick={() => setDeleteDialogOpen(true)}>
              <DeleteForever />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
      <Dialog
        aria-describedby="alert-dialog-description"
        aria-labelledby="alert-dialog-title"
        onClose={() => setDeleteDialogOpen(false)}
        open={deleteDialogOpen}
      >
        <DialogTitle>プロジェクトの削除</DialogTitle>
        <DialogContent>
          <DialogContentText>
            削除したプロジェクトは二度と復元できません。 削除しますか？
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>キャンセル</Button>
          <Button
            onClick={() => {
              const project = new Project(dirName);
              project.delete();
              router.reload();
            }}
          >
            削除
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
