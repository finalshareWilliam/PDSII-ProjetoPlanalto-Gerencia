import React, { useState } from 'react';
import { Alert, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import styled from 'styled-components/native';
import { LogBox } from 'react-native';
LogBox.ignoreLogs(['Warning: ...']); 
LogBox.ignoreAllLogs();

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
  overflow: hidden;
`;

const Input  = styled.TextInput.attrs((props) => ({
  placeholderTextColor: '#A4A4A4',}))`
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

const MenuButton = styled.TouchableHighlight`
  background-color: #088A29;
  color: red;
  font-size: 22px;
  font-weight: bold;
  width: 10%;
  margin-top: 13px;
  align-items: center;
`;

const styles = StyleSheet.create({
  datePickerStyle: {
    width: 300,
  }
});

  
export default function AdicionarCidade({navigation, route}) {
  const [cidade, setCidade] = useState('');

  const Adicionar = async () => {
    if(cidade !== ""){
      const req = await fetch('http://34.207.157.190:5000/city', {
        method: 'POST',
        body: JSON.stringify({
          access_token: route.params.dataHandler.getAccessToken(),
          name: cidade
        }),
        headers:{
          'Content-type': 'application/json'
        }
      });
    
      const json = await req.json();

      if(json.success){
        Alert.alert('Aviso', 'Cidade adicionada com sucesso!');
        navigation.navigate('Menu', {dataHandler: route.params.dataHandler});
      } else{
        Alert.alert('Aviso', 'Erro ao adicionar - '+ json.message);
      }
      
    }
    else{
      Alert.alert('Aviso', 'Preencha os campos obrigatórios');
    }
  }

  return (
    <Page>
      <Header>
        <MenuButton onPress={() => navigation.goBack()}
        underlayColor='#1ab241'>
            <Icon name="arrowleft" color="white" size={25}/>
        </MenuButton>
        <HeaderText>Pesquisa de Rota</HeaderText>
      </Header>

      <Container>
        <InputView>
          <Input value={cidade} onChangeText={t=>setCidade(t)} placeholder={'Nome da cidade'}/>
        </InputView>
        <Button onPress={Adicionar}>
          <LoginText>Adicionar</LoginText>
        </Button>
      </Container>
    </Page>
  );
}
