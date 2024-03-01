// import { AppState, FlowAction } from './States';
// import { getProblem, getProblemsList } from './api';



// function appStateReducer(app: AppState, action: FlowAction): AppState {
//     switch (action.type) {
//       case "login":
//         if (action.user === undefined)
//           return { ...app, status: 'landed', user: null, problemList: null }
//         else return { ...app, status: 'loggedIn', user: action.user, problemList: null }
//       case "logout":
//         return { ...app, status: 'landed', user: null, problemList: null };
//       case "viewProblem":
//         return { ...app, status: 'problemView', problemView: action.problemNumber! };
//       case "viewUser":
//         return { ...app, status: 'userView', userView: action.userView! };
//       case "gotProblems":
//         return { ...app, problemList: action.problemList! }
//     }
//   }