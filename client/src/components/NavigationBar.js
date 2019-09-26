import React, { useContext, Fragment } from "react";
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
  header: {
    color: "#c70d3a",
    fontSize: 28,
    display: "inline"
  },
  emptyBox: {
    flexGrow: 1
  },
  toolBar: {
    minHeight: 23,
    backgroundColor: "#eeeeee"
  },
  navLinkText: {
    "&:hover": {
      color: "#42b883"
    },
    color: "#c70d3a",
    fontSize: 14,
    lineHeight: 3
  },
  addButton: {
    marginTop: 7,
    minHeight: 23,
    width: 23,
    height: 23,
    color: "#c70d3a",
    backgroundColor: "#d1eecc"
  },
  verLine: {
    color: "#c70d3a"
  }
}));

const NavigationBar = props => {
  const classes = useStyles();
  const { token, profile } = useContext(AuthContext);

  return (
    <AppBar position="static" className={`${classes.root} ${classes.bgImage}`}>
      <Typography variant="h6" className={classes.header}>
        Fiona's Footprint
      </Typography>
      <Typography variant="h6" className={classes.emptyBox}></Typography>
      <Toolbar className={classes.toolBar}>
        <Grid justify="space-between" container>
          <Grid item xs={11} sm={5} md={5}>
            <NavLink to="/" className={classes.navLinkText}>
              Travel Fact
            </NavLink>
            {token && (
              <Fragment>
                <span className={classes.verLine}>&nbsp;|&nbsp;</span>
                <NavLink to="/AddAuthor" className={classes.navLinkText}>
                  Owner
                </NavLink>
              </Fragment>
            )}
            {token && profile === "admin" && (
              <Fragment>
                <span className={classes.verLine}>&nbsp;|&nbsp;</span>
                <NavLink to="/AddUser" className={classes.navLinkText}>
                  User
                </NavLink>
              </Fragment>
            )}
            {!token && (
              <Fragment>
                <span className={classes.verLine}>&nbsp;|&nbsp;</span>
                <NavLink to="/Login" className={classes.navLinkText}>
                  Login
                </NavLink>
              </Fragment>
            )}
            {token && (
              <Fragment>
                <span className={classes.verLine}>&nbsp;|&nbsp;</span>
                <NavLink to="/Logout" className={classes.navLinkText}>
                  Logout
                </NavLink>
              </Fragment>
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
