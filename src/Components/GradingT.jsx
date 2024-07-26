import React from 'react';

const Grading = () => {
  const sections = [
    {
      title: "Lesson Preparation (20 marks)",
      items: [
        "Schemes of work", "Record of work", "Lesson plan", "Lesson objectives",
        "Lesson sequencing", "Learning Activities", "Learning Resources",
        "Student Progress record", "Self evaluation", "T.P. file organization"
      ],
      maxMarks: 2
    },
    {
      title: "Lesson Introduction (10 marks)",
      items: [
        "Arousing learners interest", "Connection with learners",
        "Statement of topic", "Set induction", "Articulate lessons objectives"
      ],
      maxMarks: 2
    },
    {
      title: "Teaching Strategy (24 marks)",
      items: [
        "Selection of content", "Sequencing of activities", "Use of reinforcement",
        "Mastery of content", "Class management", "Appropriateness of language use"
      ],
      maxMarks: 4
    },
    {
      title: "Instructional Procedure (16 marks)",
      items: [
        "Appropriateness of methods used", "Learners Involvement",
        "Formative checks", "Pace of delivery"
      ],
      maxMarks: 4
    },
    {
      title: "Teaching/Learning Resources (10 marks)",
      items: [
        "Creativity in choice of resources", "Effective use of resources",
        "Presentation", "Relevance of resources", "Chalk wall use and organization"
      ],
      maxMarks: 2
    },
    {
      title: "Lesson Conclusion (10 marks)",
      items: [
        "Lesson review", "Assignments", "Appropriateness in lesson choice",
        "Achievement of Objectives", "Creativeness in presentation"
      ],
      maxMarks: 2
    },
    {
      title: "Personality (10 marks)",
      items: [
        "Command of Language", "Confidence", "Attitude contact",
        "Attire", "Connection with student"
      ],
      maxMarks: 2
    }
  ];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Student Grading Instructions</h1>
      {sections.map((section, index) => (
        <div key={index} className="mb-6 bg-white shadow-md rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-2">{section.title}</h2>
          <ul className="list-disc pl-5">
            {section.items.map((item, itemIndex) => (
              <li key={itemIndex} className="mb-1">
                {item} (Max {section.maxMarks} marks)
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default Grading;