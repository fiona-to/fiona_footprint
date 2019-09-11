import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import AuthContext from "../contexts/auth-context";
//Source from: https:// longfordpc.com/explore/vine-clipart-pink-rose/
import img from "../images/rose.jpg";
// Material UI
import { makeStyles } from "@material-ui/core/styles";
import { Toolbar, Typography, AppBar, Fab, Grid } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: "white"
  },
  bgImage: {
    backgroundImage: `url(${img})`,
    backgroundRepeat: "no-repeat",
    height: 180,
    backgroundSize: "cover",
    backgroundPosition: "center"
  },
  title: {
    flexGrow: 1,
    color: "#c70d3a",
    fontSize: 28,
    height: 60
  },
  toolBar: {
    minHeight: 40
  },
  navLinkText: {
    "&:hover": {
      color: "#e88484"
    },
    color: "#c70d3a",
    flex: 1,
    marginTop: 25,
    fontSize: 16
  },
  addButton: {
    marginTop: 7,
    minHeight: 28,
    width: 28,
    height: 28,
    color: "#c70d3a",
    backgroundColor: "#d1eecc"
  }
}));

const NavigationBar = props => {
  const classes = useStyles();
  const { token, profile } = useContext(AuthContext);

  return (
    <AppBar position="static" className={`${classes.root} ${classes.bgImage}`}>
      <Typography variant="h6" className={classes.title}>
        Fiona's Footprint
      </Typography>
      <Toolbar className={classes.toolBar}>
        <Grid justify="space-between" container>
          <Grid item xs={11} sm={5} md={5}>
            <NavLink to="/" className={classes.navLinkText}>
              Travel Fact
            </NavLink>
            {token && (
              <NavLink to="/AddAuthor" className={classes.navLinkText}>
                &nbsp;|&nbsp;Owner
              </NavLink>
            )}
            {token && profile === "admin" && (
              <NavLink to="/AddUser" className={classes.navLinkText}>
                &nbsp;|&nbsp;User
              </NavLink>
            )}
            {!token && (
              <NavLink to="/Login" className={classes.navLinkText}>
                &nbsp;|&nbsp;Login
              </NavLink>
            )}
            {token && (
              <NavLink to="/Logout" className={classes.navLinkText}>
                &nbsp;|&nbsp;Logout
              </NavLink>
            )}
          </Grid>
          <Grid item xs={1} sm={1} md={1}>
            {token && (
              <Fab
                className={classes.addButton}
                size="small"
                aria-label="add"
                onClick={() => {
                  props.handleAddTopic(true);
                  props.handleEditTopic(false);
                }}
              >
                <AddIcon />
              </Fab>
            )}
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  );
};

export default NavigationBar;
