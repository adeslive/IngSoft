import React from 'react';
import { Form, Formik, Field } from 'formik';
import * as Yup from 'yup';
import InputField from '../../components/InputField';
import { Alert, AlertDescription, AlertIcon, AlertTitle, Avatar, Box, Button, Center, CloseButton, Flex, Input, Spacer } from '@chakra-ui/react';
import { useRouter } from 'next/router'
import moment from 'moment';

type UserFormProps = {

};

interface UserFormValues {
    first_name: string;
    last_name: string;
    email: string;
    identity: string;
    avatar: File;
    birthday: string;
}

const UserFormSchema = Yup.object().shape({
    first_name: Yup.string()
        .min(2, "Nombre muy corto")
        .required("Requerido"),
    last_name: Yup.string()
        .min(2, "Nombre muy corto")
        .required("Requerido"),
    email: Yup.string()
        .email("Correo invalido")
        .required("El correo es requerido"),
    identity: Yup.string()
        .min(13, "La identidad es muy corta")
        .max(13, "La identidad es muy grande")
        .required("La identidad es requerida"),
    birthday: Yup.date()
        .default(() => (new Date()))
        .max(moment().subtract(18, 'years'), 'Debes de tener al menos 18 años')
        .required("Debes ingresar una fecha")
})

const UserForm: React.FC<UserFormProps> = () => {
    const router = useRouter();

    const [image, setImage] = React.useState(null);
    const [error, setError] = React.useState(null);

    const initialValues: UserFormValues = {
        first_name: '',
        last_name: '',
        email: '',
        identity: '',
        avatar: null,
        birthday: '',
    }

    return (
        <Box
            h="100%"
            w="100%"
            position="fixed"
            bgGradient="linear(to-r, gray.700, purple.900)"
        >
            {
                error &&
                <Alert status="error">
                    <AlertIcon />
                    <AlertTitle mr={2}>Error!</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                    <CloseButton onClick={() => setError(null)} position="absolute" right="8px" top="8px" />
                </Alert>
            }
            <Center>
                <Formik
                    initialValues={initialValues}
                    validationSchema={UserFormSchema}
                    onSubmit={async (values, actions) => {
                        setError(null);
                        let data = new FormData();

                        data.append('avatar', values.avatar);
                        data.append('first_name', values.first_name);
                        data.append('last_name', values.last_name);
                        data.append('email', values.email);
                        data.append('identity', values.identity);
                        data.append('birthday', values.birthday);

                        await fetch('/api/register', {
                            method: "POST",
                            headers: new Headers({ Accept: 'application/json' }),
                            body: data
                        })
                            .then((response) => response.json())
                            .then((data) => {

                                if(data.error){
                                    console.log(data.error)
                                    setError(data.error);
                                    return;
                                }

                                router.push('/')
                            })
                    }}
                >
                    {(formProps) => (
                        
                        <Box mx="auto" w="40%" my="10" bg="white" shadow="base" p="3" borderBottom="1px" borderColor="gray.100" rounded="md">
                            <Form>
                                <Box my="5">
                                    <Center flexDir="column">
                                        <Avatar size="xl" src={image} />
                                        <Input mt="4" w="80%" id="avatar" name="avatar" accept="image/*" type="file" onChange={(event) => {
                                            let reader = new FileReader();
                                            let file = event.target.files[0];

                                            reader.onloadend = () => {
                                                setImage(reader.result);
                                            }

                                            reader.readAsDataURL(file);
                                            formProps.setFieldValue('avatar', file);
                                        }}
                                        />
                                    </Center>
                                </Box>
                                <Flex>
                                    <Box >
                                        <InputField name="first_name" label="Primer Nombre" />
                                    </Box>
                                    <Spacer />
                                    <Box>
                                        <InputField name="last_name" label="Primer Apellido" />
                                    </Box>
                                </Flex>
                                <Box>
                                    <InputField name="email" type="email" label="Correo Eléctronico" />
                                </Box>
                                <Flex>
                                    <Box>
                                        <InputField name="identity" type="text" label="Identidad" />
                                    </Box>
                                    <Spacer />
                                    <Box>
                                        <InputField name="birthday" type="date" label="Fecha de nacimiento" />
                                    </Box>
                                </Flex>
                                <Button mt="4" w="full" colorScheme="purple" type="submit">Enviar</Button>
                            </Form>
                        </Box>
                    )}
                </Formik>
            </Center>
        </Box>
    );
}

export default UserForm;