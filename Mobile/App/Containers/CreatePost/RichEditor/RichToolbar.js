/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, Image} from 'react-native';
import {Button, Block, GalleryScreen} from '../../../Components';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {Colors} from 'App/Theme';
import DialogTagUser from '../DialogTagUser';

import {Images} from '../../../Theme';

export default class RichToolbar extends Component {
  constructor(props) {
    super(props);
    this.dialogTagUser = React.createRef();

    this.state = {
      visibleDialogGallery: false,
    };
  }

  onTagUsers = (listUsers) => {
    this.props.onTagUsers(listUsers);
  };

  onChangeImageBG = (image) => {
    this.props.onChangeImageBG(image);
  };

  render() {
    const {visibleDialogGallery} = this.state;
    const {
      selectedItems,
      teamUsers,
      onBold,
      onUnderline,
      onItalic,
    } = this.props;

    return (
      <Block flex={false} {...this.props}>
        <Block flex={false} row style={{justifyContent: 'space-between'}}>
          <Button
            color={Colors.gray1}
            style={{width: 33, height: 33, alignItems: 'center'}}
            onPress={() => this.dialogTagUser.current?.open()}>
            <Icon name={'user-tag'} color={Colors.white} size={20} />
          </Button>
          <Button
            color={Colors.gray1}
            style={{width: 33, height: 33, alignItems: 'center'}}
            onPress={onBold}>
            <Icon
              name={'bold'}
              color={selectedItems.bold ? Colors.primary : Colors.white}
              size={20}
            />
          </Button>
          <Button
            color={Colors.gray1}
            style={{width: 33, height: 33, alignItems: 'center'}}
            onPress={onUnderline}>
            <Icon
              name={'underline'}
              color={selectedItems.underline ? Colors.primary : Colors.white}
              size={20}
            />
          </Button>
          <Button
            color={Colors.gray1}
            style={{width: 33, height: 33, alignItems: 'center'}}
            onPress={onItalic}>
            <Icon
              name={'italic'}
              color={selectedItems.italic ? Colors.primary : Colors.white}
              size={20}
            />
          </Button>
          <Button
            color={Colors.white}
            style={styles.button}
            onPress={() => this.onChangeImageBG()}
          />
          <Button
            color={Colors.white}
            style={styles.button}
            onPress={() => this.onChangeImageBG(Images.bgTartanTrack)}>
            <Image
              style={{
                resizeMode: 'cover',
                justifyContent: 'center',
                width: 33,
                height: 33,
                borderRadius: 5,
              }}
              source={Images.bgTartanTrack}
            />
          </Button>
          <Button
            color={Colors.white}
            style={styles.button}
            onPress={() => this.onChangeImageBG(Images.bgFootball)}>
            <Image
              style={{
                resizeMode: 'cover',
                justifyContent: 'center',
                width: 33,
                height: 33,
                borderRadius: 5,
              }}
              source={Images.bgFootball}
            />
          </Button>
          <Button
            color={Colors.white}
            style={styles.button}
            onPress={() => this.onChangeImageBG(Images.bgBox)}>
            <Image
              style={{
                resizeMode: 'cover',
                justifyContent: 'center',
                width: 33,
                height: 33,
                borderRadius: 5,
              }}
              source={Images.bgBox}
            />
          </Button>
          <Button
            color={Colors.white}
            style={styles.button}
            onPress={() => this.onChangeImageBG(Images.bgSwimmers)}>
            <Image
              style={{
                resizeMode: 'cover',
                justifyContent: 'center',
                width: 33,
                height: 33,
                borderRadius: 5,
              }}
              source={Images.bgSwimmers}
            />
          </Button>
          <Button
            style={{width: 33, height: 33, alignItems: 'center'}}
            color={Colors.gray1}
            onPress={() => this.setState({visibleDialogGallery: true})}>
            <Icon name={'plus'} color={Colors.white} size={20} />
          </Button>
        </Block>

        <DialogTagUser
          ref={this.dialogTagUser}
          listUsers={teamUsers}
          onSelected={this.onTagUsers}
        />

        <GalleryScreen
          visible={visibleDialogGallery}
          onSelected={this.onChangeImageBG}
          onClose={() => this.setState({visibleDialogGallery: false})}
        />
      </Block>
    );
  }

  showVisibleConfirm = (visible) => {
    this.setState({visibleDialogNotice: visible});
  };
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F5FCFF',
    flex: 1,
    paddingTop: 25,
  },
  contentStyle: {
    flex: 1,
    backgroundColor: null,
  },
  button: {
    width: 33,
    height: 33,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.gray5,
  },
});

RichToolbar.defaultProps = {};

RichToolbar.propTypes = {
  errorCode: PropTypes.string,
  userActions: PropTypes.object,
};
