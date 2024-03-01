import { useReducer } from 'react';

import '@fontsource/inter';
import Stack from '@mui/joy/Stack';


import { AppState, FlowAction, FlowState, } from './States';
import { AppContext } from './context';
import Header from './Header'
import LandingBody from './LandingPage';


function App() {
  const [flowState, flowDispatcher] = useReducer(appStateReducer, { status: "landed" })
  let address = "http://localhost:9000/api/";
  let body: React.ReactElement;
  if (flowState.status === "landed")
    body = <LandingBody />
  else {
    body = <p>Yet to be implemented</p>
  }
  return (
    <AppContext.Provider value={{
      ...AppContext,
      dispatch: flowDispatcher,
      apiAddress: address,
      flowStateStatus: flowState.status
    }}>
      <Stack height="100%">
        <Header />
        {body}
      </Stack>
    </AppContext.Provider>
  )
}

function appStateReducer(app: AppState, action: FlowAction): AppState {
  switch (action.type) {
    case "login":
      return { ...app, status: 'loggedIn' };
    case "logout":
      return { ...app, status: 'landed' };
    case "viewProblem":
      return { ...app, status: 'problemView', problemNumber: action.problemNumber! };
    case "viewUser":
      return { ...app, status: 'userView', problemNumber: action.user! };
  }
}

export default App
