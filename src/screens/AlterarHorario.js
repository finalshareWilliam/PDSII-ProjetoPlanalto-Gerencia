import React, { useState } from 'react';
import { StackActions } from '@react-navigation/routers';
import styled from 'styled-components/native';
import DateTimePicker from '@react-native-community/datetimepicker'
import Icon from 'react-native-vector-icons/AntDesign';
import { LogBox, Alert } from 'react-native';
LogBox.ignoreLogs(['Warning: ...']); 
// LogBox.ignoreAllLogs();

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
  margin-top: 20px;
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

const BackButton = styled.TouchableHighlight`
  background-color: #088A29;
  color: red;
  font-size: 22px;
  font-weight: bold;
  width: 10%;
  margin-top: 13px;
  align-items: center;
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

const Touchable = styled.TouchableOpacity`
width: 100%;
justift-content: center;
`;

export default function AlterarHorario({navigation, route}) {
  const [origem] = useState(route.params.dataHandler.getOrigem());
  const [destino] = useState(route.params.dataHandler.getDestino());
  const [dataIda] = useState(route.params.dataHandler.getDataIda());
  const [rota] = useState(route.params.item);
  const [horario, setHorario] = useState();
  const [showHorarioSelect, setShowHorarioSelect] = useState(false);

  const OnTimeChange = (event, horarioSelecionado) => {
    const tempTime = horarioSelecionado || '';
    const time = tempTime != '' ? tempTime.getHours() + ':' + tempTime.getMinutes() : '';
    setHorario(time);
    setShowHorarioSelect(false);
  }

  const ConfirmarHorario = async () => {
    if(horario){
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

      console.log(route.params.item)

      route.params.dataHandler.setAccessToken(jsonrefresh.access_token);
      route.params.dataHandler.setRefreshToken(jsonrefresh.refresh_token);

      const dataArray = dataIda.split('/');
      const horaArray = horario.split(':');
      console.log(horaArray);
      const dataCompleta = new Date(dataArray[2],dataArray[1]-1,dataArray[0],horaArray[0],horaArray[1],0);
      console.log(dataCompleta.getHours())
      const req = await fetch('http://34.207.157.190:5000/trip/' + rota.id, {
        method: 'PUT',
        body: JSON.stringify({
          access_token: route.params.dataHandler.getAccessToken(),
          origin_id: rota.origem_id,
          destination_id: rota.destino_id,
          bus_id: rota.busID,
          tripdate: dataCompleta,
          price: rota.preco
        }),
        headers:{
          'Content-Type': 'application/json'
        }
      });
      console.log(JSON.stringify({
        access_token: route.params.dataHandler.getAccessToken(),
        origin_id: rota.origem_id,
        destination_id: rota.destino_id,
        bus_id: rota.busID,
        tripdate: dataCompleta,
        price: rota.preco
      }))
      console.log(json)
      const json = await req.json();
      if(json.success){
        Alert.alert('Aviso',"Horário alterado com sucesso");
        navigation.dispatch(StackActions.pop(2));
      }else {
        Alert.alert('Aviso',"Erro ao tentar alterar o horário - "+json.message);
      }

    } else{
      Alert.alert('Aviso','Preencha os campos obrigatórios');
    }
  }

  return (
    <Page>
      <Header>
        <BackButton onPress={() => navigation.goBack()} underlayColor='#1ab241'>
          <Icon name="arrowleft" color="white" size={25}/>
        </BackButton>
        <HeaderText>{origem.name} {'--->'} {destino.name}</HeaderText>
      </Header>
      <Container>
        <Touchable onPress={() => setShowHorarioSelect(true)}>
          <InputView>
            <Input 
            placeholder={'Escolha o horário'}
            editable={false}
            onTouchStart={() => setShowHorarioSelect(true)}
            value={horario}
            />
          </InputView>
        </Touchable>
        {showHorarioSelect && (
          <DateTimePicker
          testID='dateTimePicker'
          value={new Date()}
          mode={'time'}
          is24Hour={true}
          display='default'
          onChange={OnTimeChange}/>
        )}
        <Button onPress={ConfirmarHorario}>
          <LoginText>Confirmar</LoginText>
        </Button>
      </Container>
    </Page>
  );
}