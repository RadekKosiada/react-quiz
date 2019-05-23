// Reducer is a pure function which accepts the previous state and action and returns the new state;

// function reducer(prevState, action) {
//   return newState;
// }

// When returning the new state DO NOT ever mutate the previous state. 
// Always CREATE A NEW REFERENCE for the new state creating a new object/array. 
// React keeps track of the state reference changes and if you do not change the reference how will it know a change has happened?

import { ADD_USER } from "./actions";

//                        prevState,        action
function userDataReducer(state={users: []}, action){
    switch(action.type) {
        case ADD_USER:
          return Object.assign({}, state, 
              {
                // creating new reference;
                users: [...state.users, action.user]
               }); 
         default: 
                // new state
           return state;
     }
}

export default userDataReducer;

