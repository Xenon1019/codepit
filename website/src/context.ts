import { createContext } from "react";
import { Context } from "./States"

const AppContext = createContext<null | Context>(null);

export default AppContext;