import { Box, Button, Stack, useToast } from '@chakra-ui/react';
import { useForm, RegisterOptions } from 'react-hook-form';
import { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';

import { api } from '../../services/api';
import { FileInput } from '../Input/FileInput';
import { TextInput } from '../Input/TextInput';

interface FormAddImageProps {
  closeModal: () => void;
}

interface FormInputData {
  title: string;
  description: string;
  image: File;
}

interface AddImageInputData {
  title: string;
  description: string;
  url: string;
}

export function FormAddImage({ closeModal }: FormAddImageProps): JSX.Element {
  const [imageUrl, setImageUrl] = useState('');
  const [localImageUrl, setLocalImageUrl] = useState('');
  const toast = useToast();

  const formValidations: {
    image: RegisterOptions;
    title: RegisterOptions;
    description: RegisterOptions;
  } = {
    image: {
      required: true,
      validate: {
        lessThan10MB: file => {
          return (
            file[0].size < 10 * 1048576 || 'O arquivo deve ser menor que 10MB'
          );
        },
        acceptedFormats: file => {
          const regexp = new RegExp('.(png|jpg|jpeg|gif)$');
          return (
            regexp.test(file[0].type) ||
            'Somente são aceitos arquivos PNG, JPEG e GIF'
          );
        },
      },
    },
    title: {
      required: true,
      minLength: 2,
      maxLength: 20,
    },
    description: {
      required: true,
      maxLength: 65,
    },
  };

  const queryClient = useQueryClient();
  const mutation = useMutation(
    async (data: AddImageInputData) => {
      await api.post('/api/images', data);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('images');
      },
    }
  );

  const { register, handleSubmit, reset, formState, setError, trigger } =
    useForm<Partial<FormInputData>>();
  const { errors } = formState;

  const onSubmit = async (data: FormInputData): Promise<void> => {
    try {
      if (!imageUrl) {
        toast({
          position: 'top-right',
          status: 'error',
          title: 'Imagem não adicionada',
          description:
            'É preciso adicionar e aguardar o upload de uma imagem antes de realizar o cadastro.',
          isClosable: true,
        });

        throw new Error();
      }

      await mutation.mutateAsync({
        title: data.title,
        description: data.description,
        url: imageUrl,
      });

      toast({
        position: 'top-right',
        status: 'success',
        title: 'Imagem cadastrada',
        description: 'Sua imagem foi cadastrada com sucesso.',
        isClosable: true,
      });
    } catch (error) {
      toast({
        position: 'top-right',
        status: 'error',
        title: 'Falha no cadastro',
        description: 'Ocorreu um erro ao tentar cadastrar a sua imagem.',
        isClosable: true,
      });
    } finally {
      reset();
      setImageUrl('');
      setLocalImageUrl('');
      closeModal();
    }
  };

  return (
    <Box as="form" width="100%" onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={4}>
        <FileInput
          setImageUrl={setImageUrl}
          localImageUrl={localImageUrl}
          setLocalImageUrl={setLocalImageUrl}
          setError={setError}
          trigger={trigger}
          // TODO SEND IMAGE ERRORS
          {...register('image', formValidations.image)}
        />

        <TextInput
          placeholder="Título da imagem..."
          error={errors.title}
          {...register('title', formValidations.title)}
        />

        <TextInput
          placeholder="Descrição da imagem..."
          error={errors.description}
          {...register('description', formValidations.description)}
        />
      </Stack>

      <Button
        my={6}
        isLoading={formState.isSubmitting}
        isDisabled={formState.isSubmitting}
        type="submit"
        w="100%"
        py={6}
      >
        Enviar
      </Button>
    </Box>
  );
}
