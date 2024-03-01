import { Problem } from "../States";
import { getProblem } from "../api";
import AppContext from "../context";

import Typography from "@mui/joy/Typography";

import { useState, useContext } from "react";


function ProblemView(props: { problem: null | number }) {
    const [problem, setProblem] = useState<null | Problem>(null);
    const ctx = useContext(AppContext);

    getProblem(ctx?.apiAddress!, props.problem!)
        .then(res => {
            if (res !== null)
                setProblem(res);
        });
    return <Typography>
        {(props.problem === null) ? "No problem" : problem?.title}
    </Typography>
}

export default ProblemView;