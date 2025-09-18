import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import SubjectHoursRow from "./SubjectHoursRow";
import {
  addSubject,
  removeSubject,
  updateSubjectMinutes,
} from "../store/studyslice";

function SubjectsList() {
  const dispatch = useDispatch();
  const { subjects } = useSelector((state) => state.study);

  const [newSubject, setNewSubject] = useState("");
  const [newMinutes, setNewMinutes] = useState(60); // default 1h

  const handleAddSubject = () => {
    if (!newSubject.trim()) return;
    dispatch(addSubject({ name: newSubject.trim(), minutes: newMinutes }));
    setNewSubject("");
    setNewMinutes(60);
  };

  return (
    <div className="subjects-list">
      {subjects.map((subj, i) => (
        <SubjectHoursRow
          key={subj.name}
          subject={subj.name}
          initial={subj.minutes}
          min={0}
          max={720}
          step={1}
          onChange={(val) =>
            dispatch(updateSubjectMinutes({ index: i, minutes: val }))
          }
          onRemove={() => dispatch(removeSubject(subj.name))}
        />
      ))}

      {/* Input to add new subjects */}
      <div className="add-subject">
        <input
          type="text"
          placeholder="Enter new subject"
          value={newSubject}
          onChange={(e) => setNewSubject(e.target.value)}
        />
        <input
          type="number"
          placeholder="Minutes"
          value={newMinutes}
          min={1}
          max={720}
          onChange={(e) => setNewMinutes(Number(e.target.value))}
        />
        <button onClick={handleAddSubject}>Add Subject</button>
      </div>
    </div>
  );
}

export default SubjectsList;
