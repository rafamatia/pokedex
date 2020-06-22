import React from 'react';

import {useRoute, useNavigation} from '@react-navigation/native';
import {Image, View, TouchableOpacity} from 'react-native';
import {SharedElement} from 'react-navigation-shared-element';
import Icon from 'react-native-vector-icons/Feather';

import {
   Container,
   PokemonInfo,
   Name,
   TypeContainer,
   TypeText,
   Id,
   PokemonGrid,
   PokemonPicture,
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

const Detail: React.FC = () => {
   const {params} = useRoute();
   const {goBack} = useNavigation();

   const {data, color, types} = params as RouteParamsProps;

   return (
      <Container>
         <PokemonInfo
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
            <PokemonPicture>
               <SharedElement id={`pokemon-photo-${data.id}`}>
                  <Image
                     style={{
                        height: 224,
                        width: 224,
                        marginBottom: -32,
                     }}
                     source={{
                        uri: `https://pokeres.bastionbot.org/images/pokemon/${data.id}.png`,
                     }}
                  />
               </SharedElement>
            </PokemonPicture>
         </PokemonInfo>
      </Container>
   );
};

export default Detail;
