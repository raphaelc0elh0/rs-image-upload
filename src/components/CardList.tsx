import { SimpleGrid, useDisclosure } from '@chakra-ui/react';
import { useState } from 'react';
import { Card } from './Card';
import { ModalViewImage } from './Modal/ViewImage';

interface Card {
  title: string;
  description: string;
  url: string;
  ts: number;
  id: string;
}

interface CardsProps {
  cards: Card[];
}

export function CardList({ cards }: CardsProps): JSX.Element {
  const modal = useDisclosure();

  const [imageUrl, setImageUrl] = useState(null);

  const handleViewImage = (url: string): void => {
    setImageUrl(url);
    modal.onOpen();
  };

  const handleCloseModal = (): void => {
    modal.onClose();
    setImageUrl('');
  };

  return (
    <>
      <SimpleGrid columns={3} spacing="40px">
        {cards.map(card => (
          <Card key={card.id} data={card} viewImage={handleViewImage} />
        ))}
      </SimpleGrid>
      {imageUrl && (
        <ModalViewImage
          isOpen={modal.isOpen}
          onClose={handleCloseModal}
          imgUrl={imageUrl}
        />
      )}
    </>
  );
}
