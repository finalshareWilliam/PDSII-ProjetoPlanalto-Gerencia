import React, { useState } from 'react';
import styled from 'styled-components/native';
import DateTimePicker from '@react-native-community/datetimepicker'
import Icon from 'react-native-vector-icons/AntDesign';
import { LogBox } from 'react-native';
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

export default function AdicionarBus({navigation, route}) {
  const [origem] = useState(route.params.dataHandler.getOrigem());
  const [destino] = useState(route.params.dataHandler.getDestino());
  const [dataIda] = useState(route.params.dataHandler.getDataIda())
  const [onibus, setOnibus] = useState({plate: ''});
  const [horario, setHorario] = useState();
  const [preco, setPreco] = useState('');
  const [showHorarioSelect, setShowHorarioSelect] = useState(false);

  const OnPressOnibus = async () => {
    const req = await fetch("http://34.207.157.190:5000/bus");
    const json = await req.json();
    const buses = json.buses;
    navigation.navigate("Onibus", {buses, OnReturnOnibus: (item) => setOnibus(item)});
  }

  const OnTimeChange = (event, horarioSelecionado) => {
    const tempTime = horarioSelecionado || '';
    const time = tempTime != '' ? tempTime.getHours().toString().padStart(2,'0') + ':' + tempTime.getMinutes().toString().padStart(2,'0') : '';
    setHorario(time);
    setShowHorarioSelect(false);
  }

  const EnviarOnibus = () => {
    if(onibus.plate != '' && horario && preco != ''){
      navigation.navigate('Confirmar', {dataHandler: route.params.dataHandler, onibus, horario, preco});
    }
    else{
      alert('Preencha os campos obrigatórios');
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

      <Touchable onPress={OnPressOnibus}>
        <InputView>
          <Input 
          placeholder={'Escolha o ônibus'}
          editable={false}
          onTouchStart={OnPressOnibus}
          value={onibus.plate}
          />
        </InputView>
      </Touchable>
      <Touchable>
        <InputView>
          <Input 
          placeholder={'Defina o preço'}
          editable={true}
          keyboardType="numeric"
          value={preco}
          onChangeText={t => setPreco(t)}
          />
        </InputView>
      </Touchable>
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
      <Button onPress={EnviarOnibus}>
        <LoginText>Enviar</LoginText>
      </Button>
      </Container>
    </Page>
  );
}