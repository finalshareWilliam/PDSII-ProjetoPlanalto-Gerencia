import React, { useState } from 'react';
import { Image, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import styled from 'styled-components/native';
import DatePicker from 'react-native-datepicker';
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

const Touchable = styled.TouchableOpacity``;
  
export default function ViagemForm({navigation, route}) {
  const dia = new Date().getDate();
  const mes = new Date().getMonth()+1;
  const ano = new Date().getFullYear();
  const data = dia + '/' + mes + '/' + ano;

  var novoMes = Number(mes)+2;
  var novoAno = Number(ano);
  if(novoMes > 12){
    novoMes -= 12;
    novoAno += 1;
  }

  const ultimoMes = novoMes.toString();
  const ultimoAno = novoAno.toString();
  const ultimaData = '28/' + ultimoMes + '/' + ultimoAno;

  const [origem, setOrigem] = useState('');
  const [destino, setDestino] = useState('');
  const [dataIda, setDataIda] = useState(data);

  const onPressOrigem = async () => {
    try {
      const reqCities = await fetch('http://34.207.157.190:5000/city', {
        method: 'GET'
      });
      
      const jsonCities = await reqCities.json();
      
      const cities = jsonCities.cities;

      if(jsonCities.success == false){
        Alert.alert('Aviso','Erro na busca - ' + jsonCities.message);
      } else {
        navigation.navigate('Pesquisa de Origem', {cities: cities, onReturnOrigem: (item) => {setOrigem(item)}})
      }

    } catch (error) {
      Alert.alert('Aviso','Erro interno do servidor! Tente novamente mais tarde.');
      console.log(error);
    }
  }

  const onPressDestino = async () => {
    try {
      const reqCities = await fetch('http://34.207.157.190:5000/city', {
        method: 'GET'
      });

      const jsonCities = await reqCities.json();

      const cities = jsonCities.cities;

      if(jsonCities.success == false){
        Alert.alert('Aviso','Erro na busca - ' + jsonCities.message);
      } else {
        navigation.navigate('Pesquisa de Destino', {cities:cities, onReturnDestino: (item) => {setDestino(item)}})
      }

    } catch (error) {
      Alert.alert('Aviso','Erro interno do servidor! Tente novamente mais tarde.');
      console.log(error);
    }

  }

  const Buscar = async () => {
    if(origem && destino && dataIda !== ""){
      const dataArray = dataIda.split('/');
      const dataCerta = dataArray[2] + '-' + dataArray[1] + '-' + dataArray[0];
      console.log(dataCerta);
      const req = await fetch('http://34.207.157.190:5000/tripByDate', {
        method: 'POST',
        body: JSON.stringify({
          tripdate: dataCerta,
          origin_id: origem.id,
          destination_id: destino.id
        }),
        headers:{
          'Content-type': 'application/json'
        }
      });
      var viagens = [];
      const json = await req.json();
      console.log(json);
      if(json.success){
        json.trips.forEach(item => {
          console.log(item.bus);
          viagens.push({
            dataIda: item.tripdate, 
            preco: item.price, 
            id: item.id, 
            busID: item.bus_id
          });
        })
      } else{
        console.log(json.message);
      }
      route.params.dataHandler.setDataIda(dataIda)
      route.params.dataHandler.setOrigem(origem)
      route.params.dataHandler.setDestino(destino)
      navigation.navigate('Nova Viagem', {dataHandler: route.params.dataHandler, viagens: viagens});
    }
    else{
      alert('Preencha os campos obrigatórios');
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
        <Image source={require('../images/logo.png')} style={{height: 50, width: 330, marginBottom: 20, marginTop: 20}} />
        <Touchable onPress={onPressOrigem}>
        <InputView>
          <Input 
          placeholder={'Escolha sua Origem'}
          editable={false}
          onTouchStart={onPressOrigem}
          value={origem.name}
          />
        </InputView>
        </Touchable>
        <Touchable onPress={onPressDestino}>
        <InputView>
          <Input 
          placeholder={'Escolha seu Destino'}
          editable={false}
          onTouchStart={onPressDestino}
          value={destino.name}/>
        </InputView>
        </Touchable>
        <InputView>
          <DatePicker
          style={styles.datePickerStyle}
          date={dataIda}
          mode="date"
          placeholder="Escolha a data de ida"
          format="DD/MM/YYYY"
          minDate={data}
          maxDate={ultimaData}
          confirmBtnText="Confirmar"
          cancelBtnText="Cancelar"
          customStyles={{
            dateIcon: {
              position: 'absolute',
              left: 0,
              top: 4,
              marginLeft: 0,
            },
            dateInput: {
              borderWidth: 0,
            },
            dateText: {
              fontSize: 18,
            },
            placeholderText: {
              fontSize: 18,
              color: '#A4A4A4',
            },
          }}
          onDateChange={(dataIda) => {setDataIda(dataIda)}}/>
        </InputView>
        <Button onPress={Buscar}>
          <LoginText>Buscar</LoginText>
        </Button>
      </Container>
    </Page>
  );
}
