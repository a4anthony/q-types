const getTest = () => {
  return {
    pause_enabled: true,
  };
};
const getSection = () => {
  return {
    id: 134,
  };
};

const getQuestion = () => {
  return {
    id: 14,
    time_limit_seconds: 30,
    hide_input: false,
  };
};

const data = {
  test: getTest(),
  question: getQuestion(),
  section: getSection(),
  questionHeaderArgs: {
    currentQuestion: getQuestion(),
    startTimer: false,
    pauseTimer: false,
    stopTimer: false,
    view: "question",
    totalQuestion: 30,
    withTimer: true,
    loading: false,
    currentSkill: "Listening",
    currentQuestionCount: 4,
  },
  questionActionArgs: {
    currentQuestion: getQuestion(),
    test: getTest(),
    loading: false,
    currentTime: "00:00",
    answered: true,
  },
  radioOptions: [
    {
      id: 105,
      question_id: 27,
      content: "A",
    },
    {
      id: 106,
      question_id: 27,
      content: "B",
    },
    {
      id: 107,
      question_id: 27,
      content: "C",
    },
    {
      id: 108,
      question_id: 27,
      content: "D",
    },
  ],
  radioOptionsText: [
    { id: 2788, question_id: 797, content: "Getting home in time for dinner" },
    {
      id: 2789,
      question_id: 797,
      content: "Getting to Harrod's before it closes",
    },
    {
      id: 2790,
      question_id: 797,
      content: "Getting to a job interview too early",
    },
    {
      id: 2791,
      question_id: 797,
      content: "Getting to a business appointment.",
    },
  ],
  blankSpaceOptions: [
    { id: 549, question_id: 138, content: "blue" },
    {
      id: 550,
      question_id: 138,
      content: "green",
    },
    { id: 551, question_id: 138, content: "yellow" },
    { id: 552, question_id: 138, content: "purple" },
    { id: 552, question_id: 138, content: "brown" },
    { id: 552, question_id: 138, content: "orange" },
  ],
  passage: ` <p>
                    <span class="block">To: Lucia Giancarlo </span>
                    <span class="block"
                        >From: Ahmed Rashid, New Deal Software</span
                    >
                    <span class="block">Subject: Yesterday’s Meeting</span>
                </p>
                <br />
                <p>Dear Lucia,</p>
                <br />

                <p>
                    First of all, allow me to thank you for taking the time to
                    get together with us yesterday. Everyone on our team felt
                    that the meeting was very productive. We now have a better
                    understanding of your project’s needs and have started
                    looking at ways to adapt our software to meet your
                    requirements.
                </p>
                <br />

                <p>
                    While the basic function of the software is well suited to
                    the project overall, we will explore ways to adapt it to the
                    needs of the different departments at Oxford that will be
                    using it. This will incur some additional cost, as indicated
                    yesterday, and we will provide more details about that at
                    our next meeting after our engineers have assessed all the
                    changes that will need to be made.
                </p>
                <br />

                <p>
                    I’ve asked Esteban Vaughn to prepare a document for you that
                    indicates when the Training and Consulting Department could
                    start providing services to you. He will send this
                    information to you directly. As you’ve worked together in
                    the past, this seems the most efficient way to go.
                </p>
                <br />

                <p>
                    As agreed, we should set up a meeting for the week of 22
                    October, by which time our engineers will be able to outline
                    their approaches to your departmental needs and we’ll have
                    the information we need to put together a contract. In the
                    meantime, please don’t hesitate to contact me if you have
                    any questions.
                </p>
                <br />

                <p>
                    <span class="block">Kind regards,</span>
                    <span class="block">Ahmed</span>
                </p>`,
};

export default data;
