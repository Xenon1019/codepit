import { useContext } from "react";
import { AppContext } from "./context";

import Typography from "@mui/joy/Typography";
import Box from "@mui/joy/Box";

function Header() {
    const ctx = useContext(AppContext);
    let isLandingPage = ctx?.flowStateStatus == "landed";
    return (
        <Box
            display="flex"
            alignItems="center"
            justifyContent={isLandingPage ? "center" : "space-between"}
            p={4}
        >
            <Logo />
            {(!isLandingPage) ? (
                <Box>
                    <Typography>
                        User
                    </Typography>
                </Box>
            ) : <></>}
        </Box>

    )
}

function Logo() {
    return (
        <Typography
            level="h1"
            sx={{
                fontFamily: `'Share Tech Mono', monospace`,
                letterSpacing: `-0.05em`,
                userSelect: `none`
            }}
        >
            CodePit
        </Typography>
    )
}

export default Header;