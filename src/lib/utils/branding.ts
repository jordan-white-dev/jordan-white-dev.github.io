// #region Branding Definitions
declare const __brand: unique symbol;
/**
 * Defines a brand type with a specific brand name.
 * @template BrandName - The brand name to apply.
 */
type Brand<BrandName extends string> = { [__brand]: BrandName };

// #region Branded Type
/**
 * Combines a `bigint`, `boolean`, `number`, or `string` type with a readonly
 * brand to create a branded type.
 * @template TypeToBrand -  The `bigint`, `boolean`, `number`, or `string` type.
 * @template BrandName - The brand name to apply.
 * @example
 * // Define a branded type for user IDs
 * type UserID = Branded<string, "UserID">;
 */
type Branded<
  TypeToBrand extends bigint | boolean | number | string,
  BrandName extends string,
> = TypeToBrand & Brand<BrandName>;
// #endregion

// #region branded Function
/**
 * Consumes a validation function and brand name and returns a tuple for
 * validating and branding `bigint`, `boolean`, `number`, or `string` types.
 * @param validationFunction - A function to check if inputs pass validation.
 * @param _brandName - The brand name to apply to validated inputs.
 * @returns A tuple containing both a validator and a branded type object.
 * @example
 * // Define the validation function, brand name, and validated type
 * const [isEmailAddressValidator, BrandedEmailAddress] = branded((input: string) => {
 *   return input.includes("@");
 * }, "EmailAddress");
 * const isEmailAddress = isEmailAddressValidator;
 * type EmailAddress = typeof BrandedEmailAddress;
 *
 * // Example function requiring a valid email address
 * const sendEmail = (input: EmailAddress) => {
 *   //
 * }
 *
 * // Use the validation function against the unvalidated `emailAddress`
 * // If `emailAddress` passes validation, it's branded with `EmailAddress`,
 * // allowing it to be used in `sendEmail`
 * const unvalidatedEmailAddress = "mail@email.com";
 * if (isEmailAddress(unvalidatedEmailAddress)) {
 *   const validatedEmailAddress: EmailAddress = emailAddress;
 *   sendEmail(validatedEmailAddress);
 * }
 *
 * // Attempting to directly assign the EmailAddress type to an
 * // unvalidated email address causes a Typescript error, ensuring type
 * // safety
 * const invalidEmailAddress: EmailAddress = email;
 */
export const branded = <
  TypeToBrand extends bigint | boolean | number | string,
  BrandName extends string,
>(
  validationFunction: (input: TypeToBrand) => boolean,
  _brandName: BrandName,
): [
  (input: TypeToBrand) => input is Branded<TypeToBrand, BrandName>,
  Branded<TypeToBrand, BrandName>,
] => {
  const isBrandValidator = (
    input: TypeToBrand,
  ): input is Branded<TypeToBrand, BrandName> => validationFunction(input);

  return [isBrandValidator, {} as Branded<TypeToBrand, BrandName>];
};
// #endregion

// #endregion
