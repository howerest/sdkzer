import { EmailValidator } from "../../src/validation_rules/email_validator"

describe("EmailValidator", () => {
  const invalidEmails = [undefined, "", "invalidemail", "in@valid", "in@valid..email"];
  const validEmails = ["valid@email.com"];
  const emailValidator = new EmailValidator();

  invalidEmails.map((invalidEmail) => {
    it(`it should be INVALID with '${invalidEmail}'`, () => {
      expect(emailValidator.isValid(null, invalidEmail)).toEqual(false);
      expect(emailValidator['_invalidMessage']).toEqual(`${invalidEmail} is not a valid email address`);
    });
  });

  validEmails.map((validEmail) => {
    it(`it should be VALID with '${validEmail}'`, () => {
      expect(emailValidator.isValid(null, validEmail)).toEqual(true);
      expect(emailValidator['_invalidMessage']).toEqual('');
    });
  });
});
