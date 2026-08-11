import { useState } from "react";

import Sidebar from "../components/Sidebar";

function Learn() {
  const [selectedLesson, setSelectedLesson] = useState(null);

  // ======================================================
  // LESSON LIST
  // ======================================================

  const lessons = [
    {
      id: 1,
      title: "Stock Market Basics",
      icon: "📈",
      level: "Beginner",
      description:
        "Understand stocks, exchanges, indexes and how the stock market works.",
      topics: [
        "What is a stock?",
        "How stock exchanges work",
        "NSE, BSE and NASDAQ",
        "What are market indexes?",
        "Bull market vs Bear market",
      ],
    },
    {
      id: 2,
      title: "Investing Basics",
      icon: "💰",
      level: "Beginner",
      description:
        "Learn the fundamentals of investing and how to build wealth over time.",
      topics: [
        "Saving vs Investing",
        "Risk and return",
        "Diversification",
        "Long-term investing",
        "Compounding",
      ],
    },
    {
      id: 3,
      title: "Mutual Funds",
      icon: "🏦",
      level: "Beginner",
      description:
        "Learn how mutual funds work and how investors can use them.",
      topics: [
        "What is a mutual fund?",
        "Equity funds",
        "Debt funds",
        "SIP",
        "Expense ratio",
      ],
    },
    {
      id: 4,
      title: "IPO Basics",
      icon: "🚀",
      level: "Intermediate",
      description:
        "Understand IPOs, price bands, allotment and listing.",
      topics: [
        "What is an IPO?",
        "Why companies launch IPOs",
        "Price band",
        "IPO allotment",
        "Listing day",
      ],
    },
    {
      id: 5,
      title: "Personal Finance",
      icon: "💳",
      level: "Beginner",
      description:
        "Learn how to manage your income, expenses, savings and financial goals.",
      topics: [
        "Creating a budget",
        "Emergency funds",
        "Managing expenses",
        "Saving goals",
        "Good debt vs bad debt",
      ],
    },
    {
      id: 6,
      title: "Risk Management",
      icon: "🛡️",
      level: "Intermediate",
      description:
        "Understand investment risk and how to protect your portfolio.",
      topics: [
        "Types of investment risk",
        "Risk tolerance",
        "Portfolio diversification",
        "Asset allocation",
        "Managing losses",
      ],
    },
  ];

  // ======================================================
  // LESSON CONTENT
  // ======================================================

  const lessonContent = {
    1: {
      title: "Stock Market Basics",
      sections: [
        {
          heading: "What is a Stock?",
          content:
            "A stock represents a small ownership share in a company. When you buy shares of a company, you become a shareholder and your investment can increase or decrease depending on the company's performance and market conditions.",
        },
        {
          heading: "How Does the Stock Market Work?",
          content:
            "The stock market provides a marketplace where buyers and sellers trade shares. Prices change continuously based on supply, demand, company performance, economic conditions and investor sentiment.",
        },
        {
          heading: "What is an Index?",
          content:
            "A stock market index tracks a group of companies and provides an indication of how a particular segment of the market is performing. Examples include NIFTY 50 and SENSEX in India.",
        },
        {
          heading: "Bull Market vs Bear Market",
          content:
            "A bull market generally refers to a sustained period of rising prices and positive investor sentiment. A bear market refers to a sustained decline in prices and generally negative sentiment.",
        },
      ],
    },

    2: {
      title: "Investing Basics",
      sections: [
        {
          heading: "Saving vs Investing",
          content:
            "Saving usually means keeping money in relatively low-risk and easily accessible instruments. Investing involves putting money into assets such as stocks, bonds or mutual funds with the goal of generating returns over time.",
        },
        {
          heading: "Risk and Return",
          content:
            "Investment returns are generally associated with some level of risk. Higher potential returns often come with higher uncertainty. Understanding your risk tolerance is important before choosing investments.",
        },
        {
          heading: "Diversification",
          content:
            "Diversification means spreading investments across different assets or sectors instead of putting all your money into one investment. This can help reduce the impact of poor performance from a single investment.",
        },
        {
          heading: "Compounding",
          content:
            "Compounding occurs when returns generated by an investment are reinvested and themselves begin generating returns. Over long periods, compounding can significantly increase wealth.",
        },
      ],
    },

    3: {
      title: "Mutual Funds",
      sections: [
        {
          heading: "What is a Mutual Fund?",
          content:
            "A mutual fund collects money from multiple investors and invests that money in a portfolio of assets according to a particular investment strategy.",
        },
        {
          heading: "Equity Funds",
          content:
            "Equity mutual funds primarily invest in stocks. They can provide higher growth potential but also carry market-related risk.",
        },
        {
          heading: "Debt Funds",
          content:
            "Debt funds primarily invest in fixed-income instruments. They generally have different risk and return characteristics compared with equity funds.",
        },
        {
          heading: "What is SIP?",
          content:
            "A Systematic Investment Plan allows an investor to invest a fixed amount at regular intervals, such as monthly, into a mutual fund.",
        },
      ],
    },

    4: {
      title: "IPO Basics",
      sections: [
        {
          heading: "What is an IPO?",
          content:
            "An Initial Public Offering, or IPO, is when a private company offers its shares to the public for the first time and becomes publicly listed.",
        },
        {
          heading: "Why Do Companies Launch IPOs?",
          content:
            "Companies may launch IPOs to raise capital for expansion, repay debt, fund operations or provide existing shareholders an opportunity to sell shares.",
        },
        {
          heading: "Price Band",
          content:
            "During many IPOs, investors are given a price range within which they can submit bids. The final issue price is determined according to the IPO process.",
        },
        {
          heading: "Listing Day",
          content:
            "After the IPO process and allotment, the company's shares begin trading on the stock exchange. The market price can move above or below the issue price.",
        },
      ],
    },

    5: {
      title: "Personal Finance",
      sections: [
        {
          heading: "Create a Budget",
          content:
            "A budget helps you understand where your money comes from and where it goes. Tracking expenses can help identify unnecessary spending and improve financial planning.",
        },
        {
          heading: "Emergency Fund",
          content:
            "An emergency fund is money kept aside for unexpected expenses such as emergencies, repairs or temporary loss of income.",
        },
        {
          heading: "Managing Expenses",
          content:
            "Categorizing expenses into needs, wants and savings can make it easier to understand spending patterns and prioritize financial goals.",
        },
        {
          heading: "Financial Goals",
          content:
            "Financial goals can include building savings, paying off debt, investing for long-term objectives or preparing for major future expenses.",
        },
      ],
    },

    6: {
      title: "Risk Management",
      sections: [
        {
          heading: "Investment Risk",
          content:
            "Investment risk is the possibility that an investment may produce lower-than-expected returns or lose value.",
        },
        {
          heading: "Risk Tolerance",
          content:
            "Risk tolerance describes how much uncertainty or potential loss an investor is comfortable accepting while pursuing financial goals.",
        },
        {
          heading: "Asset Allocation",
          content:
            "Asset allocation means deciding how much of a portfolio should be invested in different asset classes such as stocks, bonds and cash.",
        },
        {
          heading: "Diversification",
          content:
            "Diversifying across companies, sectors and asset classes can reduce concentration risk and help create a more balanced portfolio.",
        },
      ],
    },
  };

  // ======================================================
  // SELECT LESSON
  // ======================================================

  const openLesson = (lessonId) => {
    setSelectedLesson(lessonId);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ======================================================
  // BACK TO LESSONS
  // ======================================================

  const backToLessons = () => {
    setSelectedLesson(null);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ======================================================
  // LESSON VIEW
  // ======================================================

  if (selectedLesson) {
    const lesson = lessonContent[selectedLesson];

    return (
      <div className="flex min-h-screen bg-slate-950 text-white">

        {/* SIDEBAR */}

        <Sidebar />

        {/* MAIN CONTENT */}

        <main className="flex-1 min-w-0 overflow-y-auto">

          <div className="max-w-[1400px] mx-auto px-5 py-7 md:px-8 lg:px-10">

            {/* BACK BUTTON */}

            <button
              onClick={backToLessons}
              className="
                inline-flex
                items-center
                gap-2
                text-blue-400
                hover:text-blue-300
                font-semibold
                text-sm
                transition
                mb-7
              "
            >
              ← Back to Learn
            </button>

            {/* LESSON HEADER */}

            <section
              className="
                bg-slate-900
                border
                border-slate-800
                rounded-2xl
                p-6
                md:p-8
                mb-7
              "
            >

              <div className="flex items-center gap-2 mb-3">

                <span className="w-2 h-2 rounded-full bg-blue-400" />

                <span className="text-xs font-semibold uppercase tracking-wider text-blue-400">
                  Financial Education
                </span>

              </div>

              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                {lesson.title}
              </h1>

              <p className="text-slate-400 mt-3 max-w-3xl leading-7">
                Learn the fundamentals and strengthen your financial
                knowledge through this lesson.
              </p>

            </section>

            {/* LESSON SECTIONS */}

            <section className="space-y-5">

              {lesson.sections.map((section, index) => (

                <article
                  key={index}
                  className="
                    bg-slate-900
                    border
                    border-slate-800
                    rounded-xl
                    p-5
                    md:p-6
                    hover:border-slate-700
                    transition-colors
                  "
                >

                  <div className="flex items-start gap-4">

                    {/* NUMBER */}

                    <div
                      className="
                        flex-shrink-0
                        w-10
                        h-10
                        rounded-full
                        bg-blue-500/10
                        border
                        border-blue-500/20
                        text-blue-400
                        flex
                        items-center
                        justify-center
                        font-bold
                      "
                    >
                      {index + 1}
                    </div>

                    {/* CONTENT */}

                    <div className="flex-1">

                      <h2 className="text-xl md:text-2xl font-bold">
                        {section.heading}
                      </h2>

                      <p className="text-slate-400 leading-7 mt-3">
                        {section.content}
                      </p>

                    </div>

                  </div>

                </article>

              ))}

            </section>

            {/* COMPLETION */}

            <section
              className="
                mt-7
                bg-green-500/5
                border
                border-green-500/20
                rounded-xl
                p-6
              "
            >

              <div className="flex items-start gap-4">

                <div className="text-3xl">
                  🎉
                </div>

                <div>

                  <h2 className="text-xl font-bold text-green-400">
                    Lesson Complete
                  </h2>

                  <p className="text-slate-400 mt-2 leading-7">
                    You have reached the end of this lesson. Continue
                    exploring other topics to improve your financial
                    knowledge.
                  </p>

                  <button
                    onClick={backToLessons}
                    className="
                      mt-5
                      bg-green-500
                      hover:bg-green-600
                      text-white
                      px-6
                      py-3
                      rounded-lg
                      font-semibold
                      transition
                    "
                  >
                    Explore More Lessons
                  </button>

                </div>

              </div>

            </section>

          </div>

        </main>

      </div>
    );
  }

  // ======================================================
  // MAIN LEARN PAGE
  // ======================================================

  return (
    <div className="flex min-h-screen bg-slate-950 text-white">

      {/* SIDEBAR */}

      <Sidebar />

      {/* MAIN CONTENT */}

      <main className="flex-1 min-w-0 overflow-y-auto">

        <div className="max-w-[1400px] mx-auto px-5 py-7 md:px-8 lg:px-10">

          {/* ==================================================
              PAGE HEADER
          ================================================== */}

          <section className="mb-9">

            <div className="flex items-center gap-2 mb-3">

              <span className="w-2 h-2 rounded-full bg-blue-400" />

              <span className="text-xs font-semibold uppercase tracking-wider text-blue-400">
                Financial Education
              </span>

            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
              Learn Finance
            </h1>

            <p className="text-slate-400 text-sm md:text-base mt-3 max-w-3xl leading-7">
              Build your financial knowledge from the basics to advanced
              investment concepts.
            </p>

          </section>

          {/* ==================================================
              LEARNING STATS
          ================================================== */}

          <section className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">

            {/* AVAILABLE */}

            <div
              className="
                bg-slate-900
                border
                border-slate-800
                rounded-xl
                p-5
                hover:border-slate-700
                transition-colors
              "
            >

              <p className="text-sm text-slate-500">
                Available Lessons
              </p>

              <h2 className="text-3xl font-bold mt-2">
                {lessons.length}
              </h2>

            </div>

            {/* BEGINNER */}

            <div
              className="
                bg-slate-900
                border
                border-slate-800
                rounded-xl
                p-5
                hover:border-slate-700
                transition-colors
              "
            >

              <p className="text-sm text-slate-500">
                Beginner Lessons
              </p>

              <h2 className="text-3xl font-bold mt-2 text-green-400">
                {
                  lessons.filter(
                    (lesson) =>
                      lesson.level === "Beginner"
                  ).length
                }
              </h2>

            </div>

            {/* INTERMEDIATE */}

            <div
              className="
                bg-slate-900
                border
                border-slate-800
                rounded-xl
                p-5
                hover:border-slate-700
                transition-colors
              "
            >

              <p className="text-sm text-slate-500">
                Intermediate Lessons
              </p>

              <h2 className="text-3xl font-bold mt-2 text-yellow-400">
                {
                  lessons.filter(
                    (lesson) =>
                      lesson.level === "Intermediate"
                  ).length
                }
              </h2>

            </div>

          </section>

          {/* ==================================================
              COURSES HEADER
          ================================================== */}

          <section className="mb-5">

            <h2 className="text-xl md:text-2xl font-semibold">
              Available Courses
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Choose a topic and start learning.
            </p>

          </section>

          {/* ==================================================
              LESSON GRID
          ================================================== */}

          <section className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">

            {lessons.map((lesson) => (

              <article
                key={lesson.id}
                className="
                  group
                  bg-slate-900
                  border
                  border-slate-800
                  rounded-xl
                  p-5
                  hover:border-slate-700
                  hover:-translate-y-0.5
                  transition-all
                  duration-200
                "
              >

                {/* ICON + LEVEL */}

                <div className="flex justify-between items-start gap-4">

                  <div
                    className="
                      w-12
                      h-12
                      rounded-xl
                      bg-slate-800
                      flex
                      items-center
                      justify-center
                      text-2xl
                    "
                  >
                    {lesson.icon}
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      lesson.level === "Beginner"
                        ? "bg-green-500/10 text-green-400"
                        : "bg-yellow-500/10 text-yellow-400"
                    }`}
                  >
                    {lesson.level}
                  </span>

                </div>

                {/* TITLE */}

                <h3 className="text-xl font-bold mt-5">
                  {lesson.title}
                </h3>

                {/* DESCRIPTION */}

                <p className="text-sm text-slate-400 mt-3 leading-6 min-h-[72px]">
                  {lesson.description}
                </p>

                {/* TOPICS */}

                <div className="mt-5">

                  <p className="text-xs uppercase tracking-wide text-slate-600 mb-3">
                    Topics covered
                  </p>

                  <ul className="space-y-2">

                    {lesson.topics
                      .slice(0, 3)
                      .map((topic, index) => (

                        <li
                          key={index}
                          className="text-sm text-slate-300 flex items-start gap-2"
                        >

                          <span className="text-green-400">
                            ✓
                          </span>

                          <span>
                            {topic}
                          </span>

                        </li>

                      ))}

                  </ul>

                </div>

                {/* BUTTON */}

                <button
                  onClick={() => openLesson(lesson.id)}
                  className="
                    w-full
                    mt-6
                    bg-blue-500
                    hover:bg-blue-600
                    py-3
                    rounded-lg
                    font-semibold
                    transition
                  "
                >
                  Start Lesson →
                </button>

              </article>

            ))}

          </section>

          {/* ==================================================
              MONEY MENTOR TIP
          ================================================== */}

          <section
            className="
              mt-10
              bg-blue-500/5
              border
              border-blue-500/20
              rounded-xl
              p-6
            "
          >

            <div className="flex items-start gap-4">

              <div className="text-2xl">
                💡
              </div>

              <div>

                <h2 className="text-lg font-bold text-blue-400">
                  Money Mentor Tip
                </h2>

                <p className="text-sm text-slate-400 mt-2 leading-7 max-w-4xl">
                  Don't try to learn everything at once. Start with
                  personal finance and investing basics, then gradually
                  move toward stocks, IPOs, mutual funds and risk
                  management.
                </p>

              </div>

            </div>

          </section>

          {/* ==================================================
              DISCLAIMER
          ================================================== */}

          <div className="mt-10 border-t border-slate-800 pt-5 pb-3">

            <p className="text-xs text-slate-600 text-center leading-relaxed">
              Money Mentor AI provides educational information only.
              It is not professional financial advice or a recommendation
              to buy or sell securities.
            </p>

          </div>

        </div>

      </main>

    </div>
  );
}

export default Learn;