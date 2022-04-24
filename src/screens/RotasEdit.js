import React, { useState } from 'react';
import { View} from 'react-native';
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
  top: 25%;
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
  padding-top: 5px;
  padding-bottom: 5px;
  color: #A4A4A4;
`;

const ItemArea = styled.TouchableHighlight`
  width: 100%;
  border-width: 1px;
  border-color: #A4A4A4;
  border-radius: 10px;
  margin-bottom: 10px;
  background-color: white;
  padding-left: 10px;
`;

export default function RotasEdit({navigation, route}) {
  const [viagens] = useState(route.params.viagens);
  const [origem] = useState(route.params.dataHandler.getOrigem());
  const [destino] = useState(route.params.dataHandler.getDestino());

  const formatarData = (data) => {
    let d = new Date (data);
    return `${d.getDate().toString().padStart(2,'0')}/${(d.getMonth()+1).toString().padStart(2,'0')}/${d.getFullYear()}`
  }

  const formatarHora = (data) => {
    let d = new Date (data);
    return `${d.getHours().toString().padStart(2,'0')}:${d.getMinutes().toString().padStart(2,'0')}`
  }

  return (
    <Page>
      <Header>
        <BackButton onPress={() => navigation.goBack()} underlayColor='#1ab241'>
          <Icon name="arrowleft" color="white" size={25}/>
        </BackButton>
        <HeaderText>{origem.name} {'--->'} {destino.name}</HeaderText>
      </Header>
      <SearchDropdownArea>
        <SearchDropdown>
        {viagens.map(item=>{
          return(
            <ItemArea onPress={() => navigation.navigate("Alterar Horario", {dataHandler: route.params.dataHandler, item: item})} navigator={navigation}
            underlayColor='#b5b5b5'
            activeOpacity={0.6}>
            <View>
              <Item>Data: {formatarData(item.dataIda)}</Item>
              <Item>Hora: {formatarHora(item.dataIda)}</Item>
              <Item>Preço: R${item.preco.toFixed(2)}</Item>
              <Item>ID do ônibus: {item.busID}</Item>
            </View>
            </ItemArea>
          )})
        }
        </SearchDropdown>
      </SearchDropdownArea>
    </Page>
  );
}