/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';

import {Text} from '../../Components';
import {Colors} from '../../Theme';
import ResponsiveUtils from '../../Utils/ResponsiveUtils';

export default class TagInput extends React.Component {
  constructor(props) {
    super(props);
    this.input = React.createRef();

    this.state = {
      hashTag: [],
      text: '',
      editable: true,
      heightContainer: 40,
      isFocus: false,
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const {hashTag} = nextProps;
    if (hashTag != prevState.hashTag) {
      return {hashTag};
    }

    return null;
  }

  setTags(hashTag) {
    this.setState({hashTag});
  }

  getTags() {
    return this.state.hashTag;
  }

  addTag(word) {
    let hashTag = this.state.hashTag;
    if (!word) {
      return;
    }

    if (word.charAt(0) != '#') {
      word = '#' + word;
    }
    hashTag.push(word);
    this.setState({hashTag, text: ''});
  }

  onChangeText = (text) => {
    const words = text.split(' ');

    if (words.length > 1) {
      const word = words.join('');
      this.addTag(word);
      return;
    }

    this.setState({text: text.trim()});
  };

  onBlur = () => {
    this.addTag(this.state.text);
    this.setState({isFocus: false});
  };

  onSelectSuggestion = (text) => {
    this.setState({text});
    this.input.current?.focus();
  };

  removeTag = (index) => {
    const hashTag = this.state.hashTag;
    if (hashTag.length > 0) {
      if (index >= 0 && index < hashTag.length) {
        hashTag.splice(index, 1);
        this.setState({hashTag});
      } else {
        const text = hashTag.pop();
        this.setState({hashTag, text});
      }
    }
  };

  clearContent() {
    this.setState({hashTag: [], text: ''});
  }

  render() {
    const {hashTag, text, heightContainer} = this.state;
    const {
      style,
      placeholder,
      allTags,
      styleContainer,
      styleInput,
      styleTag,
      editable,
      placeholderTextColor,
    } = this.props;

    const fontSize = (style && style.fontSize) || 14;

    const renderTags = hashTag.map((item, index) => (
      <View style={[styles.tag, styleTag]} key={index}>
        <TouchableOpacity onPress={() => this.removeTag(index)}>
          <View
            style={[
              styles.tag,
              styleTag,
              index == hashTag.length - 1 && {marginRight: 10},
            ]}>
            <Text style={{color: Colors.primary}} size={fontSize}>
              {item}
            </Text>
          </View>
        </TouchableOpacity>
        {index < hashTag.length - 1 && (
          <Text style={{color: Colors.primary}} size={fontSize}>
            {', '}
          </Text>
        )}
      </View>
    ));

    const renderSuggestion = allTags.map((item, index) => {
      const textTrim = text.trim().toLowerCase();
      if (
        item.toLowerCase().includes(textTrim) &&
        item.toLowerCase() != text.toLowerCase()
      ) {
        return (
          <TouchableOpacity
            key={index}
            style={{}}
            onPress={() => this.onSelectSuggestion(item)}>
            <View style={{paddingVertical: 10, paddingHorizontal: 10}}>
              <Text color={Colors.white} size={fontSize}>
                {item}
              </Text>
            </View>
          </TouchableOpacity>
        );
      }
    });

    return (
      <View style={Platform.OS == 'ios' && {zIndex: 100}}>
        <View
          style={[styles.container, styleContainer]}
          onLayout={(event) =>
            this.setState({heightContainer: event.nativeEvent.layout.height})
          }>
          {renderTags}
          <TextInput
            ref={this.input}
            style={[styles.input, {fontSize}, styleInput]}
            placeholder={placeholder}
            value={text}
            editable={editable}
            returnKeyType={'next'}
            placeholderTextColor={placeholderTextColor}
            onFocus={() => this.setState({isFocus: true})}
            onBlur={this.onBlur}
            onChangeText={this.onChangeText}
            onKeyPress={({nativeEvent}) => {
              if (text == '' && nativeEvent.key === 'Backspace') {
                this.removeTag();
              }
            }}
          />
        </View>
        {text != '' && this.state.isFocus && (
          <View style={[styles.tagContainer, {top: heightContainer}]}>
            <ScrollView keyboardShouldPersistTaps="always">
              {renderSuggestion}
            </ScrollView>
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    padding: 6,
  },
  tag: {
    flexDirection: 'row',
    borderRadius: 20,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    minWidth: 30,
    paddingVertical: 5,
    fontFamily: 'MPLUS1p-Medium',
  },
  tagContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    backgroundColor: 'gray',
    borderRadius: 10,
    zIndex: 120,
    elevation: 5,
    maxHeight: ResponsiveUtils.height(130),
  },
});
