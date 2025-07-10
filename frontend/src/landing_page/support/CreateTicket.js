import React from "react";

function CreateTicket() {
  const topics = [
    {
      icon: "fa-plus-circle", // Account Opening
      title: "Account Opening",
      links: [
        "Resident individual",
        "Minor",
        "Non Resident Indian (NRI)",
        "Company, Partnership, HUF and LLP",
        "Glossary",
      ],
    },
    {
      icon: "fa-user", // Your Zerodha Account
      title: "Your Zerodha Account",
      links: [
        "Your Profile",
        "Account modification",
        "Client Master Report (CMR) and Depository Participant (DP)",
        "Nomination",
        "Transfer and conversion of securities",
      ],
    },
    {
      icon: "fa-line-chart", // Kite
      title: "Kite",
      links: [
        "IPO",
        "Trading FAQs",
        "Margin Trading Facility (MTF) and Margins",
        "Charts and orders",
        "Alerts and Nudges",
        "General",
      ],
    },
    {
      icon: "fa-credit-card", // Funds
      title: "Funds",
      links: [
        "Add money",
        "Withdraw money",
        "Add bank accounts",
        "eMandates",
      ],
    },
    {
      icon: "fa-bar-chart", // Console
      title: "Console",
      links: [
        "Portfolio",
        "Corporate actions",
        "Funds statement",
        "Reports",
        "Profile",
        "Segments",
      ],
    },
    {
      icon: "fa-circle-o", // Coin
      title: "Coin",
      links: [
        "Mutual funds",
        "National Pension Scheme (NPS)",
        "Fixed Deposit (FD)",
        "Features on Coin",
        "Payments and Orders",
        "General",
      ],
    },
  ];

  return (
    <div className="container">
      <div className="row p-5 mt-5 mb-5">
        <h1 className="fs-2 mb-4">
          To create a ticket, select a relevant topic
        </h1>
        {topics.map((topic, idx) => (
          <div key={idx} className="col-md-4 col-lg-4 mb-4">
            <h5 className="mb-3">
              <i className={`fa ${topic.icon}`} aria-hidden="true"></i>{" "}
              {topic.title}
            </h5>
            {topic.links.map((link, i) => (
              <a
                href="#"
                key={i}
                style={{
                  textDecoration: "none",
                  lineHeight: "2.3",
                  display: "block",
                  color: "#007bff",
                }}
              >
                {link}
              </a>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default CreateTicket;
