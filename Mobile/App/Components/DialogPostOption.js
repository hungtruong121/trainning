import React, {Component} from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Modal,
} from 'react-native';
import {Text, Block} from 'App/Components';
import PropTypes from 'prop-types';
import {strings} from '../Locate/I18n';
import {Colors} from '../Theme';
import {Divider} from 'react-native-paper';
import {SafeAreaView} from 'react-navigation';

class DialogPostOption extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }

  pinOnTop = () => {
    const {pinOnTop} = this.props;
    this.onClose();
    if (pinOnTop) {
      pinOnTop();
    }
  };

  onEdit = () => {
    const {onEdit} = this.props;
    this.onClose();
    if (onEdit) {
      onEdit();
    }
  };

  onDelete = () => {
    const {onDelete} = this.props;
    this.onClose();
    if (onDelete) {
      onDelete();
    }
  };

  onClose = () => {
    const {onCancel} = this.props;
    if (onCancel) {
      onCancel();
    }
  };

  render() {
    const {visible} = this.props;

    return (
      <Modal visible={visible} transparent>
        <TouchableWithoutFeedback onPress={this.onClose}>
          <Block color={Colors.opacity} style={{justifyContent: 'flex-end'}}>
            <SafeAreaView>
              <Block flex={false} marginHorizontal={20}>
                <Block flex={false} card style={{overflow: 'hidden'}}>
                  <TouchableOpacity
                    style={styles.button}
                    activeOpacity={0.8}
                    onPress={this.pinOnTop}>
                    <Text>{strings('pin_on_top')}</Text>
                  </TouchableOpacity>
                  <Divider />
                  <TouchableOpacity
                    style={styles.button}
                    activeOpacity={0.8}
                    onPress={this.onEdit}>
                    <Text>{strings('edit')}</Text>
                  </TouchableOpacity>
                  <Divider />
                  <TouchableOpacity
                    style={styles.button}
                    activeOpacity={0.8}
                    onPress={this.onDelete}>
                    <Text color={Colors.primary}>{strings('delete')}</Text>
                  </TouchableOpacity>
                </Block>
                <TouchableOpacity
                  style={[styles.button, {marginVertical: 10, borderRadius: 5}]}
                  activeOpacity={0.8}
                  onPress={this.onClose}>
                  <Text>{strings('cancel')}</Text>
                </TouchableOpacity>
              </Block>
            </SafeAreaView>
          </Block>
        </TouchableWithoutFeedback>
      </Modal>
    );
  }
}

DialogPostOption.defaultProps = {};

DialogPostOption.propTypes = {
  visible: PropTypes.bool,
  pinOnTop: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  content: {
    backgroundColor: 'white',
    paddingTop: 30,
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  button: {
    height: 44,
    backgroundColor: 'white',
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default DialogPostOption;
