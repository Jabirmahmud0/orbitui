/**
 * Compose multiple refs into a single ref callback.
 *
 * @template T
 * @param {...(import('react').Ref<T> | undefined | null)} refs
 * @returns {(node: T | null) => void}
 */
export function composeRefs(...refs) {
  return (node) => {
    refs.forEach((ref) => {
      if (!ref) {
        return;
      }

      if (typeof ref === 'function') {
        ref(node);
        return;
      }

      ref.current = node;
    });
  };
}

export default composeRefs;
