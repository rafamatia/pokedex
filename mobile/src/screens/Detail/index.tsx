import React, {useState, useEffect} from 'react';

import {useRoute, useNavigation} from '@react-navigation/native';
import {Image, View, TouchableOpacity} from 'react-native';
import {SharedElement} from 'react-navigation-shared-element';
import Icon from 'react-native-vector-icons/Feather';
import {Tab, Tabs} from 'native-base';

import api from '../../services/api';
import {About, BaseStats, Evolution, Moves} from './tabs';

import {
   Container,
   PokemonInfo,
   Name,
   TypeContainer,
   TypeText,
   Id,
   PokemonGrid,
   PokemonPicture,
   PokemonHeader,
} from './styles';

interface RouteParamsProps {
   data: {
      id: number;
      name: string;
   };
   color: string;
   types: {
      name: string;
   }[];
}

interface StatsProps {
   base_stat: number;
   effort: number;
   stat: {
      name: string;
   };
}

interface MeasuresProps {
   height: number;
   weight: number;
}

interface EggProps {
   group: string;
   cycle: string;
}

interface MoveProps {
   name: string;
   learned_at: number;
   learn_method: string;
}

const Detail: React.FC = () => {
   const {params} = useRoute();
   const {goBack} = useNavigation();
   const {data, color, types} = params as RouteParamsProps;

   const [stats, setStats] = useState<StatsProps[]>([]);
   const [measure, setMeasure] = useState<MeasuresProps>({} as MeasuresProps);
   const [description, setDescription] = useState<string>('');
   const [eggProps, setEggProps] = useState<EggProps>({} as EggProps);
   const [evolutionChain, setEvolutionChain] = useState<string>('');
   const [moves, setMoves] = useState<MoveProps[]>([]);

   useEffect(() => {
      async function loadData(): Promise<void> {
         const response = await api.get(`/pokemon/${data.id}`);
         setStats(response.data.stats);

         const {weight, height} = response.data;
         setMeasure({height, weight});

         const formattedMoves = response.data.moves.map(
            ({move, version_group_details}) => {
               return {
                  name: move.name
                     .replace(/^./, move.name[0].toUpperCase())
                     .replace('-', ' '),
                  learned_at: version_group_details[0].level_learned_at,
                  learn_method: version_group_details[0].move_learn_method.name.replace(
                     /^./,
                     version_group_details[0].move_learn_method.name[0].toUpperCase(),
                  ),
               };
            },
         );

         setMoves(formattedMoves);
      }

      loadData();
   }, [data.id]);

   useEffect(() => {
      async function loadSpecieData(): Promise<void> {
         const response = await api.get(`pokemon-species/${data.id}`);

         setEvolutionChain(response.data.evolution_chain.url);

         const englishDescription = response.data.flavor_text_entries.find(
            (i) => i.language.name === 'en',
         );

         const {flavor_text} = englishDescription;
         setDescription(
            flavor_text
               .replace(/\n/g, ' ')
               .replace('\u000c', ' ')
               .replace('é', 'E'),
         );

         const group = response.data.egg_groups[0].name;
         const cycle = response.data.egg_groups[1].name;
         setEggProps({
            group: group.replace(/^./, group[0].toUpperCase()),
            cycle: cycle.replace(/^./, cycle[0].toUpperCase()),
         });
      }

      loadSpecieData();
   }, [data.id]);

   return (
      <Container color={color}>
         <PokemonHeader
            source={require('../../assets/images/Element.png')}
            color={color}
            imageStyle={{
               opacity: 0.6,
               right: 40,
               top: 0,
               marginRight: 20,
            }}>
            <TouchableOpacity activeOpacity={0.8} onPress={() => goBack()}>
               <Icon size={24} color="#fff" name="arrow-left" />
            </TouchableOpacity>
            <PokemonGrid>
               <View>
                  <SharedElement id={`pokemon-title-${data.id}`}>
                     <Name>
                        {data.name.replace(/^./, data.name[0].toUpperCase())}
                     </Name>
                  </SharedElement>
                  <View style={{flexDirection: 'row'}}>
                     {types.map((t) => (
                        <TypeContainer key={t.name}>
                           <TypeText>{t.name}</TypeText>
                        </TypeContainer>
                     ))}
                  </View>
               </View>
               <SharedElement id={`pokemon-id-${data.id}`}>
                  <Id>#{data.id.toString().padStart(3, '0')}</Id>
               </SharedElement>
            </PokemonGrid>
         </PokemonHeader>
         <PokemonInfo>
            <PokemonPicture>
               <SharedElement id={`pokemon-photo-${data.id}`}>
                  <Image
                     style={{
                        height: 224,
                        width: 224,
                        marginTop: -248,
                     }}
                     source={{
                        uri: `https://pokeres.bastionbot.org/images/pokemon/${data.id}.png`,
                     }}
                  />
               </SharedElement>
            </PokemonPicture>
            <Tabs
               style={{marginTop: -20}}
               tabBarUnderlineStyle={{
                  backgroundColor: color,
                  borderRadius: 200,
               }}
               tabContainerStyle={{
                  elevation: 0,
                  height: 50,
               }}>
               <Tab
                  tabStyle={{
                     backgroundColor: '#fff',
                     borderColor: '#F4F5F4',
                     borderBottomWidth: 1,
                     borderTopWidth: 0,
                  }}
                  activeTabStyle={{
                     backgroundColor: '#fff',
                  }}
                  activeTextStyle={{
                     fontFamily: 'CircularStd-Book',
                     color: '#303943',
                  }}
                  textStyle={{
                     color: 'rgba(48,57,67, 0.4)',
                     fontFamily: 'CircularStd-Book',
                  }}
                  heading="About">
                  <About
                     color={color}
                     description={description}
                     measure={measure}
                     eggProps={eggProps}
                  />
               </Tab>
               <Tab
                  tabStyle={{
                     backgroundColor: '#fff',
                     borderColor: '#F4F5F4',
                     borderBottomWidth: 1,
                  }}
                  activeTabStyle={{
                     backgroundColor: '#fff',
                  }}
                  activeTextStyle={{
                     fontFamily: 'CircularStd-Book',
                     color: '#303943',
                  }}
                  textStyle={{
                     color: 'rgba(48,57,67, 0.4)',
                     fontFamily: 'CircularStd-Book',
                  }}
                  heading="Stats">
                  <BaseStats color={color} stats={stats} />
               </Tab>
               <Tab
                  tabStyle={{
                     backgroundColor: '#fff',
                     borderColor: '#F4F5F4',
                     borderBottomWidth: 1,
                  }}
                  activeTabStyle={{
                     backgroundColor: '#fff',
                  }}
                  activeTextStyle={{
                     fontFamily: 'CircularStd-Book',
                     color: '#303943',
                  }}
                  textStyle={{
                     color: 'rgba(48,57,67, 0.4)',
                     fontFamily: 'CircularStd-Book',
                  }}
                  heading="Evolution">
                  <Evolution evolutionChain={evolutionChain} color={color} />
               </Tab>
               <Tab
                  tabStyle={{
                     backgroundColor: '#fff',
                     borderColor: '#F4F5F4',
                     borderBottomWidth: 1,
                  }}
                  activeTabStyle={{
                     backgroundColor: '#fff',
                  }}
                  activeTextStyle={{
                     fontFamily: 'CircularStd-Book',
                     color: '#303943',
                  }}
                  textStyle={{
                     color: 'rgba(48,57,67, 0.4)',
                     fontFamily: 'CircularStd-Book',
                  }}
                  heading="Moves">
                  <Moves moves={moves} color={color} />
               </Tab>
            </Tabs>
         </PokemonInfo>
      </Container>
   );
};

export default Detail;
