import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import Typography from "@mui/joy/Typography";
import Button from "@mui/joy/Button";
import Stack from "@mui/joy/Stack";
import Box from "@mui/joy/Box";

import { useContext } from "react";

import AppContext from "../context";
import { User } from "../States";

function Header(props: { user: User | null }) {
    const ctx = useContext(AppContext);
    const user = props.user;
    let isLandingPage = ctx?.flowStateStatus == "landed";
    return (
        <Box
            display="flex"
            alignItems="center"
            justifyContent={isLandingPage ? "center" : "space-between"}
            p={(isLandingPage)?4:2}
        >
            <Logo />
            {(!isLandingPage) ? (
                <Box display="flex" justifyContent="center" alignItems="center" gap={1.6}>
                    <Button size="sm" variant="outlined" sx={{
                        display: "flex",
                        placeItems: "center"
                    }} onClick={() => {
                        fetch(ctx?.apiAddress + 'user/logout', {
                            method: "POST",
                            credentials: "include"
                        }).then(() => {
                            ctx?.dispatch({type: "logout"})
                        })
                    }}>
                        <Typography>Logout</Typography>
                    </Button>
                    <Stack alignItems="center" gap={0.5} maxWidth={'5em'} textAlign={"center"}>
                        <AccountCircleOutlinedIcon sx={{ fontSize: 45 }} />
                        <Typography level="body-sm" display={['none', 'block']} textTransform="capitalize">
                            {(user == null) ? "user" : user.name}
                        </Typography>
                    </Stack>
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