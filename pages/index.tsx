import React from 'react';
import { Avatar, Box, Button, Center, Flex, Spacer, Text, VStack } from '@chakra-ui/react';
import { PrismaClient, Users } from '@prisma/client';
import NextLink from 'next/link';
import Image from 'next/image';

const prisma = new PrismaClient();

export async function getServerSideProps() {
  const allUsers: Users[] = await prisma.users.findMany();
  const users = [];

  allUsers.forEach((value, index) => {
    let newValue: {
      id: number;
      first_name: string;
      last_name: string;
      email: string;
      identity: string;
      birthday: string;
      avatar: string;
    } = { id: -1, first_name: "", last_name: "", email: "", identity: "", birthday: "", avatar: "" };

    newValue.id = value.id;
    newValue.first_name = value.first_name;
    newValue.last_name = value.last_name;
    newValue.email = value.email;
    newValue.identity = value.identity;
    newValue.birthday = value.birthday.toLocaleDateString('hn')
    newValue.avatar = value.avatar;

    users.push(newValue);
  })

  return {
    props: {
      initialUsers: users
    }
  }
}

const Home = ({ initialUsers }) => {

  return (
    <Box
      h="100%"
      w="100%"
      bgGradient="linear(to-r, gray.700, purple.900)"
    >
      <Center flexDir="column">
        <Text as="h1" fontSize="6xl" textColor="white">Usuarios Registrados</Text>
        <Button colorScheme="green">
          <NextLink href="/user/form">
            Nuevo Usuario
          </NextLink>
        </Button>
      </Center>
      <Flex flexDir="column">
        {initialUsers.map((value: Users, index) => (
          <Flex key={index} bg="white" p="5" m="5" shadow="md" borderBottom="1px" borderColor="gray.200" rounded="md">
            <Avatar size="xl" src={value.avatar} />
            <Spacer />
            <Text>Nombre: {value.first_name} {value.last_name}</Text>
            <Spacer />
            <Text>Correo: {value.email}</Text>
            <Spacer />
            <Text>Fecha de Nacimiento: {value.birthday}</Text>
            <Spacer />
            <Text>Identidad: {value.identity}</Text>
          </Flex>
        ))}
      </Flex>
    </Box>
  )
}

export default Home;
