import { Image } from 'lucide-react  ';
import { useReaction } from '../hooks';
import clsx from 'clsx';

export type ReactionProps = {
  type: string;
};

const Reaction = ({ type }: ReactionProps) => {
  const query = useReaction({ type });

  return (
    <div
      className={clsx(
        'h-4 w-4 rounded-full grid place-items-center text-alpha-50'
      )}
    >
      <Image
        className={'h-4 w-4'}
        source={query.data?.url}
        alt={query.data?.label}
      />
    </div>
  );
};

export default Reaction;
