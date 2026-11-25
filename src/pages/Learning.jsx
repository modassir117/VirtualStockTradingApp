const lessons = [
  {
    title: "What is the Stock Market?",
    description: "Learn how companies sell shares and how investors participate."
  },
  {
    title: "What is NSE and BSE?",
    description: "Understand India's two major stock exchanges."
  },
  {
    title: "What is a Portfolio?",
    description: "Learn how to manage different investments."
  },
  {
    title: "What is Profit and Loss?",
    description: "Understand how stock prices affect your investment."
  },
  {
    title: "What is a Bull Market?",
    description: "Learn about rising prices and positive market trends."
  },
  {
    title: "What is a Bear Market?",
    description: "Understand falling prices and negative market trends."
  }
];

export default function Learning() {
  return (
    <div>
      <h1>Learning Center</h1>
      <p>Learn stock market basics with TradeSim Pro.</p>

      <div className="grid">
        {lessons.map((lesson, index) => (
          <div className="card" key={index}>
            <h3>{lesson.title}</h3>
            <p>{lesson.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}