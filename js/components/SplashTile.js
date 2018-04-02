import PropTypes from 'prop-types';
import React from 'react';
import {
  TouchableOpacity,
  Text as NativeText,
  View,
  Image,
  StyleSheet,
  Dimensions,
  ViewPropTypes as RNViewPropTypes,
  ImageBackground,
} from 'react-native';

import { Text, Icon } from 'react-native-elements';

const ViewPropTypes = RNViewPropTypes || View.propTypes;
const BackgroundImage = ImageBackground || Image;


const SplashTile = (props) => {
  const {
    title,
    icon,
    caption,
    imageSrc,
    containerStyle,
    imageContainerStyle,
    overlayContainerStyle,
    iconContainerStyle,
    titleStyle,
    captionStyle,
    children,
    childrenContainerStyle,
    view,
    iconStyle,
    ...attributes
  } = props;

  let { width, height } = props;

  if (!width) {
    width = Dimensions.get('window').width;
  }
  if (!height) {
    height = width * 0.8;
  }

  const styles = StyleSheet.create({
    container: {
      width,
      height,
    },
    imageContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#ffffff',
      width,
      height,
    },
    overlayContainer: {
      flex: 1,
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.2)',
      alignSelf: 'stretch',
      justifyContent: 'center',
      paddingLeft: 25,
      paddingRight: 25,
      paddingTop: 45,
      paddingBottom: 40,
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
    text: {
      color: '#ffffff',
      backgroundColor: 'rgba(0,0,0,0)',
      marginBottom: 15,
      textAlign: 'center',
    },
    iconContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'center',
    },
    childrenContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'center',
      backgroundColor: 'transparent',
    },
    image: {
      width: 100,
      height: 100,
      backgroundColor: 'transparent',
    },
  });

  const ViewContent = view || TouchableOpacity;
  return (
    <ViewContent
      {...attributes}
      style={[styles.container, containerStyle && containerStyle]}
    >
      <BackgroundImage
        source={imageSrc}
        style={[
          styles.imageContainer,
          imageContainerStyle && imageContainerStyle,
        ]}
        resizeMode="cover"
      >
        <View
          style={[
            styles.overlayContainer,
            overlayContainerStyle && overlayContainerStyle,
          ]}
        >
          <View
            style={[
              styles.iconContainer,
              iconContainerStyle && iconContainerStyle,
            ]}
          >
            {icon && <Image {...icon} style={[styles.image, iconStyle && iconStyle]} />}
          </View>
          <Text h4 style={[styles.text, titleStyle && titleStyle]}>
            {title}
          </Text>
          <Text style={[styles.text, captionStyle && captionStyle]}>
            {caption}
          </Text>
          <View
            style={[
              styles.childrenContainer,
              childrenContainerStyle && childrenContainerStyle,
            ]}
          >
            { children }
          </View>
        </View>
      </BackgroundImage>
    </ViewContent>
  );
};

SplashTile.propTypes = {
  title: PropTypes.string,
  icon: PropTypes.object,
  caption: PropTypes.string,
  imageSrc: Image.propTypes.source.isRequired,
  onPress: PropTypes.func,
  containerStyle: ViewPropTypes.style,
  iconContainerStyle: ViewPropTypes.style,
  imageContainerStyle: ViewPropTypes.style,
  overlayContainerStyle: ViewPropTypes.style,
  titleStyle: NativeText.propTypes.style,
  captionStyle: NativeText.propTypes.style,
  width: PropTypes.number,
  height: PropTypes.number,
  children: PropTypes.any,
};

export default SplashTile;
