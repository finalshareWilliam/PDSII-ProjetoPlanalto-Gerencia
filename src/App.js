import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import OrigemPesquisa  from './screens/OrigemPesquisa'
import DestinoPesquisa  from './screens/DestinoPesquisa'
import NovaViagem from './screens/NovaViagem'
import Login from './screens/Login';
import Confirmar from './screens/Confirmar';
import MainMenu from './screens/Menu';
import AdicionarBus from './screens/AdicionarBus';
import Onibus from './screens/Onibus';
import ExcluirViagem from './screens/ExcluirViagem';
import Rotas from './screens/Rotas';
import AlterarHorario from './screens/AlterarHorario';
import InserirViagem from './screens/InserirViagem';
import EditarViagem from './screens/EditarViagem';
import RotasEdit from './screens/RotasEdit';
import AdicionarCidade from './screens/AdicionarCidade';

const Stack = createNativeStackNavigator();

export default () => {

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen
        name='Login'
        component={Login}/>
      <Stack.Screen
        name='Menu'
        component={MainMenu}/>
      <Stack.Screen
        name='Adicionar Onibus'
        component={AdicionarBus}/>
      <Stack.Screen
        name='Excluir Viagem'
        component={ExcluirViagem}/>
      <Stack.Screen
        name='Onibus'
        component={Onibus}/>
      <Stack.Screen
        name='Pesquisa de Origem'
        component={OrigemPesquisa}/>
      <Stack.Screen
        name='Pesquisa de Destino'
        component={DestinoPesquisa}/>
      <Stack.Screen
        name='Rotas'
        component={Rotas}/>
      <Stack.Screen
        name='Confirmar'
        component={Confirmar}/>
      <Stack.Screen
        name='Alterar Horario'
        component={AlterarHorario}/>
        <Stack.Screen
        name='Editar Viagem'
        component={EditarViagem}/>
        <Stack.Screen
        name='Rotas Editar'
        component={RotasEdit}/>
      <Stack.Screen
        name='Inserir Viagem'
        component={InserirViagem}/>
      <Stack.Screen
        name='Nova Viagem'
        component={NovaViagem}/>
      <Stack.Screen
        name='Adicionar Cidade'
        component={AdicionarCidade}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
