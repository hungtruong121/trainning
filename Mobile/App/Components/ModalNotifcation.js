import React, {Component} from 'react';
import Modal from 'react-native-modal';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {Text, Block} from 'App/Components';
import PropTypes from 'prop-types';
import {strings} from '../Locate/I18n';
import {Colors} from '../Theme';

class ModalNotifcation extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  renderBodyModal = () => {
    const {message} = this.props;
    return (
      <Block flex={false} style={styles.body}>
        <Text h3 center>
          {message}
        </Text>
      </Block>
    );
  };

  renderFooterModal = () => {
    const {onAccept} = this.props;
    return (
      <Block flex={false} middle style={styles.footer}>
        <TouchableOpacity onPress={() => onAccept && onAccept()}>
          <Text bold center>
            {strings('ok')}
          </Text>
        </TouchableOpacity>
      </Block>
    );
  };

  renderFooterConfirm = () => {
    const {onAccept, onCancel} = this.props;
    return (
      <Block flex={false} row style={styles.footer}>
        <Block
          style={{
            borderRightWidth: 1,
            borderRightColor: Colors.gray2,
          }}
          middle>
          <TouchableOpacity onPress={() => onAccept && onAccept()}>
            <Text bold center>
              {strings('ok')}
            </Text>
          </TouchableOpacity>
        </Block>
        <Block middle>
          <TouchableOpacity onPress={() => onCancel && onCancel()}>
            <Text bold center style={{color: Colors.gray9}}>
              {strings('cancel')}
            </Text>
          </TouchableOpacity>
        </Block>
      </Block>
    );
  };

  render() {
    const {isOpen, isConfirm} = this.props;

    return (
      <Modal isVisible={isOpen}>
        <Block flex={false} style={styles.content}>
          {this.renderBodyModal()}
          {isConfirm ? this.renderFooterConfirm() : this.renderFooterModal()}
        </Block>
      </Modal>
    );
  }
}

ModalNotifcation.defaultProps = {
  useScrollView: true,
};

ModalNotifcation.propTypes = {
  isOpen: PropTypes.bool,
  onCancel: PropTypes.func,
  onAccept: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  content: {
    backgroundColor: 'white',
    paddingTop: 30,
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  body: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  footer: {
    borderTopColor: Colors.gray2,
    borderTopWidth: 1,
    height: 50,
  },
});

export default ModalNotifcation;
