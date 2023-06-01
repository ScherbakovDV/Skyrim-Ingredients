import { ChakraProvider } from '@chakra-ui/react';
import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
} from '@chakra-ui/react';
import * as React from 'react';
import './style.css';
import CreatableSelect from 'react-select/creatable';

const EMOJIES = {
  Magnitude: '🔥',
  Duration: '⌛',
  Value: '💰',
};

async function fetchJSON() {
  const response = await fetch(
    'https://api.github.com/gists/5fbb2ebfa1f13cc229b46ff7ec042e23'
  );

  const responseJson = await response.json();

  return {
    en: JSON.parse(responseJson.files['ingredients.json'].content),
    ru: JSON.parse(responseJson.files['ingredientsRu.json'].content),
  };
}

function transformData(data) {
  const ruIngridients = data.ru.reduce((accumulator, currentValue) => {
    accumulator[currentValue.id?.toUpperCase()] = currentValue;

    return accumulator;
  }, {});

  console.log(ruIngridients);

  return data.en.map(({ id: uid, effects, enName, ...ing }) => {
    const id = `${uid.toUpperCase()}\n`;
    return {
      ...ing,
      id,
      name: {
        ru: ruIngridients[id]?.ruName,
        en: enName,
      },
      effects: [
        {
          isPositive: effects[0].isPositive,
          sideEffects: effects[0].sideEffects.map((i) => ({
            ...i,
            value: Number.parseFloat(i.value),
          })),
          name: {
            ru: ruIngridients[id]?.effects[0],
            en: effects[0].name,
          },
        },
        {
          isPositive: effects[1].isPositive,
          sideEffects: effects[1].sideEffects.map((i) => ({
            ...i,
            value: Number.parseFloat(i.value),
          })),
          name: {
            ru: ruIngridients[id]?.effects[1],
            en: effects[1].name,
          },
        },
        {
          isPositive: effects[2].isPositive,
          sideEffects: effects[2].sideEffects.map((i) => ({
            ...i,
            value: Number.parseFloat(i.value),
          })),
          name: {
            ru: ruIngridients[id]?.effects[2],
            en: effects[2].name,
          },
        },
        {
          isPositive: effects[3].isPositive,
          sideEffects: effects[3].sideEffects.map((i) => ({
            ...i,
            value: Number.parseFloat(i.value),
          })),
          name: {
            ru: ruIngridients[id]?.effects[3],
            en: effects[3].name,
          },
        },
      ],
    };
  });
}

function hasEqualEffects(i1, i2) {
  for (let e1 of i1.effects) {
    if (
      i2.effects.find(
        (e2) => e1.name.ru === e2.name.ru || e1.name.en === e2.name.en
      )
    ) {
      return true;
    }
  }

  return false;
}

export default function App(props) {
  const [data, setData] = React.useState([]);
  const [selectedItemId, setSelectedItemId] = React.useState(null);
  const [filteredData, setFilteredData] = React.useState([]);

  React.useEffect(() => {
    (async () => {
      setData(transformData(await fetchJSON()));
    })();
  }, [setData]);

  React.useEffect(() => {
    if (!selectedItemId) {
      setFilteredData(data);
    } else {
      const selectedItem = data.find((i) => i.id === selectedItemId);
      setFilteredData(data.filter((i) => hasEqualEffects(i, selectedItem)));
    }
  }, [setFilteredData, selectedItemId, data]);

  return (
    <ChakraProvider>
      <CreatableSelect
        options={data.map((item) => ({
          label: item.name.ru || item.name.en,
          value: item.id,
        }))}
        onChange={({ value }) => setSelectedItemId(value)}
      />
      <TableContainer>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Nave</Th>
              <Th>Effect 1</Th>
              <Th>Effect 2</Th>
              <Th>Effect 3</Th>
              <Th>Effect 4</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filteredData.map((item) => (
              <Tr>
                <Td>{item.name.ru || item.name.en}</Td>
                {item.effects.map((effect) => (
                  <Td
                    style={{
                      backgroundColor: effect.isPositive
                        ? '#e6fffa'
                        : '#fed7d7',
                    }}
                  >
                    <div>{effect.name.ru}</div>
                    <div>{effect.name.en}</div>
                    {effect.sideEffects.map((sideEffect) => (
                      <div
                        style={{
                          backgroundColor:
                            sideEffect.value > 1 ? '#319795' : '#e53e3e',
                        }}
                      >
                        {EMOJIES[sideEffect.type]} - {sideEffect.value}
                      </div>
                    ))}
                  </Td>
                ))}
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </ChakraProvider>
  );
}
