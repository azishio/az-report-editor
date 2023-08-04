import { Box, Button, IconButton, Skeleton, Tooltip, Zoom } from "@mui/material";
import { styled } from "@mui/system";
import { TransitionGroup } from "react-transition-group";
import { useRouter } from "next/router";
import { DeleteForever } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/rudex/store";
import { Project } from "@/Functions/Files/project";
import { deleteFigureName } from "@/rudex/Figure/FigureSlice";

const DIV_ImageBox = styled("div")({
  "::-webkit-scrollbar": {
    display: "none",
  },
  display: "flex",
  height: "100%",
  overflowY: "scroll",
  position: "relative",

  transition: "500ms",
});
export default function Images() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const imageNameArr = useAppSelector(state => state.figure.names);
  const project = new Project(router.query.dirName as string);

  const [images, setImages] = useState({} as { [name: string]: string });

  useEffect(() => {
    imageNameArr.forEach(name => {
      if (!(name in images)) {
        project.readImageBinary(name).then(image => {
          setImages(before => ({
            ...before,
            [name]: image,
          }));
        });
      }
    });

    const { entries, fromEntries, keys } = Object;
    const deleted = keys(images).filter(name => !imageNameArr.includes(name));
    if (deleted.length !== 0) {
      setImages(before => fromEntries(entries(before).filter(v => !deleted.includes(v[0]))));
    }
  }, [imageNameArr.length]);

  const deleteFigure = (name: string) => {
    project.removeImage(name).then(async () => {
      dispatch(deleteFigureName(name));
    });
  };

  return (
    <DIV_ImageBox>
      {imageNameArr.length === 0 && (
        <Box
          border="solid black"
          color="gray"
          height="100px"
          margin="20px"
          textAlign="center"
          whiteSpace="nowrap"
          width="150px"
        >
          No Images
        </Box>
      )}
      <TransitionGroup>
        {imageNameArr.map((name, i) => (
          <Zoom key={name}>
            <Box margin="20px" position="relative">
              {images[name] ? (
                <>
                  <Tooltip title="クリップボードにコピー">
                    <Button
                      onClick={() => {
                        navigator.clipboard.writeText(name.slice(0, 2)); // 画像名は拡張子を除いて2文字
                      }}
                      sx={{ textTransform: "none" }}
                    >
                      <Box width="150px">
                        <Box
                          component="img"
                          src={images[name]}
                          sx={{
                            border: "solid black",
                            width: "150px",
                          }}
                        />
                        <Box textAlign="center">
                          {imageNameArr[i] && imageNameArr[i].slice(0, 2)}
                        </Box>
                      </Box>
                    </Button>
                  </Tooltip>
                  <Box position="absolute" right={0} top={0}>
                    <Tooltip title="削除">
                      <IconButton onClick={() => deleteFigure(imageNameArr[i])}>
                        <DeleteForever />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </>
              ) : (
                <Skeleton animation="wave" height={100} variant="rectangular" width="100%" />
              )}
            </Box>
          </Zoom>
        ))}
      </TransitionGroup>
    </DIV_ImageBox>
  );
}
