import { useDropzone } from "react-dropzone";
import { useRouter } from "next/router";
import { Box } from "@mui/material";
import { Project } from "@/Functions/Files/project";
import { useAppDispatch } from "@/rudex/store";
import { pushFigureNames } from "@/rudex/Figure/FigureSlice";

export default function DropZone({ children }: { children: JSX.Element }) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const onDrop = (files: File[]) => {
    const project = new Project(router.query.dirName as string);
    Promise.all(files.map(file => project.writeImage(file))).then(async names => {
      dispatch(pushFigureNames(names.map(name => `${name}.jpeg`)));
    });
  };

  const { getInputProps, getRootProps } = useDropzone({
    accept: {
      "image/bmp": [".bmp"],
      "image/gif": [".gif"],
      "image/jpeg": [".jpeg", ".JPEG", ".jpg"],
      "image/png": [".png"],
      "image/svg+xml": [".svg"],
      "image/webp": [".webp"],
    },
    noClick: true,
    onDrop,
  });

  return (
    <Box
      {...getRootProps({
        className: "dropzone",
      })}
      sx={{
        background: "rgba(255, 0, 0, 0.5)",
        // 30px はtopBarの幅
        height: "calc(100% - 30px)",
        position: "absolute",
        width: "100%",
        zIndex: 11,
      }}
    >
      <input {...getInputProps()} />
      {children}
    </Box>
  );
}
