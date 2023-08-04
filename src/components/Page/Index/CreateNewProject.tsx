import { Box, Button, Dialog, DialogContent, TextField } from "@mui/material";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Project } from "@/Functions/Files/project";

export default function CreateNewProject({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const router = useRouter();
  const [isValidName, setIsValidName] = useState(true);
  const [projectName, setProjectName] = useState("");

  const onClick = () => {
    setIsValidName(Project.testProjectName(projectName));
    if (isValidName) {
      Project.create(projectName).then(async dirName => {
        await router.push(`/edit/${dirName}`);
      });
    }
  };

  useEffect(() => {
    if (!open) {
      setIsValidName(true);
      setProjectName("");
    }
  }, [open]);

  return (
    <Dialog onClose={() => setOpen(false)} open={open}>
      <DialogContent>
        <Box display="flex" flexDirection="column" gap="20px">
          <Box marginBottom="10px">後から変更可能です</Box>
          <TextField
            error={!isValidName}
            helperText={`" \\ : * ? < > | は使用できません`}
            label="プロジェクト名"
            onChange={e => setProjectName(e.target.value)}
            value={projectName}
          />

          <Box display="flex" justifyContent="right">
            <Button onClick={onClick} variant="contained">
              作成
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
