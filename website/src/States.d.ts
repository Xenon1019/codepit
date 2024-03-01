import { Dispatch } from "react";

interface AppState {
    status: FlowState;
    [prop: string]: any;
}

interface FlowAction {
    type: "login" | "logout" | "viewProblem" | "viewUser";
    problemNumber?: number;
    user?: string;
}

type FlowState = "landed" | "loggedIn" | "problemView" | "userView";

type Problem = null | {
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
    username: string;
    email: string;
    problemSolvedCount: number;
    isAdmin: boolean;
    problemsSolved: number[];
};

interface Context {
    dispatch?: Dispatch<FlowAction>;
    flowStateStatus: FlowState;
    apiAddress: string;
}

export {
    User,
    Context,
    Problem,
    FlowState,
    FlowAction,
    AppState
}

