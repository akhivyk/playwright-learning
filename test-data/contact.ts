export type ContactDetails = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export const validContact: ContactDetails = {
  name: "John Tester",
  email: "john.tester@example.com",
  subject: "QA feedback",
  message: "Test submission",
};

export const attachmentPath = "tests/fixtures/sample.txt";
