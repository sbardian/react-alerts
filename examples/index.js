/* eslint-disable react/prefer-stateless-function */
/* eslint-disable react/no-multi-comp */
import React from 'react';
import ReactDOM from 'react-dom';
import { FaBeer } from 'react-icons/fa';
import MyAlertWrapper from '../src';

class Question extends React.Component {
  render() {
    return <FaBeer />;
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      alertMessage: 'default message',
    };
  }

  render() {
    const offset = '60px';

    const topLeft = {
      style: {
        /**
         * put any override styles here.
         */
        // backgroundColor: 'blue',
      },
      duration: 20000,
      position: 'top left',
    };

    const topRight = {
      ...topLeft,
      position: 'top right',
      IconComponent: () => <Question />,
    };

    const bottomRight = {
      ...topLeft,
      position: 'bottom right',
    };

    const bottomLeft = {
      ...topLeft,
      position: 'bottom left',
    };

    const topCenter = {
      ...topLeft,
      position: 'top center',
    };

    const bottomCenter = {
      ...topLeft,
      position: 'bottom center',
    };

    const message = () => {
      this.setState({
        alertMessage: Math.random().toString(),
      });
    };

    const { alertMessage } = this.state;

    return (
      <div className="App">
        <MyAlertWrapper>
          {({ show, close }) => (
            <div>
              <button type="button" onClick={() => message()}>
                update message
              </button>
              <button
                type="button"
                onClick={() => show(alertMessage, topLeft, offset)}
              >
                top left
              </button>
              <button
                type="button"
                onClick={() => show(alertMessage, topRight, offset)}
              >
                top right
              </button>
              <button
                type="button"
                onClick={() => show(alertMessage, bottomLeft, offset)}
              >
                bottom left
              </button>
              <button
                type="button"
                onClick={() => show(alertMessage, bottomRight, offset)}
              >
                bottom right
              </button>
              <button
                type="button"
                onClick={() => show(alertMessage, topCenter, offset)}
              >
                top center
              </button>
              <button
                type="button"
                onClick={() => show(alertMessage, bottomCenter, offset)}
              >
                bottom center
              </button>
            </div>
          )}
        </MyAlertWrapper>
      </div>
    );
  }
}

const rootElement = document.getElementById('root');
ReactDOM.render(<App />, rootElement);
