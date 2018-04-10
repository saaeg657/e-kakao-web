import React from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import Alert from 'react-s-alert';
import DropDownMenu from 'material-ui/DropDownMenu/DropDownMenu';
import { MenuItem } from 'material-ui';
import { signOut, getAuth } from '../../utils/api/api.auth';
import onmumunetIcon from './logo.png'

const styles = {
  navLink: {
    textDecoration: 'none',
    width: 100,
    color: '#666'
  },
  navBar: {
    height: 80,
    width: '100%',
    backgroundColor: '#fbfbfb',
    borderBottom: '2px solid #f4f4f4',
  },
  navBarContents: {
    width: '90%',
    paddingTop: 10,
    margin: 'auto'
  },
  logo: {
    float: 'left'
  },
  navBarTitle: {
    float: 'left',
    fontSize: 30,
    paddingLeft: 20,
    paddingTop: 15,
    color: '#666'
  },
  navBarItem: {
    float: 'left',
    margin: '20px 20px 20px 20px',
    fontSize: 20,
    color: '#666',
    cursor: 'pointer'
  },
};

class NavBarComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {}
    };
    this.handleClickTitle = this.handleClickTitle.bind(this);
    this.handleChangeAuthMenu = this.handleChangeAuthMenu.bind(this);
  }

  componentWillMount() {
    getAuth()
      .then((user) => {
        if (user) this.setState({ user });
      });
  }

  handleClickTitle() {
    this.props.history.push('/');
  }

  handleChangeAuthMenu(e, i, v) {
    switch (v) {
      case 2:
        signOut()
          .then((result) => {
            this.props.history.push('/login');
            Alert.success(result);
          })
          .catch(err => Alert.error(err.messaeg));
        break;
      default:
        break;
    }
  }

  render() {
    return (
      <div style={styles.navBar}>
        <div style={styles.navBarContents}>
          <img src={onmumunetIcon} height={70} width={70} style={styles.logo} alt='' />
          <div style={styles.navBarTitle}>
            <span style={{ fontFamily: 'Nanum Pen Script', fontSize: 40 }}>Onmumunet</span>
          </div>
          <div style={{ float: 'right' }}>
            {this.state.user.admin && <div style={styles.navBarItem}><NavLink to='/admin' style={styles.navLink}><span>관리</span></NavLink></div>}
            {/* <div style={styles.navBarItem}><NavLink to='/' style={styles.navLink}><span>시청</span></NavLink></div> */}
            {/* <div style={styles.navBarItem}><NavLink to='/user' style={styles.navLink}><span>유저</span></NavLink></div>
            <div style={styles.navBarItem}><NavLink to='/queue' style={styles.navLink}><span>큐</span></NavLink></div>
            <div style={styles.navBarItem}><NavLink to='/match' style={styles.navLink}><span>매칭</span></NavLink></div>
            <div style={styles.navBarItem}><NavLink to='/payment' style={styles.navLink}><span>결제</span></NavLink></div>
            <div style={styles.navBarItem}><NavLink to='/spot' style={styles.navLink}><span>만남장소</span></NavLink></div> */}
            <DropDownMenu value={1} onChange={this.handleChangeAuthMenu}>
              <MenuItem value={1} primaryText={this.state.user.email} />
              <MenuItem value={2} primaryText='로그아웃' />
            </DropDownMenu>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(NavBarComponent);
