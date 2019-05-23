import React, {Component} from "react";
import { connect } from "react-redux";
import addUser from "../actions";

class User extends Component {
  //your component implementation
}
const mapStateToProps = state => {
      const users = state.userDataReducer;
      return users;
}
export default connect(mapStateToProps, {addUser} )(User);