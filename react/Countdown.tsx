import React, { useState } from 'react';
import { useQuery } from 'react-apollo';
import { useCssHandles } from 'vtex.css-handles';
import useProduct from 'vtex.product-context/useProduct';
import { TimeSplit } from './typings/global';
import { tick } from './utils/time';
import productReleaseDate from './queries/productReleaseDate.graphql';

interface CountdownProps {
  targetDate: string;
};

const DEFAULT_TARGET_DATE = (new Date('2020-12-01')).toISOString();
const CSS_HANDLES = ['countdown'];

const Countdown: StorefrontFunctionComponent<CountdownProps> = ({ targetDate = DEFAULT_TARGET_DATE }) => {
  const { product: { linkText } } = useProduct();
  const { data, loading, error } = useQuery(productReleaseDate, {
    variables: {
      slug: linkText
    },
    ssr: false
  });

  const [timeRemaining, setTimeRemaining] = useState<TimeSplit>({
    hours: '00',
    minutes: '00',
    seconds: '00'
  });

  const handles = useCssHandles(CSS_HANDLES);

  tick(data?.product?.releaseDate || targetDate, setTimeRemaining);

  if (loading) {
    return (
      <div>
        <span>Loading...</span>
      </div>
    )
  };

  if (error) {
    return (
      <div>
        <span>Erro!</span>
      </div>
    )
  };

  return (
    <div className={`${handles.countdown} t-heading-2 w3 w-100 c-muted-1 db tc`}>
      {`${timeRemaining.hours}:${timeRemaining.minutes}:${timeRemaining.seconds}`}
    </div>
  );
};

Countdown.schema = {
  title: 'editor.countdown.title',
  description: 'editor.countdown.description',
  type: 'object',
  properties: {
    targetDate: {
      title: 'Data final',
      description: 'Data final utilizada no contador',
      type: 'string',
      default: null,
    }
  },
};

export default Countdown;
