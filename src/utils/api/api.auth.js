import firebase from 'firebase';
import moment from 'moment';
import { db } from '../firebase/firebase';

const signIn = ({ email, password }) => new Promise((resolve, reject) =>
  firebase.auth().signInWithEmailAndPassword(email, password)
    .then((user) => {
      if (!user.emailVerified) {
        firebase.auth().signOut();
        return reject(new Error('이메일 인증을 해주세요.'));
      }
      return resolve('Successfully Signed in.')
    })
    .catch(err => reject(err)));

const signOut = () => new Promise((resolve, reject) =>
  firebase.auth().signOut()
    .then(() => resolve('Successfully Signed out.'))
    .catch(err => reject(err)));

const checkAuth = () => new Promise((resolve, reject) => {
  firebase.auth().onAuthStateChanged((user) => {
    if (user && user.emailVerified) return resolve(user);
    return reject();
  });
});

const getAuth = () => new Promise((resolve) => {
  const { currentUser } = firebase.auth();
  if (currentUser) return resolve(currentUser.toJSON());
  return resolve();
});

const sendEmailVerification = ({ email, password }) => new Promise((resolve, reject) => {
  firebase.auth().signInWithEmailAndPassword(email, password)
    .then((user) => {
      if (user.emailVerified) {
        firebase.auth().signOut();
        return reject(new Error('이미 이메일 인증이 되어있습니다.'));
      }
      db.ref(`/users/${firebase.auth().currentUser.uid}/sendEmailVerificationAt`).once('value', (snapshot) => {
        if (moment().diff(moment(snapshot.val()), 'minutes') < 10) {
          return reject(new Error('잠시후 다시 시도해주세요.'));
        }
        firebase.auth().currentUser.sendEmailVerification()
          .then(() => {
            firebase.auth().signOut();
            db.ref(`/users/${firebase.auth().currentUser.uid}/sendEmailVerificationAt`).set(moment().toString());
            return resolve(`${firebase.auth().currentUser.email}로 확인 메일이 전송되었습니다.`);
          });
      })
    })
    .catch(err => reject(err));
})

export {
  signIn,
  signOut,
  checkAuth,
  getAuth,
  sendEmailVerification
};
