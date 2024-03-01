import { Dispatch } from "react";



interface AppState {
    status: FlowState;
    user: User | null;
    problemList: ProblemHeader[] | null
    problemView: number | null
    userView?: string
}

type FlowState = "landed" | "loggedIn" | "problemView" | "userView";

interface FlowAction {
    type: "login" | "logout" | "viewProblem" | "viewUser" | "gotProblems";
    problemNumber?: number;
    user?: User;
    userView?: string
    problemList?: ProblemHeader[]
}

type ProblemHeader = {
    number: number;
    title: string;
    difficulty: number;
}

type Problem = {
    number: number;
    title: string;
    solved: boolean;
    difficulty: "easy" | "medium" | "hard";
    description: string;
    testCases: {
        input: string;
        output: string;
        inputType: string;
        outputType: string;
    }[];
    constraints: {
        type: string;
        constraint: string;
    }[]
};

type User = null | {
    name: string;
    username: string;
    email: string;
    problemSolvedCount: number;
    isAdmin: boolean;
    problemsSolved: number[];
};

interface Context {
    dispatch: Dispatch<FlowAction>;
    flowStateStatus: FlowState;
    apiAddress: string;
}

export {
    User,
    Context,
    Problem,
    FlowState,
    FlowAction,
    ProblemHeader,
    AppState
}

