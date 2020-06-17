import React, {useEffect, useState} from 'react';

import {Image, FlatList} from 'react-native';

import api from '../../services/api';
import {Pokemon} from '../../components';

import {Container, Title, PokeList} from './styles';

interface PokemonProps {
   id: string;
   url: string;
   name: string;
}

const Home: React.FC = () => {
   const [pokemons, setPokemons] = useState<PokemonProps[]>([]);
   const [page, setPage] = useState(0);

   useEffect(() => {
      async function loadPokemons(): Promise<void> {
         const {data} = await api.get(`pokemon?offset=${page * 40}&limit=40`);

         console.log(data);

         const formattedPokemons = data.results.map((p: PokemonProps) => {
            return {
               ...p,
               id: p.url.split('/')[p.url.split('/').length - 2],
            };
         });

         setPokemons([...pokemons, ...formattedPokemons]);
      }

      loadPokemons();
   }, [page]);

   return (
      <Container
         imageStyle={{
            width: 163,
            height: 192,
            position: 'absolute',
            left: undefined,
         }}
         source={require('../../assets/images/pokeball.jpg')}>
         <FlatList
            ListHeaderComponent={<Title>Pokedex</Title>}
            style={{flex: 1, borderRadius: 10}}
            columnWrapperStyle={{
               justifyContent: 'space-between',
               marginBottom: 10,
            }}
            data={pokemons}
            keyExtractor={(item) => item.id}
            renderItem={({item}) => <Pokemon data={item} />}
            numColumns={2}
            onEndReached={() => {
               setPage((state) => state + 1);
            }}
            onEndReachedThreshold={0.3}
         />
      </Container>
   );
};

export default Home;
