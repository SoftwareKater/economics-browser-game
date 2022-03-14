import React, { useState } from 'react';
import {
  City,
  OfferType,
  useGetMyCityQuery,
  usePlaceOfferMutation,
  useProductsQuery,
} from '@economics1k/data-access';
import {
  Button,
  ComboBox,
  Content,
  Form,
  Item,
  NumberField,
  ProgressCircle,
  Slider,
  Switch,
  TextField,
} from '@adobe/react-spectrum';

export const PlaceOffer = () => {
  const productsResult = useProductsQuery();
  const [placeOfferMutation] = usePlaceOfferMutation();

  const [price, setPrice] = useState(1);
  const [quantity, setQuantity] = useState(1);
  const [validity, setValidity] = useState(1);
  const [offerType, setOfferType] = useState(false);
  const [productId, setProductId] = useState('');

  const productOptions = productsResult.data?.products;

  function handleSubmit() {
    placeOfferMutation({
      variables: {
        price,
        quantity,
        expirationDate: new Date(
          new Date().getTime() + validity * 24 * 60 * 60 * 1000
        ),
        offerType: offerType ? OfferType.Offer : OfferType.Bid,
        productId,
      },
    });
  }

  if (productsResult.loading) {
    return <ProgressCircle aria-label="Loading Products" isIndeterminate />;
  }

  if (productsResult.error) {
    return <p>Error :(</p>;
  }

  if (!productsResult.data) {
    return <p>Not Found :/</p>;
  }

  return (
    <Content>
      <Form maxWidth="size-3600" onSubmit={handleSubmit}>
        <ComboBox
          label="Product"
          isRequired
          defaultItems={productOptions}
          inputValue={productId}
          onInputChange={setProductId}
        >
          {(item) => <Item>{item.name}</Item>}
        </ComboBox>
        <NumberField
          label="Unit Price"
          isRequired
          formatOptions={{
            style: 'currency',
            currency: 'EUR',
            currencySign: 'accounting'
          }}
          defaultValue={1}
          minValue={0}
          onChange={(price) => setPrice(price)}
        />
        <NumberField
          label="Quantity"
          isRequired
          defaultValue={1}
          minValue={1}
          onChange={(quantity) => setQuantity(quantity)}
        />
        <Slider
          label="Validity (in days)"
          value={validity}
          onChange={setValidity}
        />
        <Switch onChange={setOfferType}>Choose Offer Type</Switch>
        <div>{offerType ? 'Offer' : 'Bid'}</div>
        <Button variant="cta" type="submit">
          Place Offer
        </Button>
      </Form>
    </Content>
  );
};

export default PlaceOffer;
