import React, {Component} from 'react';
import {StyleSheet} from 'react-native';

import {Button} from '.';
import {Colors} from 'App/Theme';

import RBSheet from 'react-native-raw-bottom-sheet';

class BottomSheet extends Component {
  constructor(props) {
    super(props);

    this.refRBSheet = React.createRef();
  }

  open = () => {
    this.refRBSheet.current.open();
  };

  close = () => {
    this.refRBSheet.current.close();
  };

  render() {
    const {
      style,
      keyboardAvoidingViewEnabled,
      animated,
      children,
      onClose,
    } = this.props;

    let styleContainer = {...style};

    let height = 200;
    if (animated) {
      height = styleContainer.height || height;
      delete styleContainer.height;
    }

    return (
      <RBSheet
        ref={this.refRBSheet}
        openDuration={250}
        height={height}
        keyboardAvoidingViewEnabled={keyboardAvoidingViewEnabled}
        customStyles={{
          container: styleContainer,
        }}
        onClose={onClose && onClose}>
        {children}
      </RBSheet>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: 300,
  },
  border: {
    borderWidth: 1,
    borderColor: Colors.gray1,
    borderRadius: 5,
  },
  text: {
    marginLeft: 8,
  },
});

Button.defaultProps = {
  animated: true,
};

export default BottomSheet;
