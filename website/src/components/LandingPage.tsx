import ModalDialog from "@mui/joy/ModalDialog";
import ModalClose from "@mui/joy/ModalClose";
import Typography from "@mui/joy/Typography";
import { useTheme } from "@mui/joy/styles";
import FormLabel from "@mui/joy/FormLabel"
import Button from "@mui/joy/Button";
import Modal from "@mui/joy/Modal";
import Input from "@mui/joy/Input";
import Stack from "@mui/joy/Stack";
import Box from "@mui/joy/Box"

import { useContext, useRef, useState } from "react";

import { User, ProblemHeader } from "../States";
import { getProblemsList } from "../api";
import AppContext from "../context";


type LandingState = "none" | "login" | "register" | "loading";

function LoginForm() {
    const ctx = useContext(AppContext);
    // Clean up the business logic for fetch api
    // Extract it out to a function or something

    return <>
        <form onSubmit={e => {
            e.preventDefault();
            const form = e.target as HTMLFormElement;
            fetch(ctx?.apiAddress + 'user/login', {
                method: "POST",
                body: JSON.stringify(Object.fromEntries(new FormData(form))),
                credentials: "include"
            }).then(res => {
                if (res.status == 200)
                    return res.json()
                return res.text()
            }).then(res => {
                if (typeof res === 'string') {
                    console.error("error:", res)
                } else {
                    ctx?.dispatch({ type: "login", user: res as User })
                    return getProblemsList(ctx?.apiAddress!);
                }
            }).then(res => {
                if (res == null)
                    return;
                ctx?.dispatch({ type: "gotProblems", problemList: res as ProblemHeader[] })
            })
        }}>
            <Stack spacing={2}>
                <Box>
                    <FormLabel>Username</FormLabel>
                    <Input name="username" />
                </Box>
                <Box>
                    <FormLabel>Password</FormLabel>
                    <Input name="password" type="password" />
                </Box>
                <Button type="submit">Login</Button>
            </Stack>
        </form>
    </>
}

function RegisterForm() {
    const ctx = useContext(AppContext);
    return <form onSubmit={e => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        fetch(ctx?.apiAddress + 'user/add', {
            method: "PUTa",
            body: JSON.stringify(Object.fromEntries(new FormData(form))),
            credentials: "include"
        }).then(res => {
            if (res.status == 200)
                return Promise.resolve("User registered");
            else return Promise.reject(res);
        }).then(() => {

        }).catch((res: Response) => res.text().then(res => console.log(res)))
    }}>
        <Stack spacing={2}>
            <Box>
                <FormLabel>Name</FormLabel>
                <Input name="name" />
            </Box>
            <Box>
                <FormLabel>Email</FormLabel>
                <Input name="email" type="email" />
            </Box>
            <Box>
                <FormLabel>Username</FormLabel>
                <Input name="username" />
            </Box>
            <Box>
                <FormLabel>Password</FormLabel>
                <Input name="password" type="password" />
            </Box>
            <Button type="submit">Login</Button>
        </Stack>
    </form>
}

function LandingBody() {
    const theme = useTheme();
    const [landingState, setLandingState] = useState<LandingState>("none");

    return (<>
        <Modal open={landingState != "none"}
            onClose={() => setLandingState("none")}>
            <Box width={['90%', '75%', '60%']}
                p={[1, 3]}
                display="flex"
                justifyContent="center"
                alignItems="center"
                height="100%">
                <ModalDialog>
                    <ModalClose />
                    <Typography level='h2' textAlign='center'>
                        {(landingState == "login") ? "Login" :
                            (landingState == "register" ? "Register" : "Loading")}
                    </Typography>
                    {
                        (landingState == "login") ? <LoginForm /> : <RegisterForm />
                    }
                </ModalDialog>
            </Box>
        </Modal >
        {/* <Modal open={langingState !== ""} */}
        <Box display="flex"
            justifyContent="center"
            alignItems="center"
            flexGrow={1}
            sx={{
                flexDirection: ['column', 'row'],
                gap: {
                    xs: "1rem"
                }
            }}>
            <Box sx={{
                px: 2,
                width: ['80%', '50%']
            }}>
                <Typography
                    level="h2"
                    textAlign="center"
                    p={[2, 4]}
                    sx={{
                        textShadow: "0 0 2em #ffffffa6"
                    }}>
                    Elevate Your Skills in the <Typography level="h1">CodePit</Typography> : Solve, Learn, Excel
                </Typography>
            </Box>
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                width={{ sm: "50%", md: "50%" }}
                px={2}>
                <Stack
                    spacing={2}
                    alignItems="center"
                    justifyContent="center"
                    p={3}
                    sx={{
                        width: {
                            sm: "10rem",
                            md: "10rem"
                        },
                    }}>
                    <Button onClick={() => setLandingState("login")} size="md"
                        sx={{
                            width: `100%`,
                            boxShadow: `0 0 7em ${theme.vars.palette.primary.solidBg}`
                        }}>
                        Login
                    </Button>
                    <Button onClick={() => setLandingState("register")} size="md"
                        sx={{
                            width: "100%",
                            boxShadow: `0 0 7em ${theme.vars.palette.primary.solidBg}`
                        }}>
                        Register
                    </Button>
                </Stack>
            </Box>
        </Box >
    </>);
}

export default LandingBody;