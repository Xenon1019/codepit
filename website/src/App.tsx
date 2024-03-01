import { useReducer, useRef } from 'react';

import ProblemListView from './components/ProblemsListView';
import { AppState, FlowAction, User } from './States';
import ProblemView from './components/ProblemView';
import Header from './components/Header';
import LandingBody from './components/LandingPage';
import { getProblemsList, ping } from './api';
import AppContext from './context';

import backgroundImg from './assets/background.jpg'

import Stack from '@mui/joy/Stack';
import '@fontsource/inter';

function App() {
  const [appState, flowDispatcher] = useReducer(appStateReducer, {
    status: "landed",
    user: null,
    problemList: null,
    problemView: null,
  })
  let isFirstRender = useRef(true);
  let address = "http://localhost:9000/api/";


  if (isFirstRender.current) {
    isFirstRender.current = false;
    console.log("About to ping from here")                      //DEBUG: breakpoint
    ping(address).then((res: User | null) => {
      if (res === null) return Promise.reject();
      flowDispatcher({ type: "login", user: res })
      console.log("About to get Problems list")                  //DEBUG: breakpoint
      return getProblemsList(address)
    }).then(res => {
      if (res != null)
        flowDispatcher({ type: "gotProblems", problemList: res })
      else
        console.log("Could not get problems");                 //DEBUG:breakpoint
    })
  }

  let body: React.ReactElement;
  if (appState.status === "landed")
    body = <LandingBody />
  else if (appState.status === "loggedIn") {
    body = <ProblemListView problems={appState.problemList} />
  } else if (appState.status === "problemView") {
    body = <ProblemView problem={appState.problemView} />
  } else {
    body = <h1>TO be implemented</h1>
  }
  return (
    <AppContext.Provider value={{
      dispatch: flowDispatcher,
      apiAddress: address,
      flowStateStatus: appState.status
    }}>
      <Stack height="100%" sx={{ backgroundImage: `url(${backgroundImg})` }}>
        <Header user={appState.user} />
        <div style={{
          width: '100%', height: '2px', backgroundImage: `linear-gradient(90deg, rgba(0,0,0,1) 0%, rgba(255,255,255,0.5) 20%, rgba(251,250,250,0.5) 80%, rgba(0,0,0,1) 100%)`,
          boxShadow: ''
        }} />
        {body}
      </Stack>
    </AppContext.Provider>
  )
}

function appStateReducer(app: AppState, action: FlowAction): AppState {
  switch (action.type) {
    case "login":
      if (action.user === undefined)
        return { ...app, status: 'landed', user: null, problemList: null }
      else
        return { status: 'loggedIn', user: action.user, problemList: null, problemView: null }
    case "logout":
      return { ...app, status: 'landed', user: null, problemList: null };
    case "viewProblem":
      return { ...app, status: 'problemView', problemView: action.problemNumber! };
    case "viewUser":
      return { ...app, status: 'userView', problemView: null, userView: action.userView! };
    case "gotProblems":
      return { ...app, problemList: action.problemList! }
  }
}

function addSnackBar() {
  ;
}

export { addSnackBar };
export default App;
