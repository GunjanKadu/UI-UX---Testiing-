import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Link, NavLink } from 'react-router-dom';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Spinner,
  Badge
} from 'reactstrap';
import { useAlert } from 'react-alert';

import { addValidation, logOut } from 'Redux/ActionCreators/Login';

import Login from 'components/Navbar/Login/login';
import UserIcon from 'assets/images/UserIcon.png';
import navIcon from 'assets/images/navIcon.png';

import './navbar.css';
const NavbarComponent = props => {
  const userName = sessionStorage.getItem('firstName');
  const isChef = sessionStorage.getItem('isChef');
  //DropDown
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggleDropDown = () => setDropdownOpen(prevState => !prevState);

  //Alerts
  const alert = useAlert();
  const SignupSuccess = () =>
    alert.show(
      <div style={{ fontSize: '14px' }}>You Have Signed Up Successfully</div>,
      {
        timeout: 3000,
        type: 'success',
        transition: 'fade'
      }
    );
  const LoginSuccess = () =>
    alert.show(
      <div style={{ fontSize: '14px' }}>
        Hello {userName} You Have Logged In Successfully
      </div>,
      {
        timeout: 3000,
        type: 'success',
        transition: 'fade'
      }
    );
  const LoginSuccessWelcome = () =>
    alert.show(<div style={{ fontSize: '14px' }}>Welcome</div>, {
      timeout: 3000,
      type: 'success',
      transition: 'fade'
    });

  const loginErrorMessage = props.account.LoginDetailsFailed.non_field_errors;
  const LoginFailed = () =>
    alert.show(<div style={{ fontSize: '14px' }}>{loginErrorMessage}</div>, {
      timeout: 3000,
      type: 'error',
      transition: 'fade'
    });
  const LogoutSuccess = () =>
    alert.show(<div style={{ fontSize: '14px' }}>See You Again</div>, {
      timeout: 3000,
      type: 'success',
      transition: 'fade'
    });

  //Validated
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem('userToken')) {
      props.addValidation(true);
    } else {
      props.addValidation(false);
    }
  }, [props.account.LoginDetailsSuccess.token, props.account.isValidated]);

  //Login
  useEffect(() => {
    if (
      sessionStorage.getItem('userToken') &&
      sessionStorage.getItem('userPresent')
    ) {
      LoginSuccess();

      sessionStorage.removeItem('userPresent');
    }
  }, [props.account.LoginDetailsSuccess.token, props.account.isValidated]);
  //Login Error
  useEffect(() => {
    if (loginErrorMessage) {
      LoginFailed();
    }
  }, [props.account.LoginDetailsFailed]);
  //Signup
  useEffect(() => {
    if (props.account.isSuccessfullyAdded) {
      SignupSuccess();
    }
  }, [props.account.isSuccessfullyAdded]);

  const showCartAlert = props.cart.CardAlert;
  const noOfCartItems = props.cart.CartContent.length;
  const toggle = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    props.logOut();
    props.history.push({
      pathname: '/'
    });
    LogoutSuccess();
  };
  const validated = props.account.isValidated;

  //Loading Effect
  const isAccountLoading = props.account.Loading;
  let loader;
  if (isAccountLoading) {
    loader = (
      <div>
        <Spinner color='dark' style={{ width: '1.5rem', height: '1.5rem' }} />
      </div>
    );
  } else {
    loader = (
      <img src={UserIcon} alt='' style={{ height: '45px', width: '45px' }} />
    );
  }

  return (
    <div>
      <Navbar color='light' light expand='md'>
        <img src={navIcon} alt='NavIcon' style={{ height: '50px' }} />
        <NavbarBrand className='brand'>
          <Link style={{ textDecoration: 'none', color: 'black' }} to='/'>
            Food Next Door
          </Link>
        </NavbarBrand>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          <Nav
            className='ml-auto'
            style={{ marginRight: '40px', fontWeight: 'bold' }}
            navbar
          >
            {validated && isChef == 'true' ? (
              <NavItem>
                <NavLink
                  to='/addDish'
                  activeClassName='navbar__link--active'
                  className='navbar__link'
                >
                  <span style={{ fontWeight: 400 }}>Add Dish</span>{' '}
                </NavLink>
              </NavItem>
            ) : null}

            <NavItem>
              <NavLink
                to='/dishes'
                activeClassName='navbar__link--active'
                className='navbar__link'
              >
                <span style={{ fontWeight: 400 }}>Dishes</span>{' '}
              </NavLink>
            </NavItem>
            <NavItem style={{ position: 'relative' }}>
              <NavLink
                activeClassName='navbar__link--active'
                className='navbar__link'
                to='/cart'
              >
                <span style={{ fontWeight: 400 }}>Cart</span>
              </NavLink>
              {noOfCartItems && showCartAlert ? (
                <Badge
                  style={{ position: 'absolute', left: '75%', top: '-30%' }}
                  color='danger'
                >
                  {noOfCartItems}
                </Badge>
              ) : null}
            </NavItem>
          </Nav>
          {validated ? (
            <Dropdown isOpen={dropdownOpen} toggle={toggleDropDown}>
              <DropdownToggle
                caret
                color='grey'
                style={{
                  border: '0',
                  backgroundColor: 'transparent',
                  borderColor: 'transparent'
                }}
              >
                {loader}
              </DropdownToggle>
              <div style={{ position: 'absolute', right: '183%', top: '10%' }}>
                <DropdownMenu>
                  <DropdownItem>
                    <Link
                      to='/profile'
                      style={{
                        textDecoration: 'none',
                        color: 'black',
                        fontSize: '10'
                      }}
                    >
                      My Profile{' '}
                    </Link>
                  </DropdownItem>

                  <DropdownItem divider />
                  <DropdownItem
                    onClick={handleLogout}
                    style={{ color: '#dc3545' }}
                  >
                    Logout
                  </DropdownItem>
                </DropdownMenu>
              </div>
            </Dropdown>
          ) : (
            <Login buttonLabel='Login' title='Login' />
          )}
        </Collapse>
      </Navbar>
    </div>
  );
};
const mapDispatchToProps = dispatch => {
  return {
    addValidation: value => {
      dispatch(addValidation(value));
    },
    logOut: () => {
      dispatch(logOut());
    }
  };
};
const mapStateToProps = state => {
  return {
    account: state.account,
    cart: state.cart
  };
};
export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(NavbarComponent)
);
