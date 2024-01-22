import { mutate } from 'swr';
import { cache } from 'swr/_internal';

const revalidatePath = (urlRegex: RegExp) => {
  const keysArray = Array.from(cache.keys());

  keysArray.forEach((key) => {
    if (urlRegex.test(key)) {
      mutate(key);
    }
  });
};
export default revalidatePath;
