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


const InputView = styled.View`
  background-color: #088A29;
  width: 100%;
  padding-left: 50px;
`

const Input  = styled.TextInput.attrs((props) => ({
  placeholderTextColor: 'white',
}))`
  background-color: #088A29;
  color: white;
  width: 80%;
  height: 50px;
  font-size: 20px;
  padding-horizontal: 10px;
  border-bottom-width: 1px;
  border-bottom-color: white;
  margin-bottom: 10px;
  padding-left: 10px;
`;

const SearchDropdown = styled.View`
  flex-wrap: wrap;
  margin-horizontal: 20px;
`;

export default function Onibus({navigation, route}) {
    const [dataSource] = useState(route.params.buses);
    const [filtered, setFiltered] = useState(dataSource);
    const [onibus, setOnibus] = useState('');

    const OnSearch = (text) => {
        setOnibus(text);
        if(text){
            const temp = text.toString().toLowerCase();

            const tempList = dataSource.filter(item=>{
                if(item.plate.toString().toLowerCase().startsWith(temp))
                return item
            })
            setFiltered(tempList);
        }
        else{
            setFiltered(dataSource);
        }
    }    

    const Select = (item) => {
      setOnibus(item.plate);
      route.params.OnReturnOnibus(item);
      navigation.goBack();
    }

    return (
        <Page>
            <Header>
                <BackButton onPress={() => navigation.goBack()}
                underlayColor='#1ab241'>
                    <Icon name="arrowleft" color="white" size={25}/>
                </BackButton>
                <HeaderText>Selecione o Ônibus</HeaderText>
            </Header>
            <InputView>
              <Input
              placeholder={'Ex: AAA-1234'}
              onChangeText={OnSearch}
              value={onibus}
              />
            </InputView>
           
                <SearchDropdownArea>
                    <SearchDropdown>
                    {
                        filtered.map(item=>{
                            return(
                            <ItemArea onPress={() => Select(item)}
                            navigator={navigation}
                            underlayColor='#b5b5b5'
                            activeOpacity={0.6}>
                            <View>
                              <Item>Placa: {item.plate}</Item>
                              <Item>Modelo: {item.model}</Item>
                              <Item>ID: {item.id.toString()}</Item>
                            </View>
                            </ItemArea>)
                        })
                    }
                    </SearchDropdown>
                </SearchDropdownArea>
        </Page>
    );
}