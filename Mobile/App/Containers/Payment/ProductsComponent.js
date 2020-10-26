/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {StyleSheet, Image, Dimensions, TouchableOpacity} from 'react-native';
import Carousel from 'react-native-snap-carousel';
import PropTypes from 'prop-types';
import {Block, Text, Button, TextCurrency} from '../../Components';
const {width} = Dimensions.get('window');
import {Colors, ApplicationStyles, Images} from '../../Theme';
import CommonStyle from './CommonStyle';
import {strings} from '../../Locate/I18n';

export default class ProductsComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isEditing: false,
      packageIdSelected: null,
    };
  }

  static getDerivedStateFromProps(nextProps, preState) {
    const {indexProduct, products, teamRankId} = nextProps;
    const {isEditing} = preState;
    const data = {products, teamRankId};
    if (!isEditing) {
      data.indexProduct = indexProduct;
    }
    return data;
  }

  componentDidUpdate() {
    const {indexProduct} = this.state;
    this._carousel.snapToItem(indexProduct);
  }

  renderPackage = (packages) => {
    let html = [];
    if (packages && packages.length > 0) {
      packages.forEach((item, index) => {
        const {
          rankPackagePriceValue,
          rankPackagePriceUnit,
          rankPackagePriceTime,
          rankPackagePriceId,
        } = item;
        const {packageIdSelected} = this.state;
        html.push(
          <Block
            flex={false}
            style={[
              {
                width: '30%',
                backgroundColor: Colors.gray15,
                marginRight: packages.length < 3 ? '3.33%' : 0,
                borderRadius: 10,
                paddingVertical: 5,
              },
              rankPackagePriceId === packageIdSelected
                ? {borderColor: Colors.primary, borderWidth: 1}
                : {borderColor: Colors.white, borderWidth: 1},
            ]}
            key={index}>
            <TouchableOpacity
              onPress={() =>
                this.setState({
                  isEditing: true,
                  packageIdSelected:
                    rankPackagePriceId === packageIdSelected
                      ? null
                      : rankPackagePriceId,
                })
              }>
              <TextCurrency
                center
                bold
                style={Style.price}
                value={rankPackagePriceValue}
              />
              <Text center bold style={Style.price}>
                {rankPackagePriceUnit}
              </Text>
              <Text center style={Style.package}>
                {`${rankPackagePriceTime} month`}
              </Text>
            </TouchableOpacity>
          </Block>,
        );
      });
    }

    return html;
  };

  renderItem = (item, index) => {
    const {teamRankId} = this.state;
    const {
      teamRankName,
      teamRankPackagePrices,
      storageCapacity,
      teamRankMemberLimit,
    } = item;

    return (
      <Block style={Style.item}>
        <Text center style={Style.name}>
          {teamRankName}
        </Text>
        <Block
          row
          style={{
            justifyContent:
              teamRankPackagePrices && teamRankPackagePrices.length > 2
                ? 'space-between'
                : 'flex-start',
            marginVertical: 10,
          }}>
          {this.renderPackage(teamRankPackagePrices)}
        </Block>
        <Button primary style={Style.button}>
          <Text center white>
            {teamRankId === item.teamRankId ? 'UPGRADE' : 'BUY'}
          </Text>
        </Button>
        <Text style={CommonStyle.textBenefit}>
          <Image
            source={Images.iconCheckGreen}
            style={{width: 20, height: 20}}
          />
          {` ${strings('upload_file_videos_up_to_50GB_in_size').replace(
            '50',
            storageCapacity,
          )}`}
        </Text>
        <Text style={CommonStyle.textBenefit}>
          <Image
            source={Images.iconCheckGreen}
            style={{width: 20, height: 20}}
          />
          {` ${strings(
            'the_maximum_number_of_member_is_up_to_100_people',
          ).replace('100', teamRankMemberLimit)}`}
        </Text>
      </Block>
    );
  };

  render() {
    const {products} = this.state;
    return (
      <Carousel
        sliderWidth={width}
        itemWidth={width * 0.7}
        data={products}
        renderItem={({item, index}) => this.renderItem(item, index)}
        ref={(c) => {
          this._carousel = c;
        }}
        onSnapToItem={(index) =>
          this.setState({
            isEditing: true,
            indexProduct: index,
          })
        }
      />
    );
  }
}

ProductsComponent.propTypes = {
  products: PropTypes.array,
};
const Style = StyleSheet.create({
  item: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: Colors.white,
    borderRadius: 10,
  },
  name: {
    fontSize: 20,
    ...ApplicationStyles.fontMPLUS1pBold,
  },
  price: {
    fontSize: 13,
    ...ApplicationStyles.fontMPLUS1pMedium,
  },
  package: {
    fontSize: 13,
    ...ApplicationStyles.fontMPLUS1pRegular,
  },
  button: {
    height: 35,
  },
});
