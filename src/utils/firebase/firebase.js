import firebase from 'firebase';
import config from '../../config/env';

firebase.initializeApp(config.firebase);
const db = firebase.database();

export {
  firebase,
  db
};
