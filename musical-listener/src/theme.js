import { StyleSheet } from 'react-native'

export const colors = {
  roseLight: '#ff769c',
  rosePulse: '#ff5d91',
  purpleLink: '#c393ff',
  blueSofter: '#e0edff',
  blueSoft: '#006aff',
  blueDeep: '#1b45ff',
  blueDeeper: '#1a39ba',
  goldString: '#ffc400',
}

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: colors.blueSoft
  },
  headerTitle: {

  },
  inputContainer: {
    borderWidth: 2,
    borderBottomWidth: 2,
    borderColor: colors.purpleLink,
    borderRadius: 4,
    paddingLeft: 10,
    paddingRight: 10,
    marginBottom: 10,
  },
  inputLabel: {
    color: 'black',
    paddingLeft: 4,
  },
  button: {
    height: 50,
    backgroundColor: colors.rosePulse,
  },
  buttonContainer: {
    margin: 10,
    marginTop: 0,
  },
})