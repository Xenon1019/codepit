import ListItemContent from "@mui/joy/ListItemContent";
import ListItemButton from "@mui/joy/ListItemButton";
import ListDivider from "@mui/joy/ListDivider";
// import Skeleton from "@mui/joy/Skeleton";
import Typography from "@mui/joy/Typography";
import ListItem from "@mui/joy/ListItem";
import Chip from "@mui/joy/Chip";
import List from "@mui/joy/List";
import Box from "@mui/joy/Box";

import { ProblemHeader } from "../States";
import AppContext from "../context";

import { useContext } from "react";

function DifficultyChip(props: { difficulty: number }) {
    switch (props.difficulty) {
        case 0:
            return <Chip variant="solid" color="success">
                <Typography>Easy</Typography>
            </Chip>
        case 1:
            return <Chip variant="solid" color="warning">
                <Typography>Medium</Typography>
            </Chip>
        case 2:
            return <Chip variant="solid" color="danger">
                <Typography>Hard</Typography>
            </Chip>
        default:
            return <Chip variant="solid" color="neutral">
                <Typography>Unknown</Typography>
            </Chip>
    }

}


function ProblemListView(props: { problems: ProblemHeader[] | null }) {
    const ctx = useContext(AppContext);
    const problemList = props.problems;


    return <Box sx={{
        flexGrow: 1,
    }}>
        <Box sx={{
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
        }}>
            <List variant="outlined" sx={{
                width: ["95%", "70%"],
                borderRadius: 'sm',
                backgroundColor: '#ffffff0a',
                flexGrow: 0,
            }}>
                {problemList != null && problemList.map(problem => {
                    return <>
                        <ListItem key={problem.number}>
                            <ListItemButton onClick={() => {
                                ctx?.dispatch({ type: "viewProblem", problemNumber: problem.number})
                            }}>
                                <ListItemContent sx={{
                                    display: "flex",
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                }}>
                                    <Typography level="h4">{problem.number}.</Typography>
                                    <Typography level="title-lg" marginInlineStart={2} flexGrow={1}>{problem.title}</Typography>
                                    <DifficultyChip difficulty={problem.difficulty} />
                                </ListItemContent>
                            </ListItemButton>
                        </ListItem>
                        <ListDivider key={problem.number * 10} sx={{
                            ':last-child': {
                                display: 'none'
                            }
                        }} />
                    </>
                })}
            </List>
        </Box>
    </Box>
}

export default ProblemListView;