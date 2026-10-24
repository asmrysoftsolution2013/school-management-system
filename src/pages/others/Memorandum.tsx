import LetterPage from "../../components/LetterPage";
export default function Memorandum() {
  return (
    <LetterPage
      title="Memorandum"
      storageKey="sms:letter:memo"
      defaultTo="All Staff Members"
      defaultSubject="Internal Memorandum"
      defaultBody={`This memorandum is issued to all staff members regarding ____.

Please ensure strict compliance and inform the undersigned of any difficulty encountered in carrying out the above.`}
    />
  );
}
