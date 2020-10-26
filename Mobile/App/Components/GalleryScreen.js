import React, {Component} from 'react';
import {
  StyleSheet,
  Modal,
  View,
  Text,
  FlatList,
  Image,
  PermissionsAndroid,
  Platform,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {Header} from '.';
import CameraRoll from '@react-native-community/cameraroll';
import Icon from 'react-native-vector-icons/FontAwesome5';
import AntDesign from 'react-native-vector-icons/AntDesign';
import ImagePicker from 'react-native-image-picker';
import {strings} from '../Locate/I18n';

const {width} = Dimensions.get('window');

export default class GalleryScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: false,
      photos: [],
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const {visible} = nextProps;
    if (visible != prevState.visible) {
      return {visible};
    }

    return null;
  }

  shouldComponentUpdate(nextProps) {
    if (nextProps.visible) {
      this.startLoadImages();
    }
    return true;
  }

  startLoadImages() {
    if (Platform.OS === 'android') {
      this.checkAndroidPermission();
    } else {
      this.getListImage();
    }
  }

  async checkAndroidPermission() {
    const permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;
    const hasPermission = await PermissionsAndroid.check(permission);
    if (hasPermission) {
      this.getListImage();
      return;
    }

    const status = await PermissionsAndroid.request(permission);
    if (status === 'granted') {
      this.getListImage();
      return;
    }

    this.onClose();
  }

  getListImage() {
    CameraRoll.getPhotos({
      first: 1000000,
      assetType: 'Photos',
    })
      .then((r) => {
        let photos = r.edges;
        photos.unshift('camera');
        this.setState({photos: photos});
      })
      .catch((err) => {
        console.log('getPhotos: ', err);
        //Error Loading Images
      });
  }

  launchCamera = () => {
    var options = {
      title: 'Take a photo',
      takePhotoButtonTitle: 'takePhotoButtonTitle',
      chooseFromLibraryButtonTitle: 'chooseFromLibraryButtonTitle',
      cancelButtonTitle: 'cancelButtonTitle',
    };
    ImagePicker.launchCamera(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        this.onSelectedImage(response);
      }
    });
  };

  onClose = () => {
    this.props.onClose();
  };

  onSelectedImage = (image) => {
    if (!image.filename) {
      image.filename = image.uri.split(/[\\\/]/).pop();
    }
    this.props.onSelected(image);
    this.onClose();
  };

  renderItem = ({item, index}) => {
    const node = item.node;
    if (!node) {
      return (
        <TouchableOpacity key={index} onPress={this.launchCamera}>
          <View
            style={[
              styles.item,
              {justifyContent: 'center', alignItems: 'center'},
            ]}>
            <Icon name={'camera'} color={'#797979'} size={width / 8} />
          </View>
        </TouchableOpacity>
      );
    }

    const image = node.image;
    return (
      <TouchableOpacity key={index} onPress={() => this.onSelectedImage(image)}>
        <View style={styles.item}>
          <Image
            style={styles.image}
            source={{uri: image.uri}}
            resizeMode={'cover'}
          />
        </View>
      </TouchableOpacity>
    );
  };

  renderLeftHeader = () => (
    <TouchableOpacity onPress={this.onClose}>
      <AntDesign name={'left'} size={25} color={'white'} />
    </TouchableOpacity>
  );

  renderRightHeader = () => (
    <TouchableOpacity onPress={this.onClose}>
      <Text>{strings('ok')}</Text>
    </TouchableOpacity>
  );

  render() {
    const {photos} = this.state;
    const {visible} = this.props;
    return (
      <Modal visible={visible} onRequestClose={this.onClose}>
        <View style={{flex: 1, backgroundColor: '#FFF'}}>
          <Header
            navigation={this.props.navigation}
            leftIcon={this.renderLeftHeader()}
            title={'Images'}
          />
          <View style={{flex: 1, padding: 8}}>
            <FlatList
              data={photos}
              renderItem={this.renderItem}
              keyExtractor={(item, index) => index.toString()}
              numColumns={3}
            />
          </View>
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 0,
  },
  item: {
    height: (width - 16 * 4) / 3,
    width: (width - 16 * 4) / 3,
    padding: 0,
    marginVertical: 8,
    marginHorizontal: 8,
    borderWidth: 1,
    borderColor: '#DDDFE1',
  },
  image: {
    flex: 1,
    height: 100,
    resizeMode: 'contain',
  },
});
