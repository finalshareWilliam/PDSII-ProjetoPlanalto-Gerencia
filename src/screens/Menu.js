import React, { useState } from 'react';
import { Image, TouchableWithoutFeedback, View } from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';
import IconAwesome from 'react-native-vector-icons/FontAwesome';
import styled from 'styled-components/native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DataHandler from '../DataHandler';

const Stack = createNativeStackNavigator();

const Page = styled.SafeAreaView`
  flex: 1;
  background-color: #F2F2F2;
  align-items: center;
`;//Area que contem os elementos da tela

const Container = styled.View`
  width: 90%;
`;//Area que contem o conteudo principal da tela

const InputView = styled.View`
  width: 90%;
  border-bottom-width: 1px;
  border-bottom-color: #A4A4A4;
  padding: 5px;
  margin-bottom: 20px;
`;//Area que contem os inputs

const Input = styled.TextInput`
  height: 40px;
  font-size: 18px;
  color: black;
`;//Os inputs em si

const BackButton = styled.TouchableHighlight`
  background-color: #088A29;
  color: red;
  font-size: 22px;
  font-weight: bold;
  width: 10%;
`;

const ButtonSymbol = styled.Text`
  color: white;
  font-size: 22px;
  font-weight: bold;
  width: 100%;
  justify-content: center;
  padding-left: 10px;
  padding-top: 10px;
`;

const Button = styled.TouchableHighlight`
  margin-bottom: 10px;
  width: 100%;  
`;//Area que fica os botões

const LoginText = styled.Text`
  color: white;
  background-color: #04B431;
  font-size: 22px;
  padding: 10px;
  border-radius: 5px;
  text-align: center;
`;//Texto de realizar o login

const Header = styled.View`
  width: 100%;
  background-color: #088A29;
  height: 50px;
  align-items: flex-start;
  flex-direction: row;
`;//Area que contem o titulo da tela

const HeaderText = styled.Text`
  color: white;
  font-size: 22px;
  padding: 10px;
`;//Titulo da tela

const MenuButton = styled.TouchableHighlight`
  background-color: #088A29;
  color: red;
  font-size: 22px;
  font-weight: bold;
  width: 10%;
  margin-top: 13px;
  align-items: center;
`;

const Menu = styled.Modal`
background-color: rgba(0, 0, 0, 0.3);
`;

const MenuBody = styled.TouchableOpacity`
width: 100%;
height: 100%;
background-color: rgba(0, 0, 0, 0.3);
`;

const Box = styled.View`
width: 80%;
height: 100%;
background-color: white;
`;

const MenuItem = styled.TouchableHighlight`
padding: 20px;
border-bottom-width: 1px;
border-bottom-color: #aaaaaa;
`;

const MenuItemText = styled.Text`
position: absolute;
margin-left: 60px;
font-size: 20px;
color: #aaaaaa;
`;

const Touchable = styled.TouchableOpacity``;

export default function MainMenu({navigation, route}) {
  const [menuVisible, setMenuVisible] = useState(false);

  const Sair = () => {
    setMenuVisible(false)
    route.params.dataHandler.setAccessToken('');
    route.params.dataHandler.setRefreshToken('');
    navigation.navigate('Login');
  }

  return (
    <Page>
      <Menu visible={menuVisible}
      animationType='slide'
      transparent={true}>
        <MenuBody onPressOut={()=>setMenuVisible(false)}>
          <TouchableWithoutFeedback>
            <Box>
              <MenuItem onPress={()=>setMenuVisible(false)}>
                <View>
                  <Icon name="home" color="#aaaaaa" size={25}/>
                  <MenuItemText>Home</MenuItemText>
                </View>
              </MenuItem>

              <MenuItem onPress={()=>Sair()}>
                <View>
                  <Icon name="log-out" color="#aaaaaa" size={25}/>
                  <MenuItemText>Sair</MenuItemText>
                </View>
              </MenuItem>
            </Box>
          </TouchableWithoutFeedback>
        </MenuBody>
      </Menu>

      <Header>
        <MenuButton onPress={()=>setMenuVisible(true)}>
          <Icon name='menu' size={25} color="white"/>
        </MenuButton>
        <HeaderText>Opções Gerente</HeaderText>
      </Header>

      <Container>
        <Image source={require('../images/logo.png')} style={{height: 50, width: 330, marginBottom: 20, marginTop: 20, alignSelf: 'center'}} />
        <Button onPress={() => navigation.navigate('Adicionar Cidade', {dataHandler: route.params.dataHandler})}>
          <LoginText>Adicionar Cidade</LoginText>
        </Button>
        <Button onPress={() => navigation.navigate('Inserir Viagem', {dataHandler: route.params.dataHandler})}>
          <LoginText>Inserir Viagem</LoginText>
        </Button>
        <Button onPress={() => navigation.navigate('Editar Viagem', {dataHandler: route.params.dataHandler})}>
          <LoginText>Editar Viagem</LoginText>
        </Button>
        <Button onPress={() => navigation.navigate('Excluir Viagem', {dataHandler: route.params.dataHandler})}>
          <LoginText>Excluir Viagem</LoginText>
        </Button>
      </Container>
    </Page>
  );
}