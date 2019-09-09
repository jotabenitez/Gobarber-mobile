import { Alert } from 'react-native';
import { takeLatest, call, put, all } from 'redux-saga/effects';

import api from '~/services/api';
// import history from '~/services/history';

import { signInSuccess, signFailure } from './actions';

export function* signIn({ payload }) {
  try {
    const { email, password } = payload;

    const response = yield call(api.post, 'sessions', {
      email,
      password,
    });

    const { token, user } = response.data;

    if (user.provider) {
      Alert.alert(
        'Erro no Login',
        'Usuario nao pode ser prestador de servicos'
      );
      return;
    }

    api.defaults.headers.Authorization = `Bearer ${token}`;

    // yield delay(3000); import { delay } from 'redux-saga/effects'

    yield put(signInSuccess(token, user));

    // history.push('/dashboard');
  } catch {
    Alert.alert('Falha na autenticaçao', 'Usuario ou senha incorretos');

    yield put(signFailure());
  }
}

export function* signUp({ payload }) {
  try {
    const { name, email, password } = payload;

    yield call(api.post, 'users', {
      name,
      email,
      password,
    });

    Alert.alert(
      'Cadastro realizado',
      'Usuario criado com sucesso. Voce pode fazer log in agora'
    );

    // history.push('/dashboard');
  } catch (err) {
    Alert.alert(
      'Cadastro nao realizado',
      'Cadastro nao foi realizado. Por favor verifique seus dados'
    );

    yield put(signFailure());
  }
}

export function setToken({ payload }) {
  if (!payload) return;

  const { token } = payload.auth;

  if (token) {
    api.defaults.headers.Authorization = `Bearer ${token}`;
  }
}

export function signOut() {
  // history.push('/');
}

export default all([
  takeLatest('persist/REHYDRATE', setToken),
  takeLatest('@auth/SIGN_IN_REQUEST', signIn),
  takeLatest('@auth/SIGN_UP_REQUEST', signUp),
  takeLatest('@auth/SIGN_OUT', signOut),
]);
