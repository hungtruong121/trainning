/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import PropTypes from 'prop-types';

import {Colors} from 'App/Theme';

import axios from 'axios';
import Video from 'react-native-video';
import {strings} from '../../Locate/I18n';

class GIFItem extends Component {
  shouldComponentUpdate(nextProps) {
    return (
      this.props.style != nextProps.style || this.props.url != nextProps.url
    );
  }

  render() {
    const {style, url, onSelected} = this.props;
    if (url) {
      return (
        <TouchableOpacity
          style={[styles.item, style]}
          onPress={() => onSelected(url)}>
          <Video
            source={{uri: url}}
            repeat={true}
            resizeMode={'cover'}
            muted={true}
            style={{width: style.height, height: style.height}}
          />
        </TouchableOpacity>
      );
    }
    return (
      <View
        style={[
          styles.item,
          style,
          {width: style.height, height: style.height},
        ]}>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      </View>
    );
  }
}

export default class GIF extends Component {
  constructor(props) {
    super(props);

    this.state = {
      listGIF: [0, 0, 0, 0],
      search: '',
      isLoading: false,
      containerWidth: 0,
    };
  }

  componentDidMount() {
    this.getListGIF('/reactions/populated?gfyCount=2');
  }

  getListGIF(url) {
    this.setState({isLoading: true});
    const headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };
    if (this.axiosCancelSource) {
      this.axiosCancelSource.cancel('Cancel');
    }
    this.axiosCancelSource = axios.CancelToken.source();

    url = 'https://api.gfycat.com/v1' + url;
    axios
      .get(url, {cancelToken: this.axiosCancelSource.token, headers})
      .then((response) => {
        const data = response.data;
        let listGIF = [];

        if (data && data.gfycats) {
          data.gfycats.forEach((gfy) => {
            if (listGIF.length < 10) {
              listGIF.push(gfy);
            }
          });

        } else if (data && data.tags) {
          data.tags.forEach((tag) => {
            if (tag && tag.gfycats && tag.gfycats.length > 0) {
              if (listGIF.length < 10) {
                listGIF.push(tag.gfycats[0]);
              }
            }
          });
        }

        if (listGIF.length > 0) {
          this.setState({listGIF});
        }

        this.setState({isLoading: false});
      })
      .catch((error) => {
        console.log('response error');
        this.setState({isLoading: false});
      });
  }

  onChangeSearch = (text) => {
    this.setState({search: text});
    this._handleSearchGIF(text.toLowerCase());
  };

  _handleSearchGIF = (tag) => {
    this.getListGIF(`/reactions/populated?tagName=${tag}&gfyCount=10`);
  };

  onSelected = (url) => {
    this.onClose();
    if (this.props.onSelected) {
      this.props.onSelected(url);
    }
  };

  onClose = () => {
    if (this.props.onClose) {
      this.props.onClose();
    }
  };

  componentWillUnmount() {
    this.axiosCancelSource.cancel('Cancel');
  }

  renderItem = ({item, index}) => {
    const {containerWidth} = this.state;
    const gifMargin = 5;
    const gifSize = (containerWidth - gifMargin * 2) / 3;
    return (
      <GIFItem
        key={index}
        style={{
          height: gifSize,
          width: gifSize,
          marginLeft: index > 0 ? gifMargin : 0,
        }}
        url={isNaN(item) ? item.mobileUrl : null}
        onSelected={this.onSelected}
      />
    );
  };

  render() {
    const {listGIF, search} = this.state;
    const {style} = this.props;

    return (
      <View
        style={style}
        onLayout={(event) =>
          this.setState({containerWidth: event.nativeEvent.layout.width})
        }>
        <View style={{height: null}}>
          <FlatList
            data={listGIF}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={this.renderItem}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
        <TextInput
          style={styles.input}
          placeholder={strings('search')}
          numberOfLines={3}
          value={search}
          autoFocus={true}
          placeholderTextColor={Colors.gray5}
          onChangeText={this.onChangeSearch}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 0,
  },
  item: {
    padding: 0,
    borderWidth: 1,
    borderColor: '#DDDFE1',
  },
  image: {
    flex: 1,
    height: 100,
    resizeMode: 'contain',
  },
  input: {
    paddingVertical: 10,
    color: Colors.black,
  },
});

GIF.propTypes = {
  onSelected: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};
