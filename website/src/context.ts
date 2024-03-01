import { createContext } from "react";
import { Context } from "./States"

export const AppContext = createContext<null | Context>(null);