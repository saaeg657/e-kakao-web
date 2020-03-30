import React from 'react';
import { withRouter } from 'react-router-dom';
// import Particles from 'react-particles-js';
import { checkAuth } from '../../utils/api/api.auth';
import Login from '../Login/LoginComponent';
import NavBar from '../NavBar/NavBarComponent';

const authState = { FAILED: 0, APPROVED: 1, WAITING: 2 };

class Loading extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      authState: authState.WAITING,
      admin: false
    };
    this.initialize = this.initialize.bind(this);
  }

  componentWillMount() {
    this.initialize();
  }

  componentWillReceiveProps() {
    this.initialize();
  }

  initialize() {
    checkAuth()
      .then((user) => {
        if (this.props.isLoginPath || this.props.isSignUpPath) this.props.history.push('/');
        this.setState({ authState: authState.APPROVED, admin: user.admin });
      })
      .catch(() => {
        this.setState({ authState: authState.FAILED });
      });
  }

  render() {
    const MainComponent = (props) => {
      switch (this.state.authState) {
        case authState.FAILED: {
          if (this.props.isSignUpPath) {
            const Component = this.props.component;
            return (<div style={{ height: '100%', width: '100%' }}><Component {...props} /></div>);
          }
          return <Login {...props} />;
        }
        case authState.APPROVED: {
          const Component = this.props.component;
          if (this.props.onlyAdmin && !this.state.admin) {
            this.props.history.push('/');
            return (null);
          }
          return (
            <div>
              <NavBar {...props} />
              <div>
                <Component {...props} />
              </div>
            </div>
          );
        }
        case authState.WAITING:
          return (<p>Now Loading...</p>);
        default:
          return (<p>Now Loading...</p>);
      }
    };
    return (
      <div style={{ width: '100%', height: '100%' }}>
        {/* <Particles
          params={{
            particles: {
              number: {
                value: 5,
                density: {
                  enable: true,
                  value_area: 1000
                }
              },
              color: {
                value: '#000000'
              },
              shape: {
                type: 'circle',
                stroke: {
                  width: 0,
                  color: '#ff2a2a'
                },
                polygon: {
                  nb_sides: 5
                },
                image: {
                  src: 'img/github.svg',
                  width: 100,
                  height: 100
                }
              },
              opacity: {
                value: 0.5,
                random: false,
                anim: {
                  enable: false,
                  speed: 1,
                  opacity_min: 0.1,
                  sync: false
                }
              },
              size: {
                value: 3,
                random: true,
                anim: {
                  enable: false,
                  speed: 40,
                  size_min: 0.1,
                  sync: false
                }
              },
              line_linked: {
                enable: true,
                distance: 150,
                color: '#000000',
                opacity: 0.4,
                width: 1
              },
              move: {
                enable: true,
                speed: 6,
                direction: 'none',
                random: false,
                straight: false,
                out_mode: 'out',
                bounce: false,
                attract: {
                  enable: false,
                  rotateX: 600,
                  rotateY: 1200
                }
              }
            },
            interactivity: {
              detect_on: 'canvas',
              events: {
                onhover: {
                  enable: true,
                  mode: 'grab'
                },
                onclick: {
                  enable: true,
                  mode: 'push'
                },
                resize: true
              },
              modes: {
                grab: {
                  distance: 400,
                  line_linked: {
                    opacity: 1
                  }
                },
                bubble: {
                  distance: 400,
                  size: 40,
                  duration: 2,
                  opacity: 8,
                  speed: 3
                },
                repulse: {
                  distance: 200,
                  duration: 0.4
                },
                push: {
                  particles_nb: 4
                },
                remove: {
                  particles_nb: 2
                }
              }
            },
            retina_detect: true
          }}
          style={{
            width: '100%',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: -1,
            position: 'fixed'
          }}
        /> */}
        <MainComponent />
      </div>
    );
  }
}

export default withRouter(Loading);
