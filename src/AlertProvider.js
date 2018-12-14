import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import groupBy from 'lodash/groupBy';
import { createPortal } from 'react-dom';
import { TransitionGroup, Transition } from 'react-transition-group';
import AlertContext from './AlertContext';
import getPosition from './getPosition';
import AlertContainer from './AlertContainer';
import Alert from './Alert';

const defaultStyle = {
  transition: 'opacity 500ms ease-in-out',
  opacity: 0,
};

const transitionStyles = {
  entering: { opacity: 0 },
  entered: { opacity: 1 },
};

export default class AlertProvider extends React.Component {
  static propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node,
    ]).isRequired,
  };

  state = {
    alerts: [],
    offset: '10px',
    root: null,
  };

  componentDidMount() {
    const root = document.createElement('div');
    document.body.appendChild(root);
    this.setState({ root });
  }

  show = (
    {
      message = 'Default alert message',
      style = {},
      duration = 0,
      id,
      position = 'top left',
      offset = '0px',
      theme = 'light',
    },
    AlertComponent,
  ) => {
    const { alerts } = this.state;
    const key = Math.random();
    const randomId = Math.random()
      .toString(36)
      .substring(7);

    this.setState({
      alerts: [
        ...alerts,
        {
          duration,
          id: id || randomId,
          key,
          message,
          position,
          style,
          AlertComponent,
          theme,
        },
      ],
      offset,
    });
    return id || randomId;
  };

  close = id => {
    const { alerts: currentAlerts } = this.state;
    this.setState({
      alerts: currentAlerts.filter(alert => alert.id !== id),
    });
  };

  render() {
    const { children } = this.props;
    const { alerts, root, offset } = this.state;

    const alert = {
      show: this.show,
      close: this.close,
    };

    const orderedAlerts = groupBy(alerts, 'position');

    let sortedAlerts = {};
    Object.keys(orderedAlerts).map(position => {
      sortedAlerts =
        position.indexOf('top') > -1
          ? {
              ...sortedAlerts,
              [position]: orderedAlerts[position].reverse(),
            }
          : { ...sortedAlerts, [position]: orderedAlerts[position] };
      return null;
    });

    return (
      <AlertContext.Provider value={alert}>
        {children}
        {root &&
          createPortal(
            <Fragment>
              {Object.keys(sortedAlerts).map(position => (
                <AlertContainer
                  key={position}
                  position={getPosition(position, offset)}
                >
                  <TransitionGroup>
                    {sortedAlerts[position].map(a => {
                      /**
                       * TODO: Try to find another way to expire alerts when
                       *       their duration is up.
                       */
                      if (a.duration !== 0) {
                        setTimeout(() => this.close(a.id), a.duration);
                      }
                      const { AlertComponent } = a;
                      if (AlertComponent) {
                        return (
                          <Transition key={a.key} timeout={0} appear>
                            {state => (
                              <AlertComponent
                                close={() => this.close(a.id)}
                                key={a.key}
                                id={a.id}
                                transitionStyle={{
                                  ...defaultStyle,
                                  ...transitionStyles[state],
                                }}
                              />
                            )}
                          </Transition>
                        );
                      }
                      return (
                        <Transition key={a.key} timeout={0} appear>
                          {state => (
                            <Alert
                              key={a.key}
                              alert={a}
                              close={this.close}
                              transitionStyle={{
                                ...defaultStyle,
                                ...transitionStyles[state],
                              }}
                            />
                          )}
                        </Transition>
                      );
                    })}
                  </TransitionGroup>
                </AlertContainer>
              ))}
            </Fragment>,
            root,
          )}
      </AlertContext.Provider>
    );
  }
}
