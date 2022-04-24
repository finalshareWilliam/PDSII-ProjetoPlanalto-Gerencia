import React, { useState } from 'react';
import { Image, Alert } from 'react-native';
import styled from 'styled-components/native';
import DataHandler from '../DataHandler';
import { LogBox } from 'react-native';
LogBox.ignoreLogs(['Warning: ...']); 
// LogBox.ignoreAllLogs();

const dataHandler = new DataHandler();

const Page = styled.SafeAreaView`
  flex: 1;
  background-color: #F2F2F2;
  align-items: center;
`;

const Container = styled.View`
  width: 90%;
`;

const InputView = styled.View`
  width: 100%;
  border-bottom-width: 1px;
  border-bottom-color: #A4A4A4;
  margin-bottom: 20px;
  padding-left: 10px;
  overflow: hidden
`;

const Input = styled.TextInput.attrs((props) => ({
  placeholderTextColor: '#A4A4A4',
}))`
  height: 40px;
  font-size: 18px;
  overflow: hidden;
  padding: 0;
  color: #424242;
`;

const Button = styled.TouchableHighlight`
  margin-bottom: 10px;
  width: 100%;  
`;

const LoginText = styled.Text`
  color: white;
  background-color: #04B431;
  font-size: 22px;
  padding: 10px;
  border-radius: 5px;
  text-align: center;
`;

const Header = styled.View`
  width: 100%;
  background-color: #088A29;
  height: 50px;
  align-items: flex-start;
  flex-direction: row;
`;

const HeaderText = styled.Text`
  color: white;
  font-size: 22px;
  padding: 10px;
`;

export default function Login({navigation}) {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const aguardarLogin = async () =>{
    if (password != '' && username != '') {
      const req = await fetch('http://34.207.157.190:5000/login', {
        method: 'POST',
        body: JSON.stringify({
          email: username,
          password: password
        }),
        headers:{
            'Content-Type': 'application/json'
        }
      });
      const json = await req.json();

      if(json.success == true){
        dataHandler.setAccessToken(json.access_token);
        dataHandler.setRefreshToken(json.refresh_token);
        setUsername('');
        setPassword('');
        navigation.navigate('Menu', {dataHandler: dataHandler});
       } else {
        Alert.alert('Aviso','Login Negado - ' + json.message);
      } 

    } else {
      Alert.alert('Aviso', 'Preencha as informações!')
    }
  }
  
  return (
    <Page>
      <Header>
        <HeaderText>Login</HeaderText>
      </Header>
      <Container>
        <Image source={require('../images/logo.png')} style={{height: 60, width: 370, marginBottom: 20, marginTop: 20}} />
        <InputView>
          <Input value={username} onChangeText={t=>setUsername(t)} placeholder={'E-mail/CPF/CNPJ'}/>
        </InputView>
        <InputView>
          <Input secureTextEntry={true} value={password} onChangeText={t=>setPassword(t)} placeholder={'Senha'}></Input>
        </InputView>
        <Button onPress={aguardarLogin}>
          <LoginText>Fazer Login</LoginText>
        </Button>
      </Container>
    </Page>
  );
}