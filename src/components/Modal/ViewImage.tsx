import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalFooter,
  ModalBody,
  Image,
  Link,
  Box,
} from '@chakra-ui/react';

interface ModalViewImageProps {
  isOpen: boolean;
  onClose: () => void;
  imgUrl: string;
}

export function ModalViewImage({
  isOpen,
  onClose,
  imgUrl,
}: ModalViewImageProps): JSX.Element {
  return (
    // TODO fix width
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent background="pGray.800">
        <ModalBody>
          <Box>
            <Image
              src={imgUrl}
              alt="selected image"
              maxWidth="900px"
              maxHeight="600px"
              objectFit="contain"
            />
          </Box>
        </ModalBody>
        <ModalFooter>
          <Link href={imgUrl} target="_blank" marginRight="auto">
            Abrir original
          </Link>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
