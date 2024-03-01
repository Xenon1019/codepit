import { Problem, ProblemHeader, User } from "./States";

async function getProblemsList(path: string)
    : Promise<ProblemHeader[] | null> {
    return fetch(path + `problem/list`, { method: "GET", credentials: "include" })
        .then(res => {
            if (res.status === 200)
                return res.json();
            else return Promise.reject()
        }).catch(() => null);
}

async function getProblem(path: string, num: number)
    : Promise<Problem | null> {
    return fetch(path + `problem/${num}`,
        { method: "GET", credentials: "include" })
        .then(res => {
            if (res.status === 200)
                return res.json();
            else return res.text()
        }).then(res => {
            if (typeof res === 'string') {
                return null;
            }
            return res as Problem
        }).catch(() => null);
}

async function ping(path: string): Promise<User | null> {
    return fetch(path + 'ping', { method: "GET", credentials: "include"})
        .then(res => {
            if (res.status == 200)
                return res.json()
            return res.text()
        }).then(res => {
            if (typeof res == 'string') {
                console.log(res);
                return null
            }
            return res as User
        }).catch()
}

export { getProblem, getProblemsList, ping }