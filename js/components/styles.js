import {
  StyleSheet,
} from 'react-native';

const styles = StyleSheet.create({
  customTabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  linkContainer: {
    flexGrow: 1,
    flexShrink: 1,
    alignItems: 'center',
    paddingVertical: 20,
  },
  linkContent: {
    display: 'flex',
    flex: 1,
    alignItems: 'center'
  },
  link: {
    alignItems: 'center',
  },
  icon: {
    // textAlign: 'center',
    // flexGrow: 1,
    width: 24,
    height: 24,
  },
});

export default styles;