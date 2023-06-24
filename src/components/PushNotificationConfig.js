import PushNotification, {Importance} from 'react-native-push-notification';

export default class PushNotificationConfig {
  static configure() {
    // Must be outside of any component LifeCycle (such as `componentDidMount`).
    PushNotification.configure({
      onRegister: function (token) {
        console.log('TOKEN:', token);
      },
      onNotification: function (notification) {
        console.log('NOTIFICATION:', notification);
      },
      onAction: function (notification) {
        console.log('ACTION:', notification.action);
        console.log('NOTIFICATION:', notification);
      },
      onRegistrationError: function (err) {
        console.error(err.message, err);
      },
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },
      popInitialNotification: true,
      requestPermissions: Platform.OS === 'ios',
      enableBackgroundNotificationHandler: true,
    });
  }
}
