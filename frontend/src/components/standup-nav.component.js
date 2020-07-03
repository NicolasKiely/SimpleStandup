import React, {Component} from "react";
import {Nav, Navbar, NavDropdown} from "react-bootstrap";


/**
 * Navbar for application page
 */
class AppNavbar extends Component {
  constructor(props) {
    super(props);
    this.app = props.app;

    this.state = {
      "notifications": []
    };

    this.notificationHandler = function(notifications){
      this.setState({"notifications": notifications});
    };
    this.notificationHandler = this.notificationHandler.bind(this);

    this.app.registerNotificationCallback(this.notificationHandler);
  }

  render(){
    const notifications = this.state.notifications.map(
      (note) => <NavDropdown.Item key={note["id"]} onClick={() => this.app.activateNotification(note["id"])}>
        {note["title"]}
      </NavDropdown.Item>
    );
    const noteTitle = notifications.length > 0 ?
      String.fromCharCode(9733) + " Notifications" :
      String.fromCharCode(9734) + " Notifications"
    ;

    return <Navbar bg="light" expang="lg">
      <Navbar.Brand href="/">Standard Standup</Navbar.Brand>
      <Nav className="mr-auto">
        <Nav.Link href="/">Index</Nav.Link>
        {this.app.state.logged_in ?
          <NavDropdown title={noteTitle}>
            {notifications}
          </NavDropdown> :
          undefined
        }
      </Nav>
      <button type="button" className="nav-link btn btn-link" onClick={this.app.onLogout}>
        Logout
      </button>
    </Navbar>;
  }
}

export default AppNavbar;
