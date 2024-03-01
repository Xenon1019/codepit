import { useContext, useState, ReactElement, useId, forwardRef } from "react";

import { AppContext } from "./context";
import { User } from "./States";

import { useTheme } from "@mui/joy/styles";
import { styled } from '@mui/joy/styles';
import Box from "@mui/joy/Box"
import Modal from "@mui/joy/Modal";
import ModalClose from "@mui/joy/ModalClose";
import ModalDialog from "@mui/joy/ModalDialog";
import Typography from "@mui/joy/Typography";
import Button from "@mui/joy/Button";
import Input from "@mui/joy/Input";
import FormLabel from "@mui/joy/FormLabel"
import Stack from "@mui/joy/Stack";


function LoginForm() {
    const ctx = useContext(AppContext);

    return <>
        <form onSubmit={e => {
            e.preventDefault();
            const form = e.target as HTMLFormElement;
            const username = (form.elements.namedItem('username') as HTMLInputElement).value
            const password = (form.elements.namedItem('password') as HTMLInputElement).value
            console.log(form, username, password)
            if (password.length < 5)
                return;
            fetch(ctx?.apiAddress + 'user/login', {
                method:"POST",
                body: JSON.stringify(Object.fromEntries(new FormData(form)))
            }).then(res => {
                console.log(res)
            }).then((user) => {
                console.log(user)
            }).catch(err => console.log(err))
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
    return <></>
}

function LandingBody() {
    //Animation time in ms
    const theme = useTheme();
    const animationTime = 500;
    const [landingState, setLandingState] = useState<"none" | "login" | "register" | "loading">("none");
    const ctx = useContext(AppContext)!;


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