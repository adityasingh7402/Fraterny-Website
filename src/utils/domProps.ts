
/**
 * Utility to properly convert React props to DOM attributes
 * This helps ensure that React props are properly translated to valid DOM attributes
 */

type ReactPropsToDOMProps = {
  fetchPriority?: 'high' | 'low' | 'auto';
  [key: string]: any;
};

/**
 * Converts React-specific props to proper DOM attribute format
 * @param reactProps Object containing React props
 * @returns Object with properly formatted DOM attributes
 */
export const toDOMProps = (reactProps: ReactPropsToDOMProps): Record<string, any> => {
  const result: Record<string, any> = {};
  
  // Handle special case mappings explicitly
  if (reactProps.fetchPriority) {
    result.fetchpriority = reactProps.fetchPriority;
  }
  
  // Add more special cases here as needed
  // e.g., if (reactProps.someReactProp) result.somedomattr = reactProps.someReactProp;
  
  return result;
};

/**
 * Removes props that should not be passed directly to DOM elements
 * @param props Object containing all props
 * @param propNames Array of prop names to remove
 * @returns Filtered props object
 */
export const omitProps = <T extends Record<string, any>>(
  props: T, 
  propNames: string[]
): Partial<T> => {
  const result = { ...props };
  
  propNames.forEach(prop => {
    delete result[prop];
  });
  
  return result;
};

/**
 * Debug-only function to log DOM property warnings
 * @param component Component name
 * @param props Props that were passed
 */
export const debugProps = (component: string, props: Record<string, any>): void => {
  if (process.env.NODE_ENV !== 'development') return;
  
  const domProps = ['fetchPriority', 'crossOrigin', 'autoPlay'];
  const issues = domProps.filter(prop => prop in props);
  
  if (issues.length > 0) {
    console.warn(
      `[DOM Props] ${component} received potentially problematic DOM props: ${issues.join(', ')}. ` +
      `Consider using toDOMProps() utility to convert them to valid DOM attributes.`
    );
  }
};
