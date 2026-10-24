import LetterPage from "../../components/LetterPage";
export default function ThankingLetter() {
  return (
    <LetterPage
      title="Thanking Letter"
      storageKey="sms:letter:thanking"
      defaultTo="Mr. / Mrs. ____________"
      defaultSubject="Letter of Appreciation"
      defaultBody={`Dear Sir / Madam,

On behalf of the entire management of ${""}our institution, I would like to extend my sincere thanks for your valuable contribution and support towards our school's recent event.

Your presence and generosity meant a great deal to our students and staff, and we look forward to your continued association in the future.

With warm regards.`}
    />
  );
}
