import React, { useState } from 'react';
import { View, TouchableWithoutFeedback } from 'react-native';
import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/AntDesign';
import { LogBox, Alert } from 'react-native';
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

const SelectButton = styled.TouchableHighlight`
flex: 1;
`;

const SelectText = styled.Text`
color: black;
font-size: 22px;
bottom: 30px;
text-align: center;
`;

const YesText = styled.Text`
color: white;
background-color: #04B431;
font-size: 22px;
padding: 10px;
border-radius: 5px;
text-align: center;
`;

const NoText = styled.Text`
color: white;
background-color: red;
font-size: 22px;
padding: 10px;
border-radius: 5px;
text-align: center;
`;

const VoucherArea = styled.Modal`
  background-color: rgba(0, 0, 0, 0.3);
`;

const VoucherAreaBody = styled.TouchableOpacity`
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3);
`;

const Box = styled.View`
  width: 80%;
  height: 30%
  background-color: white;
  position: absolute;
  left: 10%;
  top: 30%;
  align-items: center;
  justify-content: center;
  padding: 10px;
  border-radius: 5px;
`;

const SelectArea = styled.View`
display: flex;
flex-direction: row;
padding: 5px;
`;

const Space = styled.View`
flex: 1;
`;

export default function Rotas({navigation, route}) {
  const [viagens, setViagens] = useState(route.params.viagens);
  const [origem] = useState(route.params.dataHandler.getOrigem());
  const [destino] = useState(route.params.dataHandler.getDestino());
  const [dataIda] = useState(route.params.dataHandler.getDataIda());
  const [selectVisible, setSelectVisible] = useState(false);
  const [currentId, setCurrentId] = useState(0);
  const [currentBus, setCurrentBus] = useState();

  const formatarData = (data) => {
    let d = new Date (data);
    return `${d.getDate().toString().padStart(2,'0')}/${(d.getMonth()+1).toString().padStart(2,'0')}/${d.getFullYear()}`
  }

  const formatarHora = (data) => {
    let d = new Date (data);
    return `${d.getHours().toString().padStart(2,'0')}:${d.getMinutes().toString().padStart(2,'0')}`
  }

  const RemoverOnibus = async () => {
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
    
    const req = await fetch('http://34.207.157.190:5000/trip/' + currentId, {
      method: 'DELETE',
      body: JSON.stringify({
        access_token: route.params.dataHandler.getAccessToken(),
      }),
      headers:{
        'Content-type': 'application/json'
      }
    });
    const json = await req.json();

    if(json.success){
      let busArray = viagens;
      busArray.splice(viagens.indexOf(currentBus), 1)
      setViagens(busArray);
      setSelectVisible(false);
      Alert.alert('Aviso','Este ônibus foi removido com sucesso');
    } else{
      Alert.alert('Aviso','Houve um erro ao tentar remover este ônibus');
      console.log(json.message);
    }
  }

  const ShowModal = (item) => {
    setCurrentBus(item);
    setCurrentId(item.id);
    setSelectVisible(true);
  }

  return (
    <Page>
      <Header>
        <BackButton onPress={() => navigation.goBack()} underlayColor='#1ab241'>
          <Icon name="arrowleft" color="white" size={25}/>
        </BackButton>
        <HeaderText>{origem.name} {'--->'} {destino.name}</HeaderText>
      </Header>

      <VoucherArea 
        visible={selectVisible}
        transparent={true}>
        <VoucherAreaBody onPressOut={()=>setSelectVisible(false)}>
          <TouchableWithoutFeedback>
            <Box>
              <SelectText>
                Você realmente deseja remover este ônibus desta viagem?
              </SelectText>
              <SelectArea>
              <SelectButton onPress={RemoverOnibus}>
                <YesText>
                  Sim
                </YesText>
              </SelectButton>
              <Space></Space>
              <SelectButton onPress={() => setSelectVisible(false)}>
                <NoText>
                  Não
                </NoText>
              </SelectButton>
              </SelectArea>
            </Box>
          </TouchableWithoutFeedback>
        </VoucherAreaBody>
      </VoucherArea>
      
      <SearchDropdownArea>
        <SearchDropdown>
        {viagens.map(item=>{
          return(
            <ItemArea onPress={() => ShowModal(item)}
            navigator={navigation}
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