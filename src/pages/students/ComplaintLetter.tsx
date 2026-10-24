import LetterPage from "../../components/LetterPage";
export default function ComplaintLetter() {
  return (
    <LetterPage
      title="Student Complaint Letter"
      storageKey="sms:letter:complaint"
      defaultTo="Guardian of [Student Name]"
      defaultSubject="Complaint Regarding Student's Behaviour / Attendance"
      defaultBody={`Dear Guardian,

It has been reported that your child has not been maintaining the discipline expected of our students. Repeated instances of indiscipline / absence have been observed in recent days.

You are hereby requested to visit the school at your earliest convenience and ensure that this behaviour is corrected forthwith.

Thank you for your cooperation.`}
    />
  );
}
