
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';

import { supabase } from '../lib/supabase';

export default function AuthScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function signIn() {
    if (!email.trim() || !password) {
      Alert.alert('안내', '이메일과 비밀번호를 입력해줘.');
      return;
    }

    setLoading(true);

    try {
      const { error } =
        await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

      if (error) throw error;
    } catch (error: any) {
      Alert.alert('로그인 실패', error.message);
    } finally {
      setLoading(false);
    }
  }

  async function signUp() {
    if (!email.trim() || password.length < 6) {
      Alert.alert(
        '안내',
        '이메일과 6자 이상의 비밀번호를 입력해줘.'
      );
      return;
    }

    setLoading(true);

    try {
      const { data, error } =
        await supabase.auth.signUp({
          email: email.trim(),
          password,
        });

      if (error) throw error;

      if (!data.session) {
        Alert.alert(
          '이메일 확인',
          '이메일로 전송된 인증 링크를 확인해줘.'
        );
      } else {
        Alert.alert('완료', '회원가입에 성공했어!');
      }
    } catch (error: any) {
      Alert.alert('회원가입 실패', error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>✦ 모아트립</Text>
      <Text style={styles.subtitle}>
        친구들과 함께 만드는 후쿠오카 여행
      </Text>

      <TextInput
        style={styles.input}
        placeholder="이메일"
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="비밀번호"
        secureTextEntry
        autoComplete="password"
        value={password}
        onChangeText={setPassword}
      />

      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <>
          <TouchableOpacity
            style={styles.button}
            onPress={signIn}
          >
            <Text style={styles.buttonText}>
              로그인
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.outlineButton}
            onPress={signUp}
          >
            <Text style={styles.outlineText}>
              회원가입
            </Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#188B78',
  },
  subtitle: {
    fontSize: 15,
    textAlign: 'center',
    color: '#777777',
    marginTop: 8,
    marginBottom: 32,
  },
  input: {
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 12,
    padding: 15,
    marginBottom: 14,
  },
  button: {
    backgroundColor: '#188B78',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  outlineButton: {
    borderWidth: 1,
    borderColor: '#188B78',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 12,
  },
  outlineText: {
    color: '#188B78',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

