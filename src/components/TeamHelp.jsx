import { useState } from "react";

const team = [
  {
    name: "Medha Panda",
    id: "2500031857",
    role: "Team Lead"
  },
  {
    name: "Potala Bhoopathi Raju Reddy",
    id: "2500032394",
    role: "Team Member"
  },
  {
    name: "Modassir Alam",
    id: "2500032667",
    role: "Team Member"
  }
];

export default function TeamHelp() {
  const [show, setShow] = useState(false);

  return (
    <>
      <button
        className="sidebar-help-button"
        onClick={() => setShow(true)}
      >
        Customer Support
      </button>

      {show && (
        <div className="help-overlay">
          <div className="help-box">
            <button
              className="close-help"
              onClick={() => setShow(false)}
            >
              ✕
            </button>

            <h2>Customer Support</h2>
            <p>Contact our project team for help with TradeSim Pro.</p>

            {team.map(member => (
              <div className="team-member" key={member.id}>
                <h3>{member.name}</h3>
                <p>{member.role}</p>
                <small>Student ID: {member.id}</small>
              </div>
            ))}

            <button onClick={() => setShow(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}