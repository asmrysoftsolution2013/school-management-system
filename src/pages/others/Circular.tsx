import LetterPage from "../../components/LetterPage";
export default function Circular() {
  return (
    <LetterPage
      title="Circular Letter"
      storageKey="sms:letter:circular"
      defaultTo="All Parents / Guardians"
      defaultSubject="Important School Notice"
      defaultBody={`Dear Parents / Guardians,

This is to inform you that the school will remain closed on ____ in observance of ____.

Classes shall resume as per the regular schedule the following working day.

Kindly take note and plan accordingly.

Thank you for your cooperation.`}
    />
  );
}
