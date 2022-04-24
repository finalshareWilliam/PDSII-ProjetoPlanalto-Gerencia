import { StackActions } from '@react-navigation/routers';
import React, { useState } from 'react';
import { View, Alert } from 'react-native';
import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/AntDesign';
import { LogBox } from 'react-native';
LogBox.ignoreLogs(['Warning: ...']); 
// LogBox.ignoreAllLogs();

const Page = styled.SafeAreaView`
  flex: 1;
  background-color: #F2F2F2;
  align-items: center;
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

const SearchDropdownArea = styled.ScrollView`
  position: absolute;
  top: 15%;
  left: 0px;
  right: 0px;
  bottom: 0px;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
`;

const SearchDropdown = styled.View`
  flex-wrap: wrap;
  margin-horizontal: 20px;
`;

const BackButton = styled.TouchableHighlight`
  background-color: #088A29;
  color: red;
  font-size: 22px;
  font-weight: bold;
  width: 10%;
  margin-top: 13px;
  align-items: center;
`;

const Item = styled.Text`
  font-size: 20px;
  width: 100%;
  padding-top: 10px;
  padding-bottom: 10px;
  color: #A4A4A4;
  padding-left: 20px;
`;

const ItemArea = styled.TouchableHighlight`
  width: 100%;
  border-width: 1px;
  border-color: #A4A4A4;
  border-radius: 10px;
  margin-bottom: 10px;
  background-color: white;
`;

const Button = styled.TouchableHighlight`
  margin-bottom: 20px;
  margin-top: 10px;
  align-self: center;
  width: 90%;
`;

const LoginText = styled.Text`
  color: white;
  background-color: #04B431;
  font-size: 22px;
  padding: 10px;
  border-radius: 5px;
  text-align: center;
`;

export default function Confirmar({navigation, route}) {
  const [origem] = useState(route.params.dataHandler.getOrigem());
  const [destino] = useState(route.params.dataHandler.getDestino());
  const [dataIda] = useState(route.params.dataHandler.getDataIda())
  const [horario] = useState(route.params.horario);
  const [onibus] = useState(route.params.onibus);
  const [preco] = useState(route.params.preco);

  const Confirmar = async () => {
    const reqrefresh = await fetch("http://34.207.157.190:5000/refresh", {
        method: 'POST',
        body: JSON.stringify({
          refresh_token: route.params.dataHandler.getRefreshToken()
        }),
        headers:{
          'Content-Type': 'application/json'
        }
      });
    const jsonrefresh = await reqrefresh.json();

    console.log(jsonrefresh)

    route.params.dataHandler.setAccessToken(jsonrefresh.access_token);
    route.params.dataHandler.setRefreshToken(jsonrefresh.refresh_token);
      
    const dataArray = dataIda.split('/');
    const horaArray = horario.split(':');
    const dataCompleta = new Date(dataArray[2],dataArray[1]-1,dataArray[0],horaArray[0],horaArray[1],0);

    const req = await fetch('http://34.207.157.190:5000/trip', {
        method: 'POST',
        body: JSON.stringify({
          access_token: route.params.dataHandler.getAccessToken(),
          origin_id: origem.id,
          destination_id: destino.id,
          bus_id: onibus.id,
          tripdate: dataCompleta,
          price: preco
        }),
        headers:{
          'Content-Type': 'application/json'
        }
      });
      console.log(JSON.stringify({
        access_token: route.params.dataHandler.getAccessToken(),
        origin_id: origem.id,
        destination_id: destino.id,
        bus_id: onibus.id,
        tripdate: dataCompleta,
        price: parseFloat(preco)
      }))
      const json = await req.json();
      if(json.success == true){
        Alert.alert('Aviso','Viagem adicionada com sucesso!');
        navigation.dispatch(StackActions.pop(4));
      }
      else{
        Alert.alert('Aviso','Erro ao adicionar o ônibus - '+json.message);
        console.log(json.message);
      }
  }

  return (
    <Page>
      <Header>
        <BackButton onPress={() => navigation.goBack()} underlayColor='#1ab241'>
          <Icon name="arrowleft" color="white" size={25}/>
        </BackButton>
        <HeaderText>Confirmação de Ônibus</HeaderText>
      </Header>
      <SearchDropdownArea>
        <SearchDropdown>
          <ItemArea>
            <View>
              <Item>{origem.name} -{'>'} {destino.name}</Item>
              <Item>Data: {dataIda}</Item>
              <Item>Horário: {horario}</Item>
              <Item>Placa do ônibus: {onibus.plate}</Item>
              <Item>Modelo do ônibus: {onibus.model}</Item>
              <Item>ID do ônibus: {onibus.id}</Item>
              <Button onPress={Confirmar}>
                <LoginText>Confirmar</LoginText>
              </Button>
            </View>
          </ItemArea>
        </SearchDropdown>
      </SearchDropdownArea>
    </Page>
  );
}