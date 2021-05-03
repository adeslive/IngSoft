import { Avatar, Box, Center, Flex, FormControl, FormErrorMessage, FormLabel, Input } from '@chakra-ui/react';
import { useField } from 'formik';
import React from 'react';

type InputFieldProps = React.InputHTMLAttributes<HTMLInputElement> & {
    name: string;
};

const AvatarField: React.FC<InputFieldProps> = ({ size: _, onChange, ...props }) => {
    const [field, { error, }] = useField(props);
    const [image, setImage] = React.useState(null);


    return (
        <FormControl isInvalid={!!error}>
            <Center flexDir="column">
                <Avatar size="xl" src={image}/>
                <Input accept="image/*" {...field} mt="2" w="50%" type="file" onChange={onChange} />
                {error ? <FormErrorMessage>{error}</FormErrorMessage> : null}
            </Center>
        </FormControl>
    );
}

export default AvatarField;