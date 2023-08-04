import { useEffect, useState } from "react";
import { Button, Paper } from "@mui/material";
import { styled } from "@mui/material/styles";
import { Masonry } from "@mui/lab";
import ProjectCard from "@/components/Page/Index/ProjectCard";
import CreateNewProject from "@/components/Page/Index/CreateNewProject";
import { Project, ProjectData } from "@/Functions/Files/project";
import startup from "@/Functions/Files/startup";

const Paper_Wrapper = styled(Paper)(({ theme }) => ({
  "&::-webkit-scrollbar": {
    width: "10px",
  },
  "&::-webkit-scrollbar-thumb": {
    backgroundColor: theme.palette.primary.main,
    borderRadius: "5px",
  },
  alignItems: "stretch",
  display: "flex",
  flexWrap: "wrap",
  gap: "20px",
  height: "fit-content",
  overflowY: "scroll",

  padding: "20px",
  width: "100%",
}));
const DIV_Wrapper = styled("div")({
  display: "flex",
  flexDirection: "column",
  gap: "10px",
  height: "100%",
  padding: "50px",
});

export default function Home() {
  const [projects, setProjects] = useState([] as ProjectData[]);
  useEffect(() => {
    startup();
    Project.ls().then(v => setProjects(v));
  }, []);

  const [openCreateProjectDialog, setOpenCreateProjectDialog] = useState(false);
  return (
    <DIV_Wrapper>
      <div>
        <Button onClick={() => setOpenCreateProjectDialog(true)} variant="contained">
          新規プロジェクト
        </Button>
        <CreateNewProject open={openCreateProjectDialog} setOpen={setOpenCreateProjectDialog} />
      </div>
      <div>既存のプロジェクト</div>
      <Paper_Wrapper>
        <Masonry
          columns={{
            lg: 4,
            md: 3,
            sm: 2,
            xl: 5,
            xs: 1,
          }}
          spacing={2}
        >
          {projects.map(v => (
            <ProjectCard key={v.dirName} projectData={v} />
          ))}
        </Masonry>
      </Paper_Wrapper>
    </DIV_Wrapper>
  );
}
